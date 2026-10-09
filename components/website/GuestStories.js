import Link from "next/link";
import { ArrowUpRight, Quote, Star } from "lucide-react";

export default function GuestStories({ reviews }) {
  return <section className="guest-stories"><div className="container-site">
    <div className="section-heading-row"><div><p className="hotel-eyebrow">Guest stories</p><h2 className="hotel-title">Good stays.<br /><em>Lasting memories.</em></h2></div><Link href="/reviews" className="gold-link">Share your experience <ArrowUpRight size={16} /></Link></div>
    {reviews.length === 0 ? <div className="mt-10 rounded-3xl border border-[#c89a40]/25 bg-white/60 px-6 py-10 text-center sm:px-10">
      <Quote size={30} className="mx-auto text-[#c89a40]" />
      <h3 className="mt-4 text-xl font-semibold text-[#20211f]">No reviews yet. Will you be the first?</h3>
      <p className="mt-3 text-sm leading-6 text-[#77716a]">Stayed with us at Stayvo Kochi? Share your experience and help our next guests feel at home.</p>
      <Link href="/reviews" className="button-gold mt-6">Write the first review <ArrowUpRight size={16} /></Link>
    </div> : <div className="mt-10 grid gap-6 md:grid-cols-3">{reviews.map(review => <article key={review.id} className="guest-review">
      <div className="flex items-start justify-between gap-4"><div className="flex gap-1" aria-label={`${review.rating} out of 5 stars`}>{[1,2,3,4,5].map(star => <Star key={star} size={16} fill={star<=review.rating ? "currentColor" : "none"} />)}</div><Quote size={24} className="shrink-0" /></div>
      <p>“{review.review}”</p><strong>{review.name}</strong>{review.location && <small>{review.location}</small>}
    </article>)}</div>}
  </div></section>;
}
