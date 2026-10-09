import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret-change-me");

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get("stayvo_admin")?.value;
  if (!token) return NextResponse.redirect(new URL("/admin/login", request.url));

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.delete("stayvo_admin");
    return response;
  }
}

export const config = { matcher: ["/admin/:path*"] };