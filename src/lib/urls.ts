import { site } from "@/config/site";

/** Build an absolute URL from a path (leading slash optional) */
export function absoluteUrl(path = "/"): string {
  const base = site.url.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
