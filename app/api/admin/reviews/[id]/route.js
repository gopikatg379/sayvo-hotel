import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { refreshPublicReviews } from "@/lib/publicCache";
import { hotelReviewWhere } from "@/lib/reviews";
import { getAdminSession } from "@/lib/auth";

export async function POST(request, { params }) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const reviewId = Number(id);

  if (!reviewId) {
    redirect("/admin/reviews");
  }

  const hotelReview = await prisma.review.findFirst({ where: { id: reviewId, ...hotelReviewWhere }, select: { id: true } });
  if (!hotelReview) redirect("/admin/reviews");

  const formData = await request.formData();
  const action = formData.get("action");

  try {
    if (action === "approve") {
      await prisma.review.update({
        where: {
          id: reviewId,
        },
        data: {
          status: "APPROVED",
        },
      });
    }

    if (action === "reject") {
      await prisma.review.update({
        where: {
          id: reviewId,
        },
        data: {
          status: "REJECTED",
          featured: false,
        },
      });
    }

    if (action === "feature") {
      await prisma.review.update({
        where: {
          id: reviewId,
        },
        data: {
          status: "APPROVED",
          featured: true,
        },
      });
    }

    if (action === "unfeature") {
      await prisma.review.update({
        where: {
          id: reviewId,
        },
        data: {
          featured: false,
        },
      });
    }

    if (action === "delete") {
      await prisma.review.delete({
        where: {
          id: reviewId,
        },
      });
    }
    if (["approve", "reject", "feature", "unfeature", "delete"].includes(action)) {
      refreshPublicReviews();
    }
  } catch (error) {
    console.error("Admin review action error:", error);
  }

  redirect("/admin/reviews");
}
