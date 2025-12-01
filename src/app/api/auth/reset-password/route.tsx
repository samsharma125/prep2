import { NextResponse } from "next/server";
import { User } from "@/models/User";
import { dbConnect } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await dbConnect();

  const { token, password } = await req.json();

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() }, // token valid
  });

  if (!user) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }

  // Update password
  const hashed = await bcrypt.hash(password, 10);
  user.password = hashed;

  // Clear token after use
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  await user.save();

  return NextResponse.json({ ok: true, message: "Password updated successfully" });
}
