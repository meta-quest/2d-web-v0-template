/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { Metadata, Viewport } from "next";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { RegisterSW } from "@/components/register-sw";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "v0-quest",
  title: {
    default: "v0-quest — Quest-ready web starter",
    template: "%s · v0-quest",
  },
  description:
    "A v0.app / Vercel starter optimized for the Meta Quest browser: PWA, multi-panel responsive layout, WebXR, and Quest-tuned design tokens.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "v0-quest",
  },
  formatDetection: { telephone: false },
  openGraph: {
    title: "v0-quest — Quest-ready web starter",
    description:
      "PWA + multi-panel + WebXR starter tuned for the Meta Quest browser.",
    url: siteUrl,
    siteName: "v0-quest",
    type: "website",
  },
};

export const viewport: Viewport = {
  // Honored in the Quest browser's mobile mode; ignored in the default desktop
  // mode. Either way, the layout is fluid across the 500–2000px panel range.
  width: "device-width",
  initialScale: 1,
  // Matches the Horizon OS surface tokens in app/globals.css — the dark floor
  // (#1A1A1A) and a light page that stays under the #dadada ceiling.
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
    { media: "(prefers-color-scheme: light)", color: "#dadada" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <RegisterSW />
      </body>
    </html>
  );
}
