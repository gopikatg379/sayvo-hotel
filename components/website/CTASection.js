import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { whatsappUrl } from "@/lib/config";
export default function CTASection() {
  return <section className="stayvo-cta"><div className="container-site flex flex-col justify-between gap-8 md:flex-row md:items-center"><div><p className="hotel-eyebrow">A convenient city stay starts here</p><h2>Your plans. <em>Your central base.</em></h2><p className="mt-4 text-sm text-white/60">Share your dates, adults, children and arrival plans. We’ll help you choose a room and confirm bedding, extra bed charges and timings.</p></div><div className="flex flex-wrap gap-3"><Link className="button-gold" href="/contact">Enquire a stay <ArrowUpRight size={17} /></Link><a className="button-outline" href={whatsappUrl("Hi Stayvo Kochi, please help me choose a room for my stay.")} target="_blank" rel="noreferrer">Chat on WhatsApp</a></div></div></section>;
}
