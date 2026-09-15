import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * "Open in v0" button. Opens a registry item directly in a v0.dev chat.
 * `url` must be the publicly reachable JSON of a registry item, e.g.
 * `https://your-template.vercel.app/r/quest-panel.json`.
 *
 * Note: the v0 open endpoint does NOT apply per-item cssVars/css/envVars or
 * namespaced registries — keep theme tokens in app/globals.css.
 */
export function OpenInV0Button({
  url,
  className,
}: {
  url: string;
  className?: string;
}) {
  return (
    <Button
      aria-label="Open in v0"
      asChild
      size="sm"
      className={cn(
        "gap-1.5 bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90",
        className
      )}
    >
      <a
        href={`https://v0.dev/chat/api/open?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer"
      >
        Open in{" "}
        <svg
          viewBox="0 0 40 20"
          aria-hidden="true"
          className="h-4 w-8 fill-current"
        >
          <path d="M23.3 0h4.84l-7.2 18.6h-4.94L8.8 0h4.94l4.78 13.2L23.3 0Zm10.06 18.9c-3.6 0-6.16-2.5-6.16-6.7 0-4.18 2.6-6.74 6.2-6.74 3.62 0 6.16 2.52 6.16 6.62v1.36h-8.3c.22 1.78 1.2 2.74 2.94 2.74 1.3 0 2.16-.5 2.5-1.46h2.74c-.5 2.6-2.62 4.18-6.08 4.18Zm-2.04-8.04h5.34c-.12-1.62-1.06-2.5-2.6-2.5-1.46 0-2.46.9-2.74 2.5Z" />
        </svg>
      </a>
    </Button>
  );
}
