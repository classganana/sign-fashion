import { readAdminSignals, unauthorizedResponse, isAdminAuthorized } from "@/server/admin/auth";

export function requireAdminRoute(request: Request): Response | null {
  const { cookie, bearer } = readAdminSignals(request);
  const ok = isAdminAuthorized({
    cookieValue: cookie ?? null,
    bearerHeader: bearer ?? null,
  });
  if (!ok) return unauthorizedResponse();
  return null;
}
