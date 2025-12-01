import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) throw new Error("Missing JWT_SECRET");

export type TokenPayload = {
  userId: string;
  role: "student" | "admin";
  email: string;
  name: string;
};

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

export async function getAuth() {
  try {
    const cookieStore = await cookies();  // ← FIX
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    return verifyToken(token);
  } catch {
    return null;
  }
}
