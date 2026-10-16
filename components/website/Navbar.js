"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, Phone } from "lucide-react";
import Logo from "./Logo";
import { siteConfig } from "@/lib/config";
const links = [["Home", "/"], ["Rooms & rates", "/rooms"], ["Packages", "/packages"], ["Location & nearby", "/destinations"], ["About", "/about"], ["Contact", "/contact"]];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return <header className="stayvo-header">
    <div className="stayvo-topbar"><div className="container-site"><span>Comfort in the heart of Kochi</span><a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}><Phone size={12} /> {siteConfig.phone}</a></div></div>
    <div className="container-site stayvo-nav"><Logo /><nav className="desktop-nav" aria-label="Main navigation">{links.map(([label, href]) => <Link key={href} href={href} prefetch={true} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}</nav><Link href="/contact" prefetch={true} className="button-gold nav-book">Enquire a stay <ArrowUpRight size={16} /></Link><button type="button" className="mobile-toggle" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button></div>
    {open && <nav id="mobile-navigation" className="mobile-nav container-site" aria-label="Mobile navigation">{links.map(([label, href]) => <Link key={href} href={href} prefetch={true} aria-current={pathname === href ? "page" : undefined} onClick={() => setOpen(false)}>{label}</Link>)}<Link href="/contact" prefetch={true} className="button-gold" onClick={() => setOpen(false)}>Enquire a stay <ArrowUpRight size={16} /></Link></nav>}
  </header>;
}
