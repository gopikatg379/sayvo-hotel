import Link from "next/link";
import { ArrowUpRight, TrainFront, Hospital, GraduationCap, ShoppingBag, Ship, Clock3 } from "lucide-react";
import { locationAdvantages } from "@/lib/location";
import { whatsappUrl } from "@/lib/config";

const icons = { rail: TrainFront, hospital: Hospital, education: GraduationCap, shopping: ShoppingBag, shipyard: Ship, arrival: Clock3 };

export default function LocationAdvantages({ showHeading = true }) {
  return <section id="why-stayvo" className="section-pad location-advantages">
    <div className="container-site">
      {showHeading && <div className="section-heading-row mb-10">
        <div><p className="hotel-eyebrow">Why choose Stayvo?</p><h2 className="hotel-title">In the city.<br /><em>Close to your plans.</em></h2><p className="section-description">A central Kochi address for work, hospital visits, education, shopping and family stays. Keep the places you need close by.</p></div>
        <Link href="/destinations" className="gold-link">Location & nearby <ArrowUpRight size={16} /></Link>
      </div>}
      {!showHeading && <h2 className="sr-only">Why choose Stayvo?</h2>}
      <div className="advantages-grid">{locationAdvantages.map(item => {
        const Icon = icons[item.icon];
        return <article className="advantage-card" key={item.icon}>
          <Icon size={27} strokeWidth={1.4} aria-hidden="true" />
          <p className="advantage-label">{item.label}</p><h3>{item.title}</h3><p>{item.description}</p>
        </article>;
      })}</div>
      <div className="location-help"><p>Tell us the station, hospital, campus or store you’re visiting. Our team can help with directions and the most convenient way to reach it.</p><a href={whatsappUrl("Hi Stayvo Kochi, please help me with your location and directions to the nearby places I need to visit.")} className="gold-link" target="_blank" rel="noreferrer">Ask for directions <ArrowUpRight size={15} /></a></div>
    </div>
  </section>;
}
