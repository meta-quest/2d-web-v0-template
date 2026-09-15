"use client";

import * as React from "react";

import { QUEST_PANEL } from "@/lib/quest";

export type PanelBucket = "compact" | "default" | "wide" | "ultrawide";

export type PanelSize = {
  width: number;
  height: number;
  /** Coarse width bucket relative to the Quest panel envelope. */
  bucket: PanelBucket;
  /** width / height. Quest panels can be dragged to unusual ratios. */
  aspect: number;
};

function bucketFor(width: number): PanelBucket {
  if (width < 760) return "compact";
  if (width < QUEST_PANEL.width.default) return "default";
  if (width < 1700) return "wide";
  return "ultrawide";
}

/**
 * Track the live size of a container with a ResizeObserver. Quest browser
 * panels can be grabbed and resized at any moment (and a page may be one panel
 * among several), so layout must respond continuously rather than to fixed
 * breakpoints. Attach the returned `ref` to your root element.
 */
export function usePanelSize<T extends HTMLElement = HTMLDivElement>(): [
  React.RefObject<T | null>,
  PanelSize,
] {
  const ref = React.useRef<T>(null);
  const [size, setSize] = React.useState<PanelSize>({
    width: QUEST_PANEL.width.default,
    height: QUEST_PANEL.height.default,
    bucket: "default",
    aspect: QUEST_PANEL.width.default / QUEST_PANEL.height.default,
  });

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSize({
        width,
        height,
        bucket: bucketFor(width),
        aspect: height > 0 ? width / height : 1,
      });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, size];
}
