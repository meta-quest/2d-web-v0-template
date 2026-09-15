/**
 * Cross-window message bus for coordinating multiple browser windows.
 *
 * Why this matters on Quest: the Quest browser can show many windows at once,
 * floating anywhere in your space. So a single web app isn't limited to one
 * panel (or even several panels in one layout) — it can `window.open()` extra
 * windows that the user arranges around them in the full 3D space, and keep them
 * in sync. (This is a 2D-web capability; immersive WebXR uses a different model.)
 *
 * Transport strategy (mirrors robust multi-window apps such as detached medical
 * image viewers):
 *  - A **BroadcastChannel** carries messages to every same-origin window. It works
 *    regardless of the opener relationship and survives COOP, which can null out
 *    `window.opener`. This is the default for `post()`.
 *  - **Direct `window.postMessage`** is used by `postTo()` for targeting one window
 *    and for zero-copy **Transferables** (ImageBitmap / ArrayBuffer), which
 *    BroadcastChannel cannot transfer.
 *  - If BroadcastChannel is unavailable, `post()` falls back to direct messaging of
 *    `window.opener` + tracked child windows.
 *
 * Every inbound DOM `message` is origin-checked. Messages are wrapped in an
 * envelope tagged with the channel name and the sender id so unrelated apps on the
 * same origin don't cross-talk and a window ignores its own broadcasts.
 */

export type BusEnvelope<T> = {
  __channel: string;
  from: string;
  data: T;
};

export type BusHandler<T> = (
  data: T,
  meta: { from: string; source: Window | null },
) => void;

export type WindowBus<T> = {
  /** This window's stable id within the channel. */
  id: string;
  /** Broadcast to all same-origin windows. */
  post: (data: T) => void;
  /** Send to one specific window; supports zero-copy Transferables. */
  postTo: (win: Window, data: T, transfer?: Transferable[]) => void;
  /** Subscribe to inbound messages; returns an unsubscribe fn. */
  on: (handler: BusHandler<T>) => () => void;
  /** Open + track a child window. Must be called from a user gesture (click). */
  openWindow: (url: string, name?: string, features?: string) => Window | null;
  /** Live (non-closed) child windows opened via this bus. */
  windows: () => Window[];
  /** Remove listeners and close the channel. */
  close: () => void;
};

function randomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `win-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e9).toString(36)}`;
}

/**
 * Create a window bus on `channel`. Browser-only (call from a client component /
 * effect). Remember to `close()` it on unmount.
 */
export function createWindowBus<T = unknown>(channel: string): WindowBus<T> {
  if (typeof window === "undefined") {
    throw new Error("createWindowBus must run in the browser");
  }

  const id = randomId();
  const origin = window.location.origin;
  const handlers = new Set<BusHandler<T>>();
  const children = new Set<Window>();
  const bc = "BroadcastChannel" in window ? new BroadcastChannel(channel) : null;

  function deliver(env: BusEnvelope<T> | null, source: Window | null) {
    if (!env || env.__channel !== channel || env.from === id) return;
    for (const handler of handlers) handler(env.data, { from: env.from, source });
  }

  const onWindowMessage = (e: MessageEvent) => {
    if (e.origin !== origin) return;
    deliver(
      e.data as BusEnvelope<T> | null,
      e.source instanceof Window ? e.source : null,
    );
  };
  const onChannelMessage = (e: MessageEvent) =>
    deliver(e.data as BusEnvelope<T> | null, null);

  window.addEventListener("message", onWindowMessage);
  bc?.addEventListener("message", onChannelMessage);

  function envelope(data: T): BusEnvelope<T> {
    return { __channel: channel, from: id, data };
  }

  function pruneChildren() {
    for (const win of children) if (win.closed) children.delete(win);
  }

  return {
    id,
    post(data) {
      const env = envelope(data);
      if (bc) {
        bc.postMessage(env);
        return;
      }
      // Fallback when BroadcastChannel is unavailable.
      const opener = window.opener;
      if (opener instanceof Window && !opener.closed) {
        try {
          opener.postMessage(env, origin);
        } catch {
          /* opener gone */
        }
      }
      pruneChildren();
      for (const win of children) {
        try {
          win.postMessage(env, origin);
        } catch {
          children.delete(win);
        }
      }
    },
    postTo(win, data, transfer) {
      try {
        win.postMessage(envelope(data), origin, transfer ?? []);
      } catch {
        children.delete(win);
      }
    },
    on(handler) {
      handlers.add(handler);
      return () => handlers.delete(handler);
    },
    openWindow(url, name, features) {
      const win = window.open(
        url,
        name ?? "_blank",
        features ?? "popup,width=1000,height=800",
      );
      if (win) children.add(win);
      return win;
    },
    windows() {
      pruneChildren();
      return [...children];
    },
    close() {
      window.removeEventListener("message", onWindowMessage);
      bc?.removeEventListener("message", onChannelMessage);
      bc?.close();
      handlers.clear();
      children.clear();
    },
  };
}
