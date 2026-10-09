"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export default function ReviewForm() {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          location: formData.get("location"),
          review: formData.get("review"),
          rating,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not submit review.");
      }

      setMessage(data.message);
      formElement.reset();
      setRating(5);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-[#f8f4e9] py-20">
      <div className="mx-auto max-w-3xl px-5">
        <div className="rounded-[32px] bg-white p-7 shadow-sm md:p-10">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#c89a40]">
              Your Experience Matters
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#20211f] md:text-4xl">
              Share Your Stayvo Kochi Story
            </h2>

            <p className="mx-auto mt-3 max-w-xl leading-7 text-[#6e746f]">
              Stayed with us? Tell us about your experience and help other
              guests plan their next Kochi stay.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-[#20211f]">
                  Your Name *
                </label>

                <input
                  name="name"
                  required
                  placeholder="Enter your name"
                  className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none transition focus:border-[#c89a40]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#20211f]">
                  Location
                </label>

                <input
                  name="location"
                  placeholder="Eg. Kochi, Kerala"
                  className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none transition focus:border-[#c89a40]"
                />
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-bold text-[#20211f]">
                Your Rating *
              </label>

              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = star <= (hoverRating || rating);

                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                      aria-label={`${star} star`}
                    >
                      <Star
                        size={32}
                        fill={active ? "#c89a40" : "transparent"}
                        color={active ? "#c89a40" : "#cbd5d1"}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-[#20211f]">
                Your Review *
              </label>

              <textarea
                name="review"
                required
                rows={5}
                placeholder="Tell us about your stay experience..."
                className="w-full resize-none rounded-2xl border border-black/10 px-4 py-3 outline-none transition focus:border-[#c89a40]"
              />
            </div>

            {message && (
              <div className="rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                {message}
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#20211f] px-6 py-4 font-bold text-white transition hover:bg-[#102f28] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>

            <p className="text-center text-xs leading-5 text-[#6e746f]">
              Your review will be displayed after approval.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}