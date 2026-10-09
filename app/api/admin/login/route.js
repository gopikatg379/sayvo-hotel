import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createAdminToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const form = await request.formData();

    const email = String(form.get("email") || "")
      .toLowerCase()
      .trim();

    const password = String(form.get("password") || "");

    const admin = await prisma.admin.findUnique({
      where: {
        email,
      },
    });

    if (!admin) {
      return NextResponse.redirect(
        new URL("/admin/login?error=invalid", request.url),
        303
      );
    }

    const passwordValid = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordValid) {
      return NextResponse.redirect(
        new URL("/admin/login?error=invalid", request.url),
        303
      );
    }

    const token = await createAdminToken(admin);

    const response = NextResponse.redirect(
      new URL("/admin/dashboard", request.url),
      303
    );

    response.cookies.set("stayvo_admin", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.redirect(
      new URL("/admin/login?error=server", request.url),
      303
    );
  }
}