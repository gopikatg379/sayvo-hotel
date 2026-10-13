export const siteConfig = {
  name: "Stayvo Kochi", tagline: "Comfort in the heart of Kochi", group: "Maprani Group",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919746400000",
  phone: process.env.NEXT_PUBLIC_PHONE || "+91 97464 00000",
  email: process.env.NEXT_PUBLIC_EMAIL || "",
  address: process.env.NEXT_PUBLIC_OFFICE_ADDRESS || "Kochi, Kerala, India",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "", facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
};
export function whatsappUrl(message) {
  return `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
