import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { User } from "@/models/User";
import { dbConnect } from "@/lib/db";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const auth = verifyToken(token);

    const { oldPass, newPass } = await req.json();

    const user = await User.findById(auth.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const match = await bcrypt.compare(oldPass, user.password);
    if (!match) {
      return NextResponse.json(
        { error: "Old password is incorrect" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(newPass, 10);

    user.password = hashed;
    await user.save();

    // Auto Logout: remove cookies
    const res = NextResponse.json({ ok: true });

    res.headers.set(
      "Set-Cookie",
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;"
    );
    res.headers.append(
      "Set-Cookie",
      "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;"
    );

    return res;
  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
