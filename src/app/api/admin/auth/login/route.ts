import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ADMIN_COOKIE } from "@/constants/admin-auth";
import { resolveAdminGate } from "@/server/admin/auth";
import { timingSafeEqualString } from "@/server/admin/timing-safe";

function timingSafeCompare(a: string, b: string): boolean {
  try {
    return timingSafeEqualString(a, b);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const gate = resolveAdminGate();

  if (!gate.enabled || !gate.token) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Admin authentication is not configured" }, { status: 503 });
    }
    return NextResponse.json({ ok: true, note: "Dev mode — ADMIN_SESSION_TOKEN unset; session cookie skipped." });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected JSON body" }, { status: 400 });
  }

  const token =
    typeof body === "object" && body !== null && "token" in body ?
      String((body as { token?: unknown }).token ?? "")
    : "";

  if (!token || !timingSafeCompare(token.trim(), gate.token)) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, gate.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ ok: true });
}
