import Image from "next/image";
import { connection } from "next/server";
import Link from "next/link";
import { ArrowUpRight, ArrowDown, MapPin, BedDouble, Users, Clock3 } from "lucide-react";
import WebsiteShell from "@/components/website/WebsiteShell";
import PackageCard from "@/components/website/PackageCard";
import CTASection from "@/components/website/CTASection";
import StayEnquiry from "@/components/website/StayEnquiry";
import LocationAdvantages from "@/components/website/LocationAdvantages";
import { getPackages } from "@/lib/packages";
import { siteConfig } from "@/lib/config";
import { getApprovedHotelReviews } from "@/lib/reviews";
import GuestStories from "@/components/website/GuestStories";

export default async function HomePage() {
  await connection();
  const [availablePackages, reviews] = await Promise.all([
    getPackages(), getApprovedHotelReviews(),
  ]);
  const fourBedRoom = availablePackages.find(pkg => pkg.slug === "four-bed-room-ac");
  const packages = availablePackages
    .filter(pkg => pkg.featured && pkg.slug !== fourBedRoom?.slug)
    .slice(0, fourBedRoom ? 2 : 3);
  if (fourBedRoom) packages.push(fourBedRoom);

  return <WebsiteShell>
    <section className="stayvo-hero">
      <div className="hero-copy">
        <p className="hotel-eyebrow">CENTRAL KOCHI · BY MAPRANI GROUP</p>
        <h1>Stay central.<br />Stay close to<br /><em>what matters.</em></h1>
        <p className="hero-description">Walk to South Railway Station, the Metro and Medical Trust Hospital. A practical city stay for work, hospital visits, education, shopping and families travelling together.</p>
        <div className="flex flex-wrap gap-3"><Link className="button-gold" href="/rooms">Find your room <ArrowUpRight size={17} /></Link><a className="hero-text-link" href="#why-stayvo">Why choose Stayvo? <ArrowUpRight size={16} /></a></div>
        <div className="hero-note"><span className="hero-note-line" /><span>RAIL · METRO · HOSPITAL · CITY VISITS</span></div>
      </div>
      <div className="hero-photo"><Image src="/images/stayvo/rooftop.jpeg" alt="Stayvo Kochi rooftop with warm lighting and greenery" fill loading="eager" fetchPriority="high" sizes="(max-width: 900px) 100vw, 55vw" className="object-cover" /><div className="hero-photo-shade" /><div className="hero-photo-caption"><span>Your plans, a little closer.</span><p>YOUR BASE IN CENTRAL KOCHI</p></div><a href="#why-stayvo" className="hero-scroll" aria-label="Discover the advantages of Stayvo"><ArrowDown size={19} /></a></div>
    </section>
    <div className="stayvo-enquiry-wrap container-site"><StayEnquiry /></div>

    <LocationAdvantages />

    <section id="welcome" className="section-pad hotel-cream">
      <div className="container-site welcome-grid">
        <div className="welcome-image"><Image src="/images/stayvo/entrance.jpeg" alt="The welcoming entrance to Stayvo Kochi" fill sizes="(max-width: 900px) 100vw, 42vw" className="object-cover" /><span className="image-caption">A convenient address. A warm welcome.</span></div>
        <div className="welcome-copy">
          <p className="hotel-eyebrow">For the whole family</p><h2 className="hotel-title">Stay together.<br /><em>Make the visit easier.</em></h2>
          <p>Coming to Kochi for an appointment, a college visit, work or a family occasion? Choose a comfortable room in the middle of the city, close to the places on your list.</p>
          <div className="family-stay-callout"><Users size={25} aria-hidden="true" /><div><strong>Family suites: up to 6 adults + 4 children</strong><p>Space for a larger family to stay together, with AC and non-AC choices.</p></div></div>
          <p>Double rooms accommodate 2 adults + 1 child. Extra bed available at an additional fee, subject to availability. Share children’s ages so our team can confirm bedding and charges.</p>
          <Link href="/rooms" className="gold-link">Compare rooms & occupancy <ArrowUpRight size={16} /></Link>
          <div className="welcome-signature"><span>STAYVO KOCHI</span><small>By Maprani Group</small></div>
        </div>
      </div>
    </section>

    <section className="hotel-amenities"><div className="container-site grid grid-cols-2 gap-8 lg:grid-cols-4">{[[MapPin,"In the middle of the city","Keep everyday destinations close"],[Users,"Larger families welcome","Suites for 6 adults + 4 children"],[BedDouble,"Extra bed available","At an additional fee · Ask our team"],[Clock3,"Easy arrivals & departures","Check-in 12 PM · Check-out 11 AM"]].map(([Icon,title,text])=><div key={title}><Icon size={27} strokeWidth={1.3} /><h3>{title}</h3><p>{text}</p></div>)}</div></section>

    <section className="section-pad">
      <div className="container-site">
        <div className="section-heading-row"><div><p className="hotel-eyebrow">Choose your city stay</p><h2 className="hotel-title">Room to <em>unwind.</em></h2><p className="section-description">Double rooms, four-bed rooms and larger family suites. Find a room that works for your visit.</p></div><Link href="/rooms" className="gold-link">All rooms & rates <ArrowUpRight size={16} /></Link></div>
        {packages.length > 0 ? <div className="mt-10 grid gap-7 md:grid-cols-3">{packages.map(pkg=><PackageCard key={pkg.id} pkg={pkg} />)}</div> : <div className="mt-10 rounded-xl border border-black/10 p-8"><p>Compare our room types and seasonal tariffs, or ask our team to help arrange your city stay.</p><Link href="/rooms" className="gold-link mt-4">View rooms & rates <ArrowUpRight size={16} /></Link></div>}
        <p className="mt-6 text-xs text-[#77716a]">Starting tariffs vary by season. Extra beds carry an additional fee. Share your dates and the number of adults and children to confirm your final rate.</p>
      </div>
    </section>

    <section className="rooftop-feature"><Image src="/images/stayvo/rooftop.jpeg" alt="Stayvo Kochi rooftop ambience at dusk" fill sizes="100vw" className="object-cover" /><div className="rooftop-overlay" /><div className="container-site relative"><p className="hotel-eyebrow">A city stay that fits your day</p><h2>Here for work.<br /><em>Here with family.</em></h2><p>From Cochin Shipyard commitments to hospital appointments and education visits, keep your base in central Kochi. Tell us your arrival and departure plans; we’ll help with the details.</p><Link href="/contact" className="button-outline">Discuss your stay <ArrowUpRight size={17} /></Link></div></section>
    <GuestStories reviews={reviews} />
    <CTASection />
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"Hotel",name:siteConfig.name,url:siteConfig.url,description:"A central Kochi city stay within walking distance of South Railway Station, the Metro and Medical Trust Hospital, with double rooms and larger family suites.",telephone:siteConfig.phones,email:siteConfig.email,image:`${siteConfig.url}/images/stayvo/entrance.jpeg`,address:{"@type":"PostalAddress",streetAddress:siteConfig.address,addressLocality:"Kochi",addressRegion:"Kerala",postalCode:"682016",addressCountry:"IN"},checkinTime:"12:00",checkoutTime:"11:00",priceRange:"₹1,400–₹8,000"}).replace(/</g,"\\u003c")}} />
  </WebsiteShell>;
}
