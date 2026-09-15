# 2D Web Template for v0

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Framework: Next.js](https://img.shields.io/badge/Framework-Next.js-000000.svg)](https://nextjs.org/)

A **v0.app / Vercel 2D-web starter for the Meta Quest browser**. A modern
Next.js + shadcn/ui app that is dark, legible, comfortable, **installable as a
PWA**, and **multi-panel responsive** — no WebXR/3D dependencies.

> For immersive VR/AR, use the sibling [`iwsdk-v0-template`](https://github.com/meta-quest/iwsdk-v0-template)
> template (Vite + Meta's Immersive Web SDK).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmeta-quest%2F2d-web-v0-template)

> Built on Next.js (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
> shadcn/ui (new-york).

---

## What you get

| Area | Included |
|---|---|
| **Design tokens** | Meta Horizon OS theme — neutral surfaces clamped to the `#1A1A1A`/`#DADADA` bounds, Meta blue accent, the Horizon type scale, pill controls and large panel radii, plus a `touch` spacing scale (48 / 56px) |
| **Multi-panel** | `PanelGroup` + `usePanelSize` reflow the layout live via `ResizeObserver`; `QuestPanel` fills the Horizon OS window edge-to-edge |
| **Multi-window** | `lib/window-bus.ts` + `useSharedWindowState` coordinate **separate** browser windows (placed around you in 3D space) via `postMessage` + `BroadcastChannel` |
| **PWA** | `app/manifest.ts` (landscape, standalone, maskable icons), `public/sw.js` offline service worker, `/offline` fallback, generated icons |
| **Components** | shadcn/ui primitives (Button w/ Quest `xl`/`icon-touch` sizes, Card, Badge, Switch, Separator, ScrollArea) + theme toggle |
| **Registry** | `registry.json` so the Quest components install via the shadcn CLI and **Open in v0** |
| **Docs** | [`docs/QUEST_GUIDELINES.md`](docs/QUEST_GUIDELINES.md) — the full Quest web checklist with sources |

Routes: `/` landing · `/panels` multi-panel demo · `/windows` multi-window demo (+ `/windows/detail`).

---

## Quick start

```bash
npm install
npm run icons      # generate PWA icons (zero deps; already committed)
npm run dev        # http://localhost:3000

# PWA install requires a secure context:
npm run dev:https  # https://localhost:3000
```

Then open the URL in the **Meta Quest browser**. For on-device debugging, use
`chrome://inspect#devices`.

---

## Project structure

```
app/
  layout.tsx        # metadata, viewport, theme provider, SW registration
  page.tsx          # landing (feature grid via PanelGroup)
  panels/page.tsx   # multi-panel responsive demo
  windows/          # multi-window demo (page = controller, detail/ = child, demo-ui.tsx = shared)
  manifest.ts       # PWA manifest → /manifest.webmanifest
  offline/page.tsx  # offline fallback
  globals.css       # Tailwind v4 + Quest-tuned design tokens
components/
  ui/               # shadcn/ui primitives
  quest/            # QuestPanel, PanelGroup
  theme-provider.tsx, theme-toggle.tsx, register-sw.tsx, open-in-v0-button.tsx
hooks/              # usePanelSize, useSharedWindowState
lib/                # utils (cn), quest (platform constants), window-bus (cross-window messaging)
public/             # sw.js, icons/
scripts/            # generate-icons.mjs
registry.json       # shadcn / v0 registry
```

---

## Using the registry / Open in v0

```bash
npx shadcn@latest build      # outputs public/r/*.json
```

Once deployed, install a component into any shadcn project:

```bash
npx shadcn@latest add https://your-deploy.vercel.app/r/panel-group.json
```

…or wire up an **Open in v0** button (included as
`components/open-in-v0-button.tsx`):

```tsx
<OpenInV0Button url="https://your-deploy.vercel.app/r/quest-panel.json" />
```

> Note: the v0 "open" endpoint doesn't apply per-item `cssVars`/`css`/`envVars`,
> so this template keeps theme tokens in `app/globals.css`.

---

## Multi-panel vs multi-window

Two different things, both useful on Quest:

- **Multi-panel** (`/panels`) — *one* window whose layout reflows into multiple
  columns as it's resized (`PanelGroup` + `usePanelSize`). One browsing context.
- **Multi-window** (`/windows`) — *several* browser windows the user arranges
  anywhere around them in 3D space, each its own browsing context, **coordinated
  with each other**. Open one with `window.open()`; keep them in sync over a
  `BroadcastChannel` (works even when COOP nulls `window.opener`), with direct
  `window.postMessage` available for targeting a specific window or sending
  zero-copy `Transferable`s (e.g. an `ImageBitmap`).

The plumbing is `lib/window-bus.ts` (a tiny typed bus) and the
`useSharedWindowState` hook. The demo shares a `{ count, accent, note }` object:
change it in any window — controller or detached — and every window updates live.

```ts
import { useSharedWindowState } from "@/hooks/use-shared-window-state";

const { state, setState, openWindow } = useSharedWindowState("my-app", { count: 0 });
// open a window the user can place in space; it syncs automatically:
openWindow("/windows/detail", "detail", "popup,width=900,height=720");
setState((s) => ({ ...s, count: s.count + 1 })); // broadcasts to every window
```

> Note: `window.open()` must be called from a user gesture (a click). For very
> large/streamed payloads, prefer `bus.postTo(win, data, [transferable])` to move
> bytes without copying.

---

## Quest-specific notes

- **Hit targets:** use `size="xl"` / `size="icon-touch"` on Button, or the
  `min-h-touch` / `size-touch` utilities, to meet the 48px minimum.
- **Dark by default:** the theme follows the [Horizon OS design guidelines](https://developers.meta.com/horizon/design/styles_color/) —
  dark surfaces never go below `#1A1A1A`, light surfaces never above `#DADADA`,
  and pure black/white are avoided entirely. See the comments in
  `app/globals.css`.
- **Horizon type scale:** `text-headline-1/2/3` (32/24/20dp) and `text-body-1`
  (14dp) map 1:1 onto the published scale, which is why the root font size stays
  at 16px. `text-body-2` (11dp) exists for parity but sits below the 14px
  legibility floor — don't put real content in it.
- **Pill controls:** Buttons and badges are fully rounded, and Button carries the
  Horizon OS UI Set variants (`bordered`, `borderless`) alongside the stock
  shadcn names.
- **Fluid layout:** assume your page is one resizable panel among several; the
  layout reflows from ~500px to 2000px wide.
- **Going further:** read [`docs/QUEST_GUIDELINES.md`](docs/QUEST_GUIDELINES.md)
  for layout, input, and PWA packaging (Bubblewrap → Meta Horizon Store) guidance.

---

## Contributing

Pull requests are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) for the
checks to run before opening one, and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
for community expectations.

---

## License

Licensed under the MIT License. See [LICENSE](LICENSE) for the full text — use
it as a starting point for anything.
