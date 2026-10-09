import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-secret-change-me"
);

export async function createAdminToken(admin) {
  return new SignJWT({
    id: admin.id,
    email: admin.email,
    name: admin.name,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret);
}

export async function getAdminSession() {
  const store = await cookies();

  const token = store.get("stayvo_admin")?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      secret
    );

    return payload;
  } catch (error) {
    console.error("Admin session verification error:", error);
    return null;
  }
}