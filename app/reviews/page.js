import WebsiteShell from "@/components/website/WebsiteShell";
import ReviewForm from "@/components/website/ReviewForm";

export const metadata = {
  title: "Guest Reviews | Stayvo Kochi",
  description:
    "Read experiences from Stayvo Kochi guests and share your own stay story.",
};

export default function ReviewsPage() {
  return (
    <WebsiteShell>
      <section className="bg-[#20211f] px-5 py-20 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#e8c986]">
            Guest Stories
          </p>

          <h1 className="mt-4 text-4xl font-bold md:text-6xl">
            Every stay has a story.
          </h1>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-white/70">
            Stayed with Stayvo Kochi? We'd love to hear about your experience.
          </p>
        </div>
      </section>

      <ReviewForm />
    </WebsiteShell>
  );
}