import type { NextRequest } from "next/server";

import { ADMIN_COOKIE } from "@/constants/admin-auth";

export function readAdminSignalsFromNext(request: NextRequest): {
  cookie?: string | undefined;
  bearer?: string | undefined;
} {
  const hdr = request.headers.get("authorization") ?? request.headers.get("x-admin-session");
  return {
    cookie: request.cookies.get(ADMIN_COOKIE)?.value,
    bearer: hdr ?? undefined,
  };
}
