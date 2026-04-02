/**
 * Helpers for Lighthouse / PageSpeed screenshot payloads (data URLs or raw base64).
 */

/** True if the string looks like a `data:image/...;base64,...` URL */
export function isImageDataUrl(value: string): boolean {
  return /^data:image\/[^;]+;base64,/i.test(value.trim());
}

/**
 * Returns a value suitable for `<img src={...} />`.
 * Passes through full data URLs; wraps raw base64 (with optional MIME, default JPEG).
 */
export function normalizeImageDataUrl(
  data: string,
  mimeType: string = "image/jpeg"
): string {
  const trimmed = data.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("data:image/")) return trimmed;
  const b64 = trimmed.replace(/\s/g, "");
  return `data:${mimeType};base64,${b64}`;
}

/**
 * Creates a preloaded `HTMLImageElement` (does not wait for decode).
 * Prefer {@link normalizeImageDataUrl} + `<img>` in React.
 */
export function createImageElement(
  data: string,
  mimeType?: string
): HTMLImageElement {
  const img = new Image();
  img.src = normalizeImageDataUrl(data, mimeType);
  return img;
}

/** Resolves when the image has loaded (or rejects on error). */
export function loadImage(
  data: string,
  mimeType?: string
): Promise<HTMLImageElement> {
  const src = normalizeImageDataUrl(data, mimeType);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error("Image failed to load (invalid data URL or network)"));
    img.src = src;
  });
}
