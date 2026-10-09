import prisma from "@/lib/prisma";
import { cachePublicQuery, reviewCacheTag } from "@/lib/publicCache";

// Reviews written before the Stayvo conversion belong to the previous travel site.
export const hotelReviewWhere = { createdAt: { gte: new Date("2026-10-08T18:30:00.000Z") } };
const readApprovedReviews = cachePublicQuery(() => prisma.review.findMany({
  where: { ...hotelReviewWhere, status: "APPROVED" },
  orderBy: { createdAt: "desc" },
}), "stayvo-approved-reviews-v1", reviewCacheTag);

export async function getApprovedHotelReviews() {
  try {
    return await readApprovedReviews();
  } catch { return []; }
}
