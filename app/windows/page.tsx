"use client";

import * as React from "react";
import Link from "next/link";
import { AppWindow, ArrowLeft, Plus, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  QuestPanel,
  QuestPanelBody,
  QuestPanelFooter,
  QuestPanelHeader,
  QuestPanelTitle,
} from "@/components/quest/quest-panel";
import { useSharedWindowState } from "@/hooks/use-shared-window-state";
import {
  Controls,
  DEFAULT_STATE,
  SharedStage,
  WINDOWS_CHANNEL,
  type DemoState,
} from "./demo-ui";

export default function WindowsPage() {
  const { state, setState, openWindow, windows, ready } =
    useSharedWindowState<DemoState>(WINDOWS_CHANNEL, DEFAULT_STATE);
  const [openCount, setOpenCount] = React.useState(0);

  React.useEffect(() => {
    const id = window.setInterval(() => setOpenCount(windows().length), 1000);
    return () => window.clearInterval(id);
  }, [windows]);

  const openDetail = () =>
    openWindow(
      "/windows/detail",
      `quest-detail-${Date.now().toString(36)}`,
      "popup,width=900,height=720",
    );

  const closeAll = () => {
    for (const w of windows()) {
      try {
        w.close();
      } catch {
        /* ignore */
      }
    }
    setOpenCount(0);
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[1200px] flex-col gap-4 p-4 sm:p-6">
      <header className="flex items-center justify-between gap-4">
        <Button asChild variant="outline" size="xl">
          <Link href="/">
            <ArrowLeft />
            Back
          </Link>
        </Button>
        <Badge variant="secondary">
          {ready
            ? `${openCount} window${openCount === 1 ? "" : "s"} open`
            : "Connecting…"}
        </Badge>
      </header>

      <SharedStage state={state} />

      <div className="grid gap-4 md:grid-cols-2">
        <Controls state={state} setState={setState} />

        <QuestPanel>
          <QuestPanelHeader>
            <QuestPanelTitle>Multi-window</QuestPanelTitle>
            <AppWindow className="text-muted-foreground size-5" />
          </QuestPanelHeader>
          <QuestPanelBody className="flex flex-col gap-3">
            <p className="text-muted-foreground text-sm text-pretty">
              Open extra windows and place them anywhere around you in 3D space.
              Every window shares the state above — change it here or in any
              window and they all update live.
            </p>
            <Button size="xl" onClick={openDetail}>
              <Plus />
              Open a window
            </Button>
            <Button size="xl" variant="outline" onClick={closeAll}>
              <X />
              Close all windows
            </Button>
          </QuestPanelBody>
          <QuestPanelFooter className="text-muted-foreground text-body-1">
            Coordinated via postMessage + BroadcastChannel — see
            lib/window-bus.ts
          </QuestPanelFooter>
        </QuestPanel>
      </div>
    </div>
  );
}
