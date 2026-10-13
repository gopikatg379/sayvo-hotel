import prisma from "@/lib/prisma";
import { cache } from "react";
import { cachePublicQuery, packageCacheTag } from "@/lib/publicCache";
import { samplePackages, hotelCategories } from "@/lib/data";
const hotelWhere = { category: { in: hotelCategories } };
function filterPackages(items, { featured, destination, category, active }) {
  return items.filter(item => hotelCategories.includes(item.category)
    && (active === undefined || item.active === active)
    && (featured === undefined || item.featured === featured)
    && (!destination || item.destination.toLowerCase().includes(destination.toLowerCase()))
    && (!category || item.category === category));
}
const readHotelCatalog = cachePublicQuery(() => prisma.package.findMany({
  where: hotelWhere,
  select: {
    id: true, title: true, slug: true, destination: true, country: true,
    category: true, duration: true, days: true, nights: true, price: true,
    originalPrice: true, shortDescription: true, image: true, active: true,
    featured: true, createdAt: true, updatedAt: true,
  },
  orderBy: { createdAt: "desc" },
}), "stayvo-catalog-v2", packageCacheTag);

const readPackageBySlug = cachePublicQuery(slug => prisma.package.findUnique({
  where: { slug }, include: { images: true, itineraries: { orderBy: { day: "asc" } } },
}), "stayvo-package-detail-v1", packageCacheTag);

export async function getPackages({ featured, destination, category, active = true } = {}) {
  const filters = { featured, destination, category, active };
  try {
    const items = await readHotelCatalog();
    // Room templates are available until a hotel catalog is created.
    // Once created, admin visibility and deletion choices take precedence.
    return filterPackages(items.length ? items : samplePackages, filters);
  } catch { return filterPackages(samplePackages, filters); }
}
export const getPackageBySlug = cache(async function getPackageBySlug(slug) {
  try {
    const item = await readPackageBySlug(slug);
    if (item) {
      if (!hotelCategories.includes(item.category)) return null;
      // Keep previously saved room descriptions consistent with the current hotel copy.
      return Object.fromEntries(Object.entries(item).map(([key, value]) => [key,
        typeof value === "string"
          ? value.replace(/Maparani/gi, match => match === match.toUpperCase() ? "MAPRANI" : "Maprani")
            .replaceAll("room or capsule type", "room type")
          : value,
      ]));
    }
    if ((await readHotelCatalog()).length) return null;
  } catch {}
  return samplePackages.find(item => item.slug === slug) || null;
});
