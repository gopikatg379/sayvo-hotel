import Image from "next/image";
import { ArrowUpRight, MapPin } from "lucide-react";
import WebsiteShell from "@/components/website/WebsiteShell";
import CTASection from "@/components/website/CTASection";
import { destinations } from "@/lib/data";
import { whatsappUrl } from "@/lib/config";
export const metadata = { title: "Explore Kochi", description: "Make Stayvo Kochi your base for heritage walks, waterfront evenings and backwater day trips. Enquire about taxis and tour packages." };
export default function DestinationsPage() {
  return <WebsiteShell><section className="hotel-page-header"><div className="container-site"><p className="hotel-eyebrow">Beyond your room</p><h1>A city full<br /><em>of little discoveries.</em></h1><p>Start with Kochi. Follow your curiosity. Ask us about taxis and tour packages.</p></div></section><section className="section-pad"><div className="container-site grid gap-12 lg:grid-cols-2"><div className="relative min-h-[480px] overflow-hidden rounded-xl"><Image src="/images/stayvo/rooftop.jpeg" alt="Kochi city views from the Stayvo rooftop" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /></div><div className="explore-list">{destinations.map((item,index)=><a key={item.name} href={whatsappUrl(`Hi Stayvo Kochi, please share taxi or tour package options for ${item.name} during my stay.`)} target="_blank" rel="noreferrer"><span>0{index+1}</span><div><h2>{item.name}</h2><p>{item.subtitle}</p></div><ArrowUpRight size={21} /></a>)}<div className="mt-8 flex gap-3 text-sm leading-7 text-[#77716a]"><MapPin size={20} className="shrink-0 text-[#8a621b]" /><p>Tell us what you’d like to see and how much time you have. Routes, availability and charges are confirmed by our team.</p></div></div></div></section><CTASection /></WebsiteShell>;
}
