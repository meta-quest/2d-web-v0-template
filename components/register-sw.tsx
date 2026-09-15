/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use client";

import * as React from "react";

/**
 * Registers the service worker (production only) so the app is installable as a
 * PWA on Quest. A service worker + offline fallback is required for Quest PWAs.
 */
export function RegisterSW() {
  React.useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" ||
      typeof navigator === "undefined" ||
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .catch(() => {
        // Registration failures are non-fatal; the app still works online.
      });
  }, []);

  return null;
}
