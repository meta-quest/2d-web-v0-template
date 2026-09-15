"use client";

import * as React from "react";

import { usePanelSize } from "@/hooks/use-panel-size";
import { cn } from "@/lib/utils";

type PanelGroupProps = {
  children: React.ReactNode;
  /** Max columns to show when there's room. Defaults to 3. */
  maxColumns?: number;
  className?: string;
};

/**
 * Responsive multi-panel layout.
 *
 * The Quest browser lets users place several resizable windows side by side and
 * drag any one to a new size at any moment. This arranges its children into a
 * column count derived from the *live* container width (via ResizeObserver),
 * collapsing to a single scrolling column on narrow/compact panels. The data
 * attributes expose the current bucket so children can adapt further.
 */
export function PanelGroup({
  children,
  maxColumns = 3,
  className,
}: PanelGroupProps) {
  const [ref, size] = usePanelSize<HTMLDivElement>();

  const columns = React.useMemo(() => {
    // ~420px is a comfortable minimum panel column on Quest.
    const fit = Math.max(1, Math.floor(size.width / 420));
    return Math.min(maxColumns, fit);
  }, [size.width, maxColumns]);

  return (
    <div
      ref={ref}
      data-slot="panel-group"
      data-bucket={size.bucket}
      data-columns={columns}
      className={cn("grid h-full min-h-0 gap-4", className)}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {children}
    </div>
  );
}
