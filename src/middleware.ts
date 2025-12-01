import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  if (["/", "/login", "/signup"].includes(pathname)) return NextResponse.next();
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon") || pathname.startsWith("/images") || pathname.startsWith("/assets")) return NextResponse.next();
  if (pathname.startsWith("/api")) return NextResponse.next();

  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { role: "student" | "admin" };
    if (pathname.startsWith("/faculty") && payload.role !== "admin") return NextResponse.redirect(new URL("/dashboard", req.url));
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = { matcher: [ "/dashboard/:path*", "/activity/:path*", "/mock-test/:path*", "/my-projects/:path*", "/resume-builder/:path*", "/assignments/:path*", "/career-hub/:path*", "/calendar/:path*", "/ai-assistant/:path*", "/faculty/:path*", "/settings/:path*" ], runtime: "nodejs" };
 