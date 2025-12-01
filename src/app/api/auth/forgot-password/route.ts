import { NextResponse } from "next/server";
import { User } from "@/models/User";
import { dbConnect } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: Request) {
  await dbConnect();

  const { email } = await req.json();
  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ ok: true, message: "If email exists, a reset link was sent." });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = Date.now() + 1000 * 60 * 15; // 15 mins

  user.resetToken = token;
  user.resetTokenExpiry = expiry;
  await user.save();

  // ✨ Reset Link (send via email in production)
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  return NextResponse.json({
    ok: true,
    resetLink, // <--- You can see it in console for testing
  });
}
