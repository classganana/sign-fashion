import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

if (!uri && process.env.NODE_ENV === "development") {
  console.warn(
    "[mongodb] MONGODB_URI is not set. Database-backed routes will no-op safely.",
  );
}

type MongooseCache = {
  conn: typeof mongoose | null;
};

const g = globalThis as typeof globalThis & {
  signFashionMongo?: MongooseCache;
};

const cache: MongooseCache = g.signFashionMongo ?? { conn: null };

if (!g.signFashionMongo) {
  g.signFashionMongo = cache;
}

export async function connectDb(): Promise<typeof mongoose | null> {
  if (!uri) return null;
  if (cache.conn) return cache.conn;
  cache.conn = await mongoose.connect(uri);
  return cache.conn;
}
