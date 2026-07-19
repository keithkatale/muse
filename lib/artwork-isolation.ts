/**
 * Server-only negative / isolation steering for image generation.
 * Never expose this string in the UI prompt — append only when calling the model.
 */
export const ARTWORK_ISOLATION_CONSTRAINTS = [
  "no frame",
  "no canvas",
  "no wall",
  "no room",
  "no interior",
  "no furniture",
  "no architecture surrounding the artwork",
  "no mockup",
  "no gallery",
  "no museum",
  "no exhibition",
  "no hanging display",
  "no product photography",
  "no presentation",
  "no lifestyle scene",
  "no environment",
  "no background",
  "no objects",
  "no decor",
  "no windows",
  "no floor",
  "no shelves",
  "no lighting setup",
  "no camera perspective",
  "no angled view",
  "no depth of field",
  "no shadows from a room",
  "no border",
  "no mat",
  "no white margin",
  "no black margin",
  "no watermark",
  "no text",
  "no logo",
  "no signature",
  "isolated artwork only",
  "edge-to-edge composition only",
].join(", ")

const ISOLATION_MARKERS = [
  ARTWORK_ISOLATION_CONSTRAINTS,
  "Isolated artwork only, edge-to-edge composition only — the full image IS the artwork itself",
  "isolated artwork only, edge-to-edge composition only",
  "Content only, no background environment or frame",
]

/** Remove any previously embedded isolation text from a user-facing prompt. */
export function stripArtworkIsolation(prompt: string): string {
  let cleaned = prompt.trim()
  for (const marker of ISOLATION_MARKERS) {
    cleaned = cleaned.replace(marker, "")
  }
  // Drop trailing "no frame, no canvas..." style tails if present
  const noListIdx = cleaned.search(/\bno frame,\s*no canvas/i)
  if (noListIdx >= 0) {
    cleaned = cleaned.slice(0, noListIdx)
  }
  return cleaned
    .replace(/[.]\s*[.]+/g, ".")
    .replace(/\s+/g, " ")
    .replace(/[.\s]+$/, "")
    .trim()
}

/** Build the full model prompt: creative text + hidden isolation constraints. */
export function withArtworkIsolation(prompt: string): string {
  const creative = stripArtworkIsolation(prompt)
  if (!creative) return ARTWORK_ISOLATION_CONSTRAINTS
  return `${creative}. ${ARTWORK_ISOLATION_CONSTRAINTS}`
}
