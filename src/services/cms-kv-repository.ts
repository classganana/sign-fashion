import { connectDb } from "@/lib/mongodb";
import { getCmsKvModel } from "@/models/cms-kv-model";

export async function cmsKvRead(key: string): Promise<unknown | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;
  try {
    await connectDb();
    const doc = await getCmsKvModel().findOne({ key }).lean();
    return doc?.payload ?? null;
  } catch {
    return null;
  }
}

export async function cmsKvWrite(key: string, payload: unknown): Promise<{ ok: true } | { ok: false }> {
  const uri = process.env.MONGODB_URI;
  if (!uri) return { ok: false };
  await connectDb();
  await getCmsKvModel().findOneAndUpdate(
    { key },
    { $set: { payload } },
    { upsert: true, new: true },
  );
  return { ok: true };
}