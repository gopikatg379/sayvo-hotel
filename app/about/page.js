import Image from "next/image";
import Link from "next/link";
import { HeartHandshake, Users, MapPin, Clock3, ArrowUpRight } from "lucide-react";
import WebsiteShell from "@/components/website/WebsiteShell";
import CTASection from "@/components/website/CTASection";

export const metadata = { title: "About Stayvo", description: "Stayvo Kochi by Maprani Group: a practical central city stay for work, hospital visits, education and families. Double rooms for 2 adults + 1 child and suites for 6 adults + 4 children." };

export default function About() {
  return <WebsiteShell>
    <section className="hotel-page-header"><div className="container-site"><p className="hotel-eyebrow">Stayvo Kochi · By Maprani Group</p><h1>A practical stay.<br /><em>A central address.</em></h1><p>Comfort and convenience for the reasons that bring you to Kochi.</p></div></section>
    <section className="section-pad"><div className="container-site welcome-grid">
      <div className="welcome-image"><Image src="/images/stayvo/entrance.jpeg" alt="Stayvo Kochi entrance and greenery" fill sizes="(max-width: 900px) 100vw, 42vw" className="object-cover" /></div>
      <div><p className="hotel-eyebrow">Why stay with us?</p><h2 className="hotel-title">Close to your plans.<br /><em>Room for your people.</em></h2>
        <p className="section-description">Stayvo Kochi is a city stay by Maprani Group. Our central location puts South Railway Station, the Metro and Medical Trust Hospital within walking distance, with Cochin Shipyard, educational institutions and shopping destinations nearby.</p>
        <p className="section-description">We welcome guests visiting for work, appointments, exams, admissions, shopping and family occasions. Choose AC or non-AC accommodation and speak directly with our team about the room and arrival arrangements that suit your visit.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">{[
          [MapPin,"An everyday advantage","Nearby Maharaja’s College, SRV School, Seematti and Kalyan Silks make a central stay useful."],
          [Users,"Keep your family together","Double rooms: 2 adults + 1 child. Larger family suites: up to 6 adults + 4 children."],
          [Clock3,"Easy arrivals & departures","Check-in 12 PM, check-out 11 AM. Ask about early or late arrangements, subject to availability and any additional fee."],
          [HeartHandshake,"Help with the details","Extra bed available at an additional fee, subject to availability. Share children’s ages and your travel plans."],
        ].map(([Icon,title,text])=><div key={title}><Icon size={24} className="text-[#8a621b]" /><h3 className="mt-3 font-serif text-xl">{title}</h3><p className="mt-2 text-sm leading-6 text-[#77716a]">{text}</p></div>)}</div>
        <Link href="/destinations" className="gold-link mt-8">See our location advantages <ArrowUpRight size={16} /></Link>
      </div>
    </div></section><CTASection />
  </WebsiteShell>;
}
