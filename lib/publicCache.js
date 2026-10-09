import { unstable_cache, revalidatePath, revalidateTag } from "next/cache";

export const packageCacheTag = "stayvo-public-packages";
export const reviewCacheTag = "stayvo-approved-reviews";

export function cachePublicQuery(query, key, tag, timeoutMs = 5000) {
  return unstable_cache(async (...args) => {
    let timeout;
    try {
      return await Promise.race([
        Promise.resolve().then(() => query(...args)),
        new Promise((_, reject) => {
          timeout = setTimeout(() => reject(new Error("Public data query timed out")), timeoutMs);
        }),
      ]);
    } finally {
      clearTimeout(timeout);
    }
  }, [key], { tags: [tag], revalidate: 60 });
}

export function refreshPublicPackages() {
  revalidateTag(packageCacheTag, { expire: 0 });
  revalidatePath("/");
  revalidatePath("/packages");
  revalidatePath("/packages/[slug]", "page");
  revalidatePath("/sitemap.xml");
}

export function refreshPublicReviews() {
  revalidateTag(reviewCacheTag, { expire: 0 });
  revalidatePath("/");
}
