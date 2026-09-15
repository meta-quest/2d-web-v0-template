"use client";

import Link from "next/link";
import { AppWindow, ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSharedWindowState } from "@/hooks/use-shared-window-state";
import {
  Controls,
  DEFAULT_STATE,
  SharedStage,
  WINDOWS_CHANNEL,
  type DemoState,
} from "../demo-ui";

/**
 * A detached window. Opened from the controller (or directly), it joins the same
 * channel and stays in sync — and its controls update every other window too.
 * On Quest this is its own panel you can place anywhere in your space.
 */
export default function WindowDetailPage() {
  const { state, setState, ready } = useSharedWindowState<DemoState>(
    WINDOWS_CHANNEL,
    DEFAULT_STATE,
  );

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[760px] flex-col gap-4 p-4 sm:p-6">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <AppWindow className="text-primary size-5" />
          <span className="font-semibold">Detail window</span>
        </div>
        <Badge variant={ready ? "default" : "secondary"}>
          {ready ? "Synced" : "Connecting…"}
        </Badge>
      </header>

      <SharedStage state={state} />
      <Controls state={state} setState={setState} />

      <Button asChild variant="ghost" size="xl" className="self-start">
        <Link href="/windows">
          <ArrowLeft />
          Open the controller
        </Link>
      </Button>
    </div>
  );
}
