import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { hotelReviewWhere } from "@/lib/reviews";
import { getAdminSession } from "@/lib/auth";
import {
  CheckCircle2,
  XCircle,
  Star,
  Trash2,
  MapPin,
  Clock3,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const reviews = await prisma.review.findMany({
    where: hotelReviewWhere,
    orderBy: {
      createdAt: "desc",
    },
  });

  const pendingCount = reviews.filter(
    (review) => review.status === "PENDING"
  ).length;

  const approvedCount = reviews.filter(
    (review) => review.status === "APPROVED"
  ).length;

  const featuredCount = reviews.filter(
    (review) => review.featured
  ).length;

  return (
    <div className="min-h-screen bg-[#f6f3eb] px-5 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c89a40]">
              Customer Feedback
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-[#20211f] md:text-4xl">
              Reviews
            </h1>

            <p className="mt-2 text-[#6e746f]">
              All approved guest reviews appear on the Stayvo Kochi homepage.
              Pending and rejected reviews stay hidden.
            </p>
          </div>

          <Link
            href="/admin"
            className="inline-flex w-fit items-center justify-center rounded-xl border border-[#20211f]/15 bg-white px-5 py-3 text-sm font-bold text-[#20211f] transition hover:bg-[#20211f] hover:text-white"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Stats */}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#6e746f]">
                Pending
              </span>

              <Clock3 size={20} className="text-[#c89a40]" />
            </div>

            <p className="mt-3 text-3xl font-black text-[#20211f]">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#6e746f]">
                Approved
              </span>

              <CheckCircle2 size={20} className="text-green-600" />
            </div>

            <p className="mt-3 text-3xl font-black text-[#20211f]">
              {approvedCount}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#6e746f]">
                Featured
              </span>

              <Star size={20} className="text-[#c89a40]" />
            </div>

            <p className="mt-3 text-3xl font-black text-[#20211f]">
              {featuredCount}
            </p>
          </div>
        </div>

        {/* Reviews */}

        <div className="mt-8 space-y-5">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <article
                key={review.id}
                className="overflow-hidden rounded-[24px] border border-black/5 bg-white shadow-sm"
              >
                <div className="p-6 md:p-7">
                  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                    <div className="max-w-3xl">
                      {/* User */}

                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#20211f] text-lg font-black text-white">
                          {review.name?.charAt(0)?.toUpperCase() || "V"}
                        </div>

                        <div>
                          <h2 className="text-lg font-bold text-[#20211f]">
                            {review.name}
                          </h2>

                          {review.location && (
                            <div className="mt-1 flex items-center gap-1.5 text-sm text-[#7a827e]">
                              <MapPin size={13} />
                              {review.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Stars */}

                      <div className="mt-5 flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={17}
                            className={
                              star <= review.rating
                                ? "text-[#c89a40]"
                                : "text-[#d6d6d6]"
                            }
                            fill={
                              star <= review.rating
                                ? "currentColor"
                                : "none"
                            }
                          />
                        ))}
                      </div>

                      {/* Review */}

                      <p className="mt-4 leading-7 text-[#4c5852]">
                        “{review.review}”
                      </p>

                      <p className="mt-4 text-xs text-[#969d99]">
                        Submitted on{" "}
                        {new Date(review.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    {/* Status */}

                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                          review.status === "APPROVED"
                            ? "bg-green-50 text-green-700"
                            : review.status === "REJECTED"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {review.status}
                      </span>

                      {review.featured && (
                        <span className="rounded-full bg-[#fff4da] px-3 py-1.5 text-xs font-bold text-[#9a6a1d]">
                          FEATURED
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}

                <div className="flex flex-wrap gap-3 border-t border-black/5 bg-[#faf9f5] px-6 py-4 md:px-7">
                  {review.status !== "APPROVED" && (
                    <form
                      action={`/api/admin/reviews/${review.id}`}
                      method="POST"
                    >
                      <input type="hidden" name="action" value="approve" />

                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-700"
                      >
                        <CheckCircle2 size={16} />
                        Approve
                      </button>
                    </form>
                  )}

                  {review.status !== "REJECTED" && (
                    <form
                      action={`/api/admin/reviews/${review.id}`}
                      method="POST"
                    >
                      <input type="hidden" name="action" value="reject" />

                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-100"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </form>
                  )}

                  {review.status === "APPROVED" && (
                    <form
                      action={`/api/admin/reviews/${review.id}`}
                      method="POST"
                    >
                      <input
                        type="hidden"
                        name="action"
                        value={review.featured ? "unfeature" : "feature"}
                      />

                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#fff4da] px-4 py-2.5 text-sm font-bold text-[#8c621c] transition hover:bg-[#f6e3b7]"
                      >
                        <Star
                          size={16}
                          fill={review.featured ? "currentColor" : "none"}
                        />

                        {review.featured ? "Unfeature" : "Feature"}
                      </button>
                    </form>
                  )}

                  <form
                    action={`/api/admin/reviews/${review.id}`}
                    method="POST"
                    className="ml-auto"
                  >
                    <input type="hidden" name="action" value="delete" />

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </form>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[24px] bg-white px-6 py-16 text-center shadow-sm">
              <Star
                size={32}
                className="mx-auto text-[#c89a40]"
              />

              <h2 className="mt-4 text-xl font-bold text-[#20211f]">
                No reviews yet
              </h2>

              <p className="mt-2 text-[#6e746f]">
                Customer reviews will appear here after they submit them.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
