import Link from "next/link";
import WebsiteShell from "@/components/website/WebsiteShell";
import PackageCard from "@/components/website/PackageCard";
import { getPackages } from "@/lib/packages";
import { hotelCategories } from "@/lib/data";
export const metadata = { title: "Rooms & stay packages", description: "Find your Stayvo Kochi room or stay package. Filter by room category, budget, location and duration." };
export default async function PackagesPage({ searchParams }) {
  const q = await searchParams;
  const destination = typeof q.destination === "string" ? q.destination.trim() : "";
  const category = typeof q.category === "string" ? q.category : "";
  const maxPrice = Math.max(0,Number(q.maxPrice) || 0), maxDays = Math.max(0,Number(q.maxDays) || 0);
  let items = await getPackages({ destination, category: category || undefined });
  if(maxPrice) items = items.filter(item=>Number(item.price)<=maxPrice);
  if(maxDays) items = items.filter(item=>item.days<=maxDays);
  const suggestions = items.length ? [] : (await getPackages()).slice(0,3);
  const fieldClass = "mt-2 w-full rounded-lg border border-[#e9e1d2] bg-white px-3 py-3 text-sm";
  return <WebsiteShell><section className="hotel-page-header"><div className="container-site"><p className="hotel-eyebrow">Make it your kind of visit</p><h1>A stay to suit<br /><em>your plans.</em></h1><p>Find a room, discover a stay package, or enquire about taxis and tours.</p></div></section><section className="section-pad"><div className="container-site grid gap-8 lg:grid-cols-[260px_1fr]">
    <form className="h-fit rounded-lg border border-[#e9e1d2] bg-[#f8f5ef] p-6 lg:sticky lg:top-36"><h2 className="font-serif text-2xl">Find your stay</h2><label className="mt-5 block text-xs font-bold">Location<input name="destination" defaultValue={destination} placeholder="e.g. Kochi" className={fieldClass} /></label><label className="mt-4 block text-xs font-bold">Category<select name="category" defaultValue={category} className={fieldClass}><option value="">All categories</option>{hotelCategories.map(value=><option key={value}>{value}</option>)}</select></label><label className="mt-4 block text-xs font-bold">Maximum starting price<select name="maxPrice" defaultValue={q.maxPrice || ""} className={fieldClass}><option value="">Any budget</option>{[1000,2000,3500,5000,8000,15000].map(value=><option value={value} key={value}>₹{value.toLocaleString("en-IN")}</option>)}</select></label><label className="mt-4 block text-xs font-bold">Maximum duration<select name="maxDays" defaultValue={q.maxDays || ""} className={fieldClass}><option value="">Any duration</option>{[2,3,5,7].map(value=><option value={value} key={value}>{value} days</option>)}</select></label><button className="button-gold mt-6 w-full" type="submit">Apply filters</button><Link href="/packages" className="mt-4 block text-center text-xs text-[#77716a]">Clear filters</Link><Link href="/rooms" className="gold-link mt-6">Seasonal room tariffs ↗</Link></form>
    <div>{items.length ? <><p className="mb-6 text-xs text-[#77716a]">{items.length} {items.length===1?"option":"options"} found · Rates depend on dates and availability</p><div className="grid gap-6 md:grid-cols-2">{items.map(pkg=><PackageCard key={pkg.id} pkg={pkg} />)}</div></> : <><div className="rounded-lg border border-[#e9e1d2] bg-[#f8f5ef] p-10 text-center"><h2 className="font-serif text-2xl">No stays match these filters.</h2><p className="mt-4 text-sm leading-7 text-[#77716a]">Try another category or budget, or let our team help you choose.</p><Link href="/contact" className="gold-link mt-5">Ask the hotel ↗</Link></div>{suggestions.length>0 && <><h3 className="my-8 font-serif text-2xl">You might also like</h3><div className="grid gap-6 md:grid-cols-2">{suggestions.map(pkg=><PackageCard key={pkg.id} pkg={pkg} />)}</div></>}</>}</div>
  </div></section></WebsiteShell>;
}
