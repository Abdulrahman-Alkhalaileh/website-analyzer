/**
 * Creator / watermark — set in `.env.local` (NEXT_PUBLIC_* is exposed to the browser).
 * Omit `NEXT_PUBLIC_AUTHOR_NAME` to hide the footer strip entirely.
 */

export function getAuthorDisplayName(): string {
  return process.env.NEXT_PUBLIC_AUTHOR_NAME?.trim() ?? "";
}

/** GitHub username (e.g. octocat) or full profile URL */
export function getAuthorGithubUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_AUTHOR_GITHUB?.trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw.replace(/\/$/, "");
  return `https://github.com/${raw.replace(/^@/, "")}`;
}

/** LinkedIn: profile slug (e.g. jane-doe), in/jane-doe, or full profile URL */
export function getAuthorLinkedInUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_AUTHOR_LINKEDIN?.trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw.replace(/\/$/, "");
  const slug = raw
    .replace(/^\/+/, "")
    .replace(/^in\//i, "")
    .replace(/\/$/, "");
  if (!slug) return null;
  return `https://www.linkedin.com/in/${slug}`;
}

export function getAuthorEmail(): string | null {
  const raw = process.env.NEXT_PUBLIC_AUTHOR_EMAIL?.trim();
  return raw || null;
}

export function authorWatermarkEnabled(): boolean {
  return Boolean(getAuthorDisplayName());
}
