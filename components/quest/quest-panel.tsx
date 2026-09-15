import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * A content panel sized for the Quest browser / Horizon OS window model.
 *
 * Horizon OS provides the window chrome (title bar, close/minimize/theater),
 * so panel content should fill edge-to-edge. This component is a flex column
 * that grows to fill its parent and keeps a comfortable dark surface.
 */
function QuestPanel({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="quest-panel"
      className={cn(
        "bg-card text-card-foreground flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border shadow-sm",
        className
      )}
      {...props}
    />
  );
}

function QuestPanelHeader({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="quest-panel-header"
      className={cn(
        "flex min-h-touch items-center justify-between gap-3 border-b px-5 py-3",
        className
      )}
      {...props}
    />
  );
}

function QuestPanelTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="quest-panel-title"
      /* Horizon OS Headline 3 (20/24dp) — the style for a panel/section title. */
      className={cn("text-headline-3 font-semibold", className)}
      {...props}
    />
  );
}

/** Scrollable body. Fills remaining height; scrolls with the thumbstick. */
function QuestPanelBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="quest-panel-body"
      className={cn("min-h-0 flex-1 overflow-y-auto p-5", className)}
      {...props}
    />
  );
}

function QuestPanelFooter({ className, ...props }: React.ComponentProps<"footer">) {
  return (
    <footer
      data-slot="quest-panel-footer"
      className={cn("flex items-center gap-3 border-t px-5 py-3", className)}
      {...props}
    />
  );
}

export {
  QuestPanel,
  QuestPanelHeader,
  QuestPanelTitle,
  QuestPanelBody,
  QuestPanelFooter,
};
