import Image from "next/image";
import { connection } from "next/server";
import Link from "next/link";
import { ArrowUpRight, ArrowDown, BedDouble, Coffee, Car, Clock3 } from "lucide-react";
import WebsiteShell from "@/components/website/WebsiteShell";
import PackageCard from "@/components/website/PackageCard";
import CTASection from "@/components/website/CTASection";
import StayEnquiry from "@/components/website/StayEnquiry";
import { getPackages } from "@/lib/packages";
import { siteConfig } from "@/lib/config";
import { getApprovedHotelReviews } from "@/lib/reviews";
import GuestStories from "@/components/website/GuestStories";
export default async function HomePage() {
  await connection();
  const [featuredPackages, reviews] = await Promise.all([
    getPackages({ featured: true }), getApprovedHotelReviews(),
  ]);
  const packages = featuredPackages.slice(0, 3);
  return <WebsiteShell>
    <section className="stayvo-hero">
      <div className="hero-copy"><p className="hotel-eyebrow">KOCHI, KERALA · BY MAPARANI GROUP</p><h1>A city to explore.<br />A place to<br /><em>call home.</em></h1><p className="hero-description">Easy mornings. Warm welcomes. A comfortable stay in the heart of Kochi — from a cosy capsule to a room for the whole family.</p><div className="flex flex-wrap gap-3"><Link className="button-gold" href="/rooms">Find your room <ArrowUpRight size={17} /></Link><Link className="hero-text-link" href="/about">Discover Stayvo <ArrowUpRight size={16} /></Link></div><div className="hero-note"><span className="hero-note-line" /><span>COMFORT IN THE HEART OF KOCHI</span></div></div>
      <div className="hero-photo"><Image src="/images/stayvo/rooftop.jpeg" alt="Stayvo Kochi rooftop with warm lighting and greenery" fill loading="eager" fetchPriority="high" sizes="(max-width: 900px) 100vw, 55vw" className="object-cover" /><div className="hero-photo-shade" /><div className="hero-photo-caption"><span>Make time for the little things.</span><p>YOUR STAYVO MOMENT</p></div><a href="#welcome" className="hero-scroll" aria-label="Discover the hotel"><ArrowDown size={19} /></a></div>
    </section>
    <div className="stayvo-enquiry-wrap container-site"><StayEnquiry /></div>
    <section id="welcome" className="section-pad"><div className="container-site welcome-grid"><div className="welcome-image"><Image src="/images/stayvo/entrance.jpeg" alt="The welcoming entrance to Stayvo Kochi" fill sizes="(max-width: 900px) 100vw, 42vw" className="object-cover" /><span className="image-caption">A warm welcome, from the very first step.</span></div><div className="welcome-copy"><p className="hotel-eyebrow">Welcome to Stayvo</p><h2 className="hotel-title">A little comfort.<br /><em>A lot of Kochi.</em></h2><p>Whether you’re here for a quick city stop, a family getaway, or a few unhurried days, settle into a stay that suits you.</p><p>Double rooms, four-bed rooms, family suites, and capsule pods. AC and non-AC choices. One welcoming address to come back to after a day out.</p><Link href="/about" className="gold-link">Get to know us <ArrowUpRight size={16} /></Link><div className="welcome-signature"><span>STAYVO KOCHI</span><small>By Maparani Group</small></div></div></div></section>
    <section className="hotel-amenities"><div className="container-site grid grid-cols-2 gap-8 lg:grid-cols-4">{[[BedDouble,"A stay for every guest","Rooms, suites & capsule pods"],[Coffee,"Start your morning","Breakfast available"],[Car,"See a little more","Taxi services & tour packages"],[Clock3,"Take your time","Check-in 12 PM · Check-out 11 AM"]].map(([Icon,title,text])=><div key={title}><Icon size={27} strokeWidth={1.3} /><h3>{title}</h3><p>{text}</p></div>)}</div></section>
    <section className="section-pad hotel-cream"><div className="container-site"><div className="section-heading-row"><div><p className="hotel-eyebrow">Find your kind of stay</p><h2 className="hotel-title">Room to <em>unwind.</em></h2><p className="section-description">For solo stopovers, days together, and family memories.</p></div><Link href="/rooms" className="gold-link">All rooms & rates <ArrowUpRight size={16} /></Link></div>{packages.length > 0 ? <div className="mt-10 grid gap-7 md:grid-cols-3">{packages.map(pkg=><PackageCard key={pkg.id} pkg={pkg} />)}</div> : <div className="mt-10 rounded-xl border border-black/10 p-8"><p>Discover our room types and seasonal tariffs, or ask our team about a stay package.</p><Link href="/rooms" className="gold-link mt-4">View rooms & rates <ArrowUpRight size={16} /></Link></div>}<p className="mt-6 text-xs text-[#77716a]">Starting tariffs vary by season. Share your dates to confirm rates and availability.</p></div></section>
    <section className="rooftop-feature"><Image src="/images/stayvo/rooftop.jpeg" alt="Stayvo Kochi rooftop ambience at dusk" fill sizes="100vw" className="object-cover" /><div className="rooftop-overlay" /><div className="container-site relative"><p className="hotel-eyebrow">Above the everyday</p><h2>Slow evenings.<br /><em>City lights.</em></h2><p>Discover a different side of the city. A little greenery, warm light, and space to enjoy the moment.</p><Link href="/contact" className="button-outline">Plan your stay <ArrowUpRight size={17} /></Link></div></section>
    <section className="section-pad"><div className="container-site grid gap-12 lg:grid-cols-2"><div><p className="hotel-eyebrow">Step out. Discover.</p><h2 className="hotel-title">Kochi, at<br /><em>your own pace.</em></h2><p className="section-description">Heritage streets, waterfront evenings, and backwater day trips. Ask us about taxi services and tour packages to make the most of your visit.</p><Link href="/destinations" className="gold-link mt-6">Explore Kochi <ArrowUpRight size={16} /></Link></div><div className="explore-list">{[["01","Fort Kochi","Heritage streets & fishing nets"],["02","Mattancherry","Art, culture & spice markets"],["03","Marine Drive","An evening by the waterfront"],["04","Alleppey","A day out on the backwaters"]].map(([n,t,d])=><Link href={`/contact?package=${encodeURIComponent(t+" tour enquiry")}`} key={t}><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div><ArrowUpRight size={20} /></Link>)}</div></div></section>
    <GuestStories reviews={reviews} />
    <CTASection />
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"Hotel",name:siteConfig.name,url:siteConfig.url,telephone:siteConfig.phone,image:`${siteConfig.url}/images/stayvo/entrance.jpeg`,address:{"@type":"PostalAddress",addressLocality:"Kochi",addressRegion:"Kerala",addressCountry:"IN"},checkinTime:"12:00",checkoutTime:"11:00",priceRange:"₹500–₹8,000"}).replace(/</g,"\\u003c")}} />
  </WebsiteShell>;
}
