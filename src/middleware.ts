import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { isAdminAuthorized, resolveAdminGate } from "@/server/admin/auth";
import { readAdminSignalsFromNext } from "@/server/admin/request-auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  if (pathname.startsWith("/admin/login")) return NextResponse.next();
  if (pathname.startsWith("/api/admin/auth/login")) return NextResponse.next();
  if (pathname.startsWith("/api/admin/auth/logout")) return NextResponse.next();

  const gate = resolveAdminGate();

  if (!gate.enabled) {
    if (process.env.NODE_ENV === "production") {
      if (isAdminApi) return NextResponse.json({ error: "Admin gate not configured" }, { status: 503 });
      return NextResponse.redirect(new URL("/admin/login?notice=config", request.url));
    }
    if (isAdminApi) return NextResponse.next();
    return NextResponse.next();
  }

  const signals = readAdminSignalsFromNext(request);
  const ok = isAdminAuthorized({
    cookieValue: signals.cookie ?? null,
    bearerHeader: signals.bearer ?? null,
  });
  if (!ok) {
    if (isAdminApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
