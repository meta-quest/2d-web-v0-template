import Link from "next/link";
import {
  AppWindow,
  Blocks,
  Boxes,
  CloudOff,
  Hand,
  LayoutGrid,
  Smartphone,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PanelGroup } from "@/components/quest/panel-group";
import { ThemeToggle } from "@/components/theme-toggle";

const features = [
  {
    icon: Smartphone,
    title: "Installable PWA",
    description:
      "Manifest + service worker, landscape & standalone. Ready for Meta Horizon Store packaging via Bubblewrap.",
  },
  {
    icon: LayoutGrid,
    title: "Multi-panel layout",
    description:
      "Fluid 500–2000px layout that reflows live via ResizeObserver — built for side-by-side resizable windows.",
  },
  {
    icon: AppWindow,
    title: "Multi-window sync",
    description:
      "Spawn separate windows you place around you in 3D space, kept in sync via postMessage + BroadcastChannel.",
  },
  {
    icon: Sparkles,
    title: "Quest design tokens",
    description:
      "Dark-first theme tuned to the Quest LCD, generous radii, and a 48px touch-target spacing scale.",
  },
  {
    icon: Hand,
    title: "Comfort & input",
    description:
      "Hit targets ≥48px and visible focus for controller ray-cast & hand pinch, with WCAG-grade contrast.",
  },
  {
    icon: CloudOff,
    title: "Offline-ready",
    description:
      "Service worker precaches the shell with a network-first navigation strategy and an offline fallback.",
  },
  {
    icon: Blocks,
    title: "Registry + Open in v0",
    description:
      "Components ship as a shadcn registry, installable via the CLI or opened straight into a v0 chat.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[1600px] flex-col gap-8 p-6 sm:p-8">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="bg-primary/15 text-primary flex size-touch items-center justify-center rounded-xl">
            <Boxes className="size-6" />
          </span>
          <div>
            <p className="text-lg font-semibold leading-tight">
              2d-web-v0-template
            </p>
            <p className="text-muted-foreground text-sm">
              Quest browser web starter
            </p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <section className="flex flex-col gap-6 rounded-3xl border bg-card p-8 sm:p-12">
        <div className="flex flex-wrap gap-2">
          <Badge>PWA</Badge>
          <Badge variant="secondary">Multi-panel</Badge>
          <Badge variant="outline">Next.js + shadcn/ui</Badge>
        </div>
        <h1 className="max-w-3xl text-4xl font-semibold text-balance sm:text-5xl">
          Build 2D web apps for the Meta Quest browser.
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg text-pretty">
          A batteries-included starter tuned for VR panels: dark, legible,
          comfortable, multi-panel, and installable as a PWA.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="xl">
            <Link href="/panels">
              <LayoutGrid />
              Multi-panel demo
            </Link>
          </Button>
          <Button asChild size="xl" variant="outline">
            <Link href="/windows">
              <AppWindow />
              Multi-window demo
            </Link>
          </Button>
          <Button asChild size="xl" variant="ghost">
            <a
              href="https://developers.meta.com/horizon/documentation/web/pwa-gs/"
              target="_blank"
              rel="noreferrer"
            >
              <Smartphone />
              Install as PWA
            </a>
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">
          Want immersive VR/AR instead? Use the companion{" "}
          <span className="text-foreground font-medium">webxr-iwsdk</span>{" "}
          template.
        </p>
      </section>

      <section className="flex-1">
        <PanelGroup maxColumns={3}>
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="h-full">
              <CardHeader>
                <span className="bg-accent text-accent-foreground mb-2 flex size-11 items-center justify-center rounded-lg">
                  <Icon className="size-5" />
                </span>
                <CardTitle>{title}</CardTitle>
                <CardDescription className="text-pretty">
                  {description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </PanelGroup>
      </section>

      <footer className="text-muted-foreground flex flex-wrap items-center justify-between gap-3 border-t pt-6 text-sm">
        <p>
          Open this URL in the Meta Quest browser, or install it as a PWA from
          the browser menu.
        </p>
        <a
          className="hover:text-foreground underline underline-offset-4"
          href="https://developers.meta.com/horizon/develop/web"
          target="_blank"
          rel="noreferrer"
        >
          Meta Horizon web docs ↗
        </a>
      </footer>
    </div>
  );
}
