import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";

export async function GET() {
  await dbConnect();
  const auth = await getAuth();

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(auth.userId).select("name email");

  return NextResponse.json({ user });
}
