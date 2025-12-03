import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) throw new Error("Missing JWT_SECRET");

// The structure stored inside the JWT token
export type TokenPayload = {
  userId: string;
  role: "student" | "admin";
  email: string;
  name: string;
};

// Create JWT
export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15d" });
}

// Verify JWT
export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

// Read token from cookies (server-only)
export async function getAuth(): Promise<TokenPayload | null> {
  try {
    const store = await cookies(); // Server-only API
    const token = store.get("token")?.value;

    if (!token) return null;

    return verifyToken(token);
  } catch (err) {
    return null;
  }
}
