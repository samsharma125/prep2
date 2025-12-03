// src/app/api/profile/me/route.ts
import { getAuth } from "@/lib/auth";

export async function GET() {
  const auth = await getAuth();
  if (!auth) return Response.json({ error: "Not logged in" }, { status: 401 });
  return Response.json(auth);
}
