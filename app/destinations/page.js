import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import WebsiteShell from "@/components/website/WebsiteShell";
import LocationAdvantages from "@/components/website/LocationAdvantages";
import CTASection from "@/components/website/CTASection";

export const metadata = {
  title: "Location & nearby landmarks",
  description: "Stay in central Kochi, within walking distance of South Railway Station, the Metro and Medical Trust Hospital. Near Cochin Shipyard, Maharaja’s College, SRV School, Seematti and Kalyan Silks.",
};

export default function LocationPage() {
  return <WebsiteShell>
    <section className="hotel-page-header"><div className="container-site"><p className="hotel-eyebrow">Location & nearby</p><h1>Less travelling.<br /><em>More convenience.</em></h1><p>Choose a room in the middle of Kochi, close to your train, appointment, campus, shopping or work commitments.</p></div></section>
    <LocationAdvantages showHeading={false} />
    <section className="section-pad hotel-cream"><div className="container-site welcome-grid">
      <div className="welcome-image"><Image src="/images/stayvo/entrance.jpeg" alt="The entrance to Stayvo Kochi" fill sizes="(max-width: 900px) 100vw, 42vw" className="object-cover" /></div>
      <div><p className="hotel-eyebrow">A useful base for your visit</p><h2 className="hotel-title">Your day in Kochi.<br /><em>Your room close by.</em></h2><p className="section-description">Whether you’re accompanying someone to Medical Trust Hospital, visiting Maharaja’s College or SRV School, shopping at Seematti or Kalyan Silks, or coming for Cochin Shipyard work, our team can help you plan your arrival.</p><p className="section-description">Tell us your destination and travel schedule for directions. Taxi services and local tours can also be arranged on enquiry, with charges confirmed separately.</p><Link className="gold-link mt-6" href="/contact">Get help with your visit <ArrowUpRight size={16} /></Link></div>
    </div></section>
    <CTASection />
  </WebsiteShell>;
}
