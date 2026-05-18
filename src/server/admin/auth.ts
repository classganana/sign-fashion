import { ADMIN_COOKIE } from "@/constants/admin-auth";

import { timingSafeEqualString } from "@/server/admin/timing-safe";

export function resolveAdminGate(): { enabled: boolean; token: string | null } {
  const raw = process.env.ADMIN_SESSION_TOKEN?.trim();
  if (!raw) return { enabled: false, token: null };
  return { enabled: true, token: raw };
}

export function normalizeAdminCookies(header: string | null): string | undefined {
  if (!header) return undefined;
  const match = header.split(";").map((c) => c.trim()).find((c) => c.startsWith(`${ADMIN_COOKIE}=`));
  if (!match) return undefined;
  return decodeURIComponent(match.slice(`${ADMIN_COOKIE}=`.length));
}

export function isAdminAuthorized(opts: {
  cookieValue?: string | null;
  bearerHeader?: string | null;
}): boolean {
  const { enabled, token } = resolveAdminGate();
  /** Dev ergonomics — production still requires ADMIN_SESSION_TOKEN for API + guarded pages when enabled */
  if (!enabled || !token) return process.env.NODE_ENV !== "production";

  const fromCookie = timingSafe(opts.cookieValue ?? "", token);
  const fromHeader =
    timingSafe(opts.bearerHeader ?? "", token) ||
    (opts.bearerHeader?.startsWith("Bearer ")
      ? timingSafe(opts.bearerHeader.slice(7).trim(), token)
      : false);

  return fromCookie || fromHeader;
}

function timingSafe(a: string, b: string): boolean {
  try {
    return timingSafeEqualString(a, b);
  } catch {
    return false;
  }
}

export function unauthorizedResponse(): Response {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

/** Generic Request reader (Routes / edge) — cookies header string */
export function readAdminSignals(request: Request): {
  cookie?: string | undefined;
  bearer?: string | undefined;
} {
  const hdr = request.headers;
  const cookieHeader = hdr.get("cookie") ?? undefined;
  const bearer = hdr.get("authorization") ?? hdr.get("x-admin-session") ?? undefined;

  return {
    cookie: normalizeAdminCookies(cookieHeader ?? null),
    bearer: bearer ?? undefined,
  };
}
