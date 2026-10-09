import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/config";
export default function WhatsAppButton(){return <a aria-label="Chat with Stayvo Kochi on WhatsApp" title="Chat with us" href={whatsappUrl("Hi Stayvo Kochi, I would like to know more about your stay and tour packages.")} target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-2xl transition hover:scale-110"><MessageCircle size={27} fill="currentColor"/></a>}
