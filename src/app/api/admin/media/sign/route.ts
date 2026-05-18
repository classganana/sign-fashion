import { getCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";
import { requireAdminRoute } from "@/server/admin/route-guards";
import * as z from "zod";

const signBodySchema = z.object({
  folder: z.string().min(1).optional(),
});

export async function POST(request: Request) {
  const blocked = requireAdminRoute(request);
  if (blocked) return blocked;

  if (!isCloudinaryConfigured()) {
    return Response.json(
      {
        error: "Cloudinary secrets missing — set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const envelope = signBodySchema.safeParse(body);
  if (!envelope.success) return Response.json({ error: envelope.error.flatten() }, { status: 400 });

  const cld = getCloudinary();
  if (!cld || !process.env.CLOUDINARY_API_SECRET) {
    return Response.json({ error: "Cloudinary client unavailable" }, { status: 503 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign: Record<string, string | number> = { timestamp };

  const folder =
    envelope.data.folder?.replace(/[^\w-/]/g, "") || "sign-fashion/admin/manual-upload";
  paramsToSign.folder = folder;

  const signature = cld.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);

  return Response.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    timestamp,
    signature,
    folder,
  });
}
