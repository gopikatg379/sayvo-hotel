import { getAdminSession } from "@/lib/auth";
import { createCloudinaryUploadSignature } from "@/lib/cloudinaryUpload";

export const runtime = "nodejs";

export async function POST() {
  if (!(await getAdminSession())) {
    return Response.json({ message: "Please sign in again to upload images." }, { status: 401 });
  }
  try {
    return Response.json(createCloudinaryUploadSignature(), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ message: "Cloudinary server credentials are missing or invalid. Check the server upload configuration." }, { status: 503 });
  }
}
