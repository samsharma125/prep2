import mongoose from "mongoose";

const MONGO_URL = process.env.MONGODB_URI || "";

if (!MONGO_URL) {
  throw new Error("Missing MONGODB_URI");
}

let cached = (global as any)._mongo;

if (!cached) {
  cached = (global as any)._mongo = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URL).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
