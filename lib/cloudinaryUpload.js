import { v2 as cloudinary } from "cloudinary";

export function createCloudinaryUploadSignature(env = process.env) {
  const config = cloudinary.config();
  const cloudName = env.CLOUDINARY_CLOUD_NAME || config.cloud_name || env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = env.CLOUDINARY_API_KEY || config.api_key;
  const apiSecret = env.CLOUDINARY_API_SECRET || config.api_secret;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary server credentials are missing. Configure CLOUDINARY_URL or the cloud name, API key and API secret.");
  }

  const params = { timestamp: Math.floor(Date.now() / 1000), folder: "stayvo/packages" };
  const preset = env.CLOUDINARY_UPLOAD_PRESET || env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (preset) params.upload_preset = preset;

  return {
    cloudName, apiKey, params,
    signature: cloudinary.utils.api_sign_request(params, apiSecret),
  };
}
