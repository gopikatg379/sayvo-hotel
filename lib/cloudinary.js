import { v2 as cloudinary } from "cloudinary";

export async function uploadToCloudinary(
  file,
  folder = "stayvo/packages"
) {
  if (!file || typeof file === "string" || file.size === 0) {
    return null;
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }

        resolve(result?.secure_url || null);
      }
    );

    stream.end(buffer);
  });
}