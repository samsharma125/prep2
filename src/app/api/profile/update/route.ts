// src/app/api/profile/update/route.ts
import { dbConnect } from "@/lib/db";
import { getAuth, signToken } from "@/lib/auth";
import { User } from "@/models/User";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  await dbConnect();

  const auth = await getAuth();
  if (!auth) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();
  if (!name) {
    return Response.json({ error: "Name is required" }, { status: 400 });
  }

  const user = await User.findById(auth.userId);
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  // Update the database
  user.name = name;
  await user.save();

  // NEW: Create updated JWT token
  const newToken = signToken({
    userId: auth.userId,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  // Save the new token in cookies
  const cookieStore = await cookies();
  cookieStore.set("token", newToken, {
    path: "/",
    maxAge: 60 * 60 * 24 * 15, // 15 days
    httpOnly: true,
  });

  return Response.json({
    message: "Name updated successfully",
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}
