"use client";

import * as React from "react";

import { createWindowBus, type WindowBus } from "@/lib/window-bus";

type SyncMsg<S> = { kind: "state"; state: S } | { kind: "hello" };

export type SharedWindowState<S> = {
  /** The current shared state (synced across all same-origin windows). */
  state: S;
  /** Update locally and broadcast to every other window. */
  setState: (next: S | ((prev: S) => S)) => void;
  /** Open + track a child window (call from a click). null until mounted. */
  openWindow: (url: string, name?: string, features?: string) => Window | null;
  /** Live child windows opened from this window. */
  windows: () => Window[];
  /** True once the bus is connected (client-mounted). */
  ready: boolean;
};

/**
 * Share a single state object across every same-origin browser window on a named
 * channel. Any window can update it; all windows converge (last-write-wins). A
 * freshly opened window broadcasts `hello` and the others reply with the current
 * state, so it catches up immediately.
 *
 * On Quest, open several windows with `openWindow(...)`, place them around your
 * space, and they all stay in sync. See `lib/window-bus.ts` for the transport.
 */
export function useSharedWindowState<S>(
  channel: string,
  initial: S,
): SharedWindowState<S> {
  const busRef = React.useRef<WindowBus<SyncMsg<S>> | null>(null);
  const stateRef = React.useRef<S>(initial);
  const [state, setLocal] = React.useState<S>(initial);
  const [ready, setReady] = React.useState(false);

  stateRef.current = state;

  React.useEffect(() => {
    const bus = createWindowBus<SyncMsg<S>>(channel);
    busRef.current = bus;
    setReady(true);

    const off = bus.on((msg) => {
      if (msg.kind === "state") {
        setLocal(msg.state);
      } else if (msg.kind === "hello") {
        // A new window joined — share our current snapshot.
        bus.post({ kind: "state", state: stateRef.current });
      }
    });

    // Ask any existing windows for the latest state.
    bus.post({ kind: "hello" });

    return () => {
      off();
      bus.close();
      busRef.current = null;
      setReady(false);
    };
  }, [channel]);

  const setState = React.useCallback((next: S | ((prev: S) => S)) => {
    setLocal((prev) => {
      const value =
        typeof next === "function" ? (next as (p: S) => S)(prev) : next;
      busRef.current?.post({ kind: "state", state: value });
      return value;
    });
  }, []);

  const openWindow = React.useCallback(
    (url: string, name?: string, features?: string) =>
      busRef.current?.openWindow(url, name, features) ?? null,
    [],
  );

  const windows = React.useCallback(() => busRef.current?.windows() ?? [], []);

  return { state, setState, openWindow, windows, ready };
}
