/** Canonical production URL for metadata, OG images, and sitemaps. */
export const SITE_URL = "https://jamesserritslev.com";

export function getMetadataBase(): URL {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL);
  }
  if (process.env.NODE_ENV === "development") {
    return new URL("http://localhost:3000");
  }
  return new URL(SITE_URL);
}
