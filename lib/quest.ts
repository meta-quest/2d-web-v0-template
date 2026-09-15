/**
 * Quest platform constants and helpers.
 *
 * Numbers are sourced from Meta's Horizon OS design + web docs. Treat dp ≈ CSS
 * px at the default panel scale. See docs/QUEST_GUIDELINES.md for citations.
 */

/** Meta Quest Browser 2D panel size envelope (CSS px). */
export const QUEST_PANEL = {
  /** Resizable width range of a browser panel. */
  width: { min: 500, default: 1280, max: 2000 },
  /** Resizable height range of a browser panel. */
  height: { min: 495, default: 670, max: 1070 },
} as const;

/** Ergonomic interaction sizes (CSS px). */
export const QUEST_TARGET = {
  /** Minimum hit target — 48dp / ~22mm / 3° FOV at 0.42m. */
  hitMin: 48,
  /** Comfortable hit target for controller ray-cast. */
  hitComfortable: 56,
  /** Minimum visible control size. */
  visualMin: 32,
} as const;

/**
 * Best-effort detection that we're running inside the Meta Quest Browser.
 * Per Meta's guidance, do NOT use this for feature gating — feature-detect
 * (navigator.xr, etc.) instead. Use it only for analytics / cosmetic hints.
 */
export function isQuestBrowser(userAgent?: string): boolean {
  const ua = userAgent ?? (typeof navigator !== "undefined" ? navigator.userAgent : "");
  return /\bOculusBrowser\b/i.test(ua) || /\bQuest\b/.test(ua);
}
