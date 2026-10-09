import { NextResponse } from "next/server";

export async function POST(request) {
  const response = NextResponse.redirect(
    new URL("/admin/login", request.url),
    303
  );

  response.cookies.set("stayvo_admin", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}