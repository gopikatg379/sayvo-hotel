import WebsiteShell from "@/components/website/WebsiteShell";
import RoomTariffs from "@/components/website/RoomTariffs";
import CTASection from "@/components/website/CTASection";
import { Clock3, BedDouble, Users } from "lucide-react";
import { arrivalPolicy, extraBedPolicy, childrenPolicy } from "@/lib/roomOccupancy";

export const metadata = { title: "Rooms, occupancy & seasonal rates", description: "Compare Stayvo Kochi rooms and tariffs. Double rooms accommodate 2 adults + 1 child; family suites up to 6 adults + 4 children. Extra bed available at an additional fee." };

export default function RoomsPage() {
  return <WebsiteShell>
    <section className="hotel-page-header"><div className="container-site"><p className="hotel-eyebrow">City stays, sized for your visit</p><h1>Your room.<br /><em>Your people.</em></h1><p>Double rooms for 2 adults + 1 child. Family suites for up to 6 adults + 4 children. AC and non-AC options in central Kochi, alongside our four-bed rooms.</p></div></section>
    <section className="section-pad"><div className="container-site">
      <div className="section-heading-row mb-10"><div><p className="hotel-eyebrow">Occupancy & seasonal rates</p><h2 className="hotel-title">Plan your stay.<br /><em>Know your options.</em></h2></div><span className="text-sm text-[#77716a]">Nightly tariffs · Indian rupees</span></div>
      <RoomTariffs />
      <div className="mt-10 grid gap-7 border-t border-black/10 pt-8 sm:grid-cols-3">{[
        [Clock3,"Easy check-in & check-out",arrivalPolicy],
        [BedDouble,"Extra bed available",extraBedPolicy],
        [Users,"Travelling with children?",childrenPolicy],
      ].map(([Icon,title,description])=><div key={title} className="flex items-start gap-4"><Icon className="shrink-0 text-[#8a621b]" /><div><h3 className="text-sm font-bold">{title}</h3><p className="mt-2 text-xs leading-6 text-[#77716a]">{description}</p></div></div>)}</div>
    </div></section><CTASection />
  </WebsiteShell>;
}
