import { BedDouble, Clock3, Coffee } from "lucide-react";
export default function TravelStats() {
  return <section className="hotel-amenities"><div className="container-site grid gap-6 sm:grid-cols-3">{[[BedDouble,"8 room options","Double rooms, family rooms, suites & pods"],[Clock3,"12 PM / 11 AM","Check-in / check-out"],[Coffee,"Breakfast available","Ask our team for options"]].map(([Icon,title,text])=><div key={title}><Icon size={25} /><h3>{title}</h3><p>{text}</p></div>)}</div></section>;
}
