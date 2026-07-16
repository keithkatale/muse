/**
 * Negative / isolation steering appended to every image-generation prompt.
 * Keeps output as edge-to-edge artwork only — no mockups, rooms, frames, or templates.
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

/** Append isolation constraints to a creative prompt before sending to the image model. */
export function withArtworkIsolation(prompt: string): string {
  const trimmed = prompt.trim().replace(/[.\s]+$/, "")
  if (!trimmed) return ARTWORK_ISOLATION_CONSTRAINTS
  if (trimmed.includes("isolated artwork only")) return trimmed
  return `${trimmed}. ${ARTWORK_ISOLATION_CONSTRAINTS}`
}
