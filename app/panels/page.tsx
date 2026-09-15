"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Music,
  Plus,
  Settings2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { PanelGroup } from "@/components/quest/panel-group";
import {
  QuestPanel,
  QuestPanelBody,
  QuestPanelFooter,
  QuestPanelHeader,
  QuestPanelTitle,
} from "@/components/quest/quest-panel";

const tasks = [
  { label: "Open the page in the Quest browser", done: true },
  { label: "Resize this window by dragging an edge", done: true },
  { label: "Add a second window side by side", done: false },
  { label: "Install as a PWA from the browser menu", done: false },
  { label: "Try the WebXR demo", done: false },
];

const tracks = [
  { title: "Ambient Focus", meta: "Spatial · 24 min" },
  { title: "Deep Work", meta: "Stereo · 41 min" },
  { title: "Lo-fi Orbit", meta: "Spatial · 58 min" },
];

export default function PanelsPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const [handHints, setHandHints] = React.useState(true);
  const [comfort, setComfort] = React.useState(false);

  return (
    <div className="flex h-dvh flex-col gap-4 p-4 sm:p-6">
      <header className="flex items-center justify-between gap-4">
        <Button asChild variant="outline" size="xl">
          <Link href="/">
            <ArrowLeft />
            Back
          </Link>
        </Button>
        <p className="text-muted-foreground hidden text-sm sm:block">
          Drag a window edge to resize — the layout reflows live.
        </p>
        <Badge variant="secondary">Multi-panel</Badge>
      </header>

      <div className="min-h-0 flex-1">
        <PanelGroup maxColumns={3}>
          {/* Panel 1 — Tasks */}
          <QuestPanel>
            <QuestPanelHeader>
              <QuestPanelTitle>Tasks</QuestPanelTitle>
              <Badge variant="secondary">
                {tasks.filter((t) => !t.done).length} left
              </Badge>
            </QuestPanelHeader>
            <QuestPanelBody className="flex flex-col gap-1">
              {tasks.map((t) => (
                <button
                  key={t.label}
                  className="hover:bg-accent flex min-h-touch items-center gap-3 rounded-lg px-3 text-left transition-colors"
                >
                  {t.done ? (
                    <CheckCircle2 className="text-primary size-5 shrink-0" />
                  ) : (
                    <Circle className="text-muted-foreground size-5 shrink-0" />
                  )}
                  <span className={t.done ? "text-muted-foreground line-through" : ""}>
                    {t.label}
                  </span>
                </button>
              ))}
            </QuestPanelBody>
            <QuestPanelFooter>
              <Button size="xl" className="w-full">
                <Plus />
                Add task
              </Button>
            </QuestPanelFooter>
          </QuestPanel>

          {/* Panel 2 — Library */}
          <QuestPanel>
            <QuestPanelHeader>
              <QuestPanelTitle>Library</QuestPanelTitle>
              <Music className="text-muted-foreground size-5" />
            </QuestPanelHeader>
            <QuestPanelBody className="flex flex-col gap-2">
              {tracks.map((track) => (
                <button
                  key={track.title}
                  className="hover:bg-accent flex min-h-touch items-center gap-3 rounded-lg px-3 text-left transition-colors"
                >
                  <span className="bg-primary/15 text-primary flex size-10 items-center justify-center rounded-md">
                    <Music className="size-5" />
                  </span>
                  <span className="flex flex-col">
                    <span className="font-medium">{track.title}</span>
                    <span className="text-muted-foreground text-sm">
                      {track.meta}
                    </span>
                  </span>
                </button>
              ))}
            </QuestPanelBody>
          </QuestPanel>

          {/* Panel 3 — Settings */}
          <QuestPanel>
            <QuestPanelHeader>
              <QuestPanelTitle>Settings</QuestPanelTitle>
              <Settings2 className="text-muted-foreground size-5" />
            </QuestPanelHeader>
            <QuestPanelBody className="flex flex-col gap-1">
              <SettingRow
                label="Dark theme"
                hint="Recommended for the Quest LCD"
                checked={resolvedTheme === "dark"}
                onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
              />
              <Separator />
              <SettingRow
                label="Hand-tracking hints"
                hint="Show pinch / point affordances"
                checked={handHints}
                onCheckedChange={setHandHints}
              />
              <Separator />
              <SettingRow
                label="Comfort vignette"
                hint="Reduce motion discomfort"
                checked={comfort}
                onCheckedChange={setComfort}
              />
            </QuestPanelBody>
          </QuestPanel>
        </PanelGroup>
      </div>
    </div>
  );
}

function SettingRow({
  label,
  hint,
  checked,
  onCheckedChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <label className="flex min-h-touch cursor-pointer items-center justify-between gap-4 rounded-lg px-3">
      <span className="flex flex-col">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground text-sm">{hint}</span>
      </span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </label>
  );
}
