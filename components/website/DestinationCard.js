import { ArrowUpRight, MapPin } from "lucide-react";
import { whatsappUrl } from "@/lib/config";
export default function DestinationCard({item,index=0}) {
  return <a href={whatsappUrl(`Hi Stayvo Kochi, please share taxi and tour options for ${item.name}.`)} target="_blank" rel="noreferrer" className="block rounded-lg border border-[#e9e1d2] bg-[#f8f5ef] p-7"><div className="flex justify-between text-[#8a621b]"><MapPin size={20} /><small>0{index+1}</small></div><h3 className="mt-5 font-serif text-3xl">{item.name}</h3><p className="mt-3 text-sm text-[#77716a]">{item.subtitle}</p><span className="gold-link mt-6">Enquire about a tour <ArrowUpRight size={15} /></span></a>;
}
