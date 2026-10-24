const defaultPhone1 = "+91 92929 91777";
const defaultPhone2 = "+91 92927 91777";
const configuredPhone = process.env.NEXT_PUBLIC_PHONE;
const parsedPhones = configuredPhone
  ? configuredPhone.split(/[,/|]+/).map(p => p.trim()).filter(Boolean)
  : [defaultPhone1, ...(process.env.NEXT_PUBLIC_PHONE_SECONDARY ? [process.env.NEXT_PUBLIC_PHONE_SECONDARY.trim()] : [defaultPhone2])];

const primaryPhone = parsedPhones[0] || defaultPhone1;
const secondaryPhone = parsedPhones[1] || (process.env.NEXT_PUBLIC_PHONE_SECONDARY?.trim() || (configuredPhone ? "" : defaultPhone2));
const allPhones = [primaryPhone, secondaryPhone].filter((p, i, a) => Boolean(p) && a.indexOf(p) === i);

export const siteConfig = {
  name: "Stayvo Kochi",
  tagline: "Comfort in the heart of Kochi",
  group: "Maprani Group",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919292991777",
  phone: primaryPhone,
  phoneSecondary: secondaryPhone,
  phones: allPhones.length > 0 ? allPhones : [defaultPhone1, defaultPhone2],
  email: process.env.NEXT_PUBLIC_EMAIL || "stayvokochin@gmail.com",
  address: process.env.NEXT_PUBLIC_OFFICE_ADDRESS || "Swami Chinmayananda Road, Ernakulam South, Jos Jn, Metro Pillar No.726, Kerala Pin-682016",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
};

export function whatsappUrl(message) {
  const digits = (siteConfig.whatsapp || "").replace(/\D/g, "");
  const number = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
