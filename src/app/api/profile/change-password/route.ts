// src/app/api/profile/change-password/route.ts
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { getAuth } from "@/lib/auth";

export async function POST(req: Request) {
  await dbConnect();
  const auth = await getAuth();
  if (!auth) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { oldP, newP } = await req.json();

  const user = await User.findById(auth.userId);
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  const match = await bcrypt.compare(oldP, user.password);
  if (!match) return Response.json({ error: "Old password incorrect" }, { status: 400 });

  const hashed = await bcrypt.hash(newP, 10);
  user.password = hashed;
  await user.save();

  return Response.json({ message: "Password updated" });
}
