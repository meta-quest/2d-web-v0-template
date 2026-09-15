import type { MetadataRoute } from "next";

/**
 * PWA manifest (served at /manifest.webmanifest).
 *
 * Quest specifics:
 * - `orientation: "landscape"` — VR panels are landscape.
 * - `display: "standalone"` for a 2D-panel PWA. For an immersive WebXR PWA that
 *   should boot straight into VR/AR, use `"fullscreen"` instead.
 * - At least one 512×512 icon is required for Meta Horizon Store packaging
 *   (Bubblewrap / TWA), plus a maskable variant.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "v0-quest — Quest-ready web starter",
    short_name: "v0-quest",
    description:
      "PWA + multi-panel + WebXR starter tuned for the Meta Quest browser.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "landscape",
    // Matches the dark page surface in app/globals.css — also the PWA splash
    // background, so the splash and the first paint agree.
    background_color: "#1a1a1a",
    theme_color: "#1a1a1a",
    categories: ["productivity", "utilities", "entertainment"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
