"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  QuestPanel,
  QuestPanelBody,
  QuestPanelHeader,
  QuestPanelTitle,
} from "@/components/quest/quest-panel";

/** Channel + shape of the state shared across windows. */
export const WINDOWS_CHANNEL = "quest-windows-demo";

export type DemoState = { count: number; accent: string; note: string };

export const DEFAULT_STATE: DemoState = {
  count: 0,
  accent: "#7c6cff",
  note: "",
};

export const ACCENTS = [
  { name: "Violet", value: "#7c6cff" },
  { name: "Teal", value: "#22c3a6" },
  { name: "Amber", value: "#f0a23b" },
  { name: "Rose", value: "#f0566f" },
];

/** Big visual readout of the shared state — obvious when it syncs across windows. */
export function SharedStage({ state }: { state: DemoState }) {
  return (
    <section
      className="flex flex-col items-center justify-center gap-4 rounded-3xl border-2 p-8 transition-colors"
      style={{ borderColor: state.accent }}
    >
      <div
        className="size-24 rounded-2xl transition-colors"
        style={{ backgroundColor: state.accent }}
      />
      <p className="text-6xl font-semibold tabular-nums">{state.count}</p>
      <p className="text-muted-foreground min-h-6 max-w-md text-center text-pretty">
        {state.note || "Shared state syncs across every window"}
      </p>
    </section>
  );
}

/** Controls that mutate the shared state — identical in every window (bidirectional). */
export function Controls({
  state,
  setState,
}: {
  state: DemoState;
  setState: (next: DemoState | ((prev: DemoState) => DemoState)) => void;
}) {
  return (
    <QuestPanel>
      <QuestPanelHeader>
        <QuestPanelTitle>Shared controls</QuestPanelTitle>
      </QuestPanelHeader>
      <QuestPanelBody className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <Button
            size="icon-touch"
            variant="outline"
            aria-label="Decrease"
            onClick={() => setState((p) => ({ ...p, count: p.count - 1 }))}
          >
            <Minus />
          </Button>
          <span className="min-w-12 text-center text-2xl font-semibold tabular-nums">
            {state.count}
          </span>
          <Button
            size="icon-touch"
            variant="outline"
            aria-label="Increase"
            onClick={() => setState((p) => ({ ...p, count: p.count + 1 }))}
          >
            <Plus />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {ACCENTS.map((a) => (
            <button
              key={a.value}
              type="button"
              aria-label={a.name}
              onClick={() => setState((p) => ({ ...p, accent: a.value }))}
              className="size-touch rounded-lg border-2 transition-transform hover:scale-105"
              style={{
                backgroundColor: a.value,
                borderColor:
                  state.accent === a.value ? "var(--foreground)" : "transparent",
              }}
            />
          ))}
        </div>

        <input
          value={state.note}
          onChange={(e) => setState((p) => ({ ...p, note: e.target.value }))}
          placeholder="Type a note — it appears in every window"
          className="bg-background min-h-touch focus-visible:ring-ring rounded-lg border px-4 text-base outline-none focus-visible:ring-2"
        />
      </QuestPanelBody>
    </QuestPanel>
  );
}
