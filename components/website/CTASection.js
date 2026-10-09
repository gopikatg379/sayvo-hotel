import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { whatsappUrl } from "@/lib/config";
export default function CTASection() {
  return <section className="stayvo-cta"><div className="container-site flex flex-col justify-between gap-8 md:flex-row md:items-center"><div><p className="hotel-eyebrow">Your Kochi chapter starts here</p><h2>Stay a little. <em>Feel at home.</em></h2><p className="mt-4 text-sm text-white/60">Share your dates. We’ll help you find the right room and plan the little details.</p></div><div className="flex flex-wrap gap-3"><Link className="button-gold" href="/contact">Enquire a stay <ArrowUpRight size={17} /></Link><a className="button-outline" href={whatsappUrl("Hi Stayvo Kochi, please help me choose a room for my stay.")} target="_blank" rel="noreferrer">Chat on WhatsApp</a></div></div></section>;
}
