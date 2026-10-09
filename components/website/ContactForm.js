"use client";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { whatsappUrl } from "@/lib/config";
export default function ContactForm({ defaultPackage = "", packageId }) {
  const [state, setState] = useState({loading:false,message:"",success:false});
  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const phone = values.phone.replace(/\D/g,"").replace(/^91(?=\d{10}$)/,"");
    if(!/^[6-9]\d{9}$/.test(phone)) {setState({loading:false,message:"Please enter a valid 10-digit Indian mobile number.",success:false});return;}
    if((values.checkIn || values.checkOut) && (!values.checkIn || !values.checkOut || values.checkOut<=values.checkIn)) {setState({loading:false,message:"Please provide both dates, with check-out after check-in.",success:false});return;}
    setState({loading:true,message:"",success:false});
    const message = [values.message, values.checkIn && `Check-in: ${values.checkIn}`, values.checkOut && `Check-out: ${values.checkOut}`, `Guests: ${values.guests}`].filter(Boolean).join("\n");
    try {
      const res = await fetch("/api/enquiries",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:values.name,phone,email:values.email,destination:values.destination,message,...(packageId ? {packageId} : {})})});
      if(!res.ok) throw new Error("Could not send your enquiry. Please try again or contact us on WhatsApp.");
      form.reset();setState({loading:false,message:"Thank you. The Stayvo Kochi team will contact you shortly to discuss your stay.",success:true});
    } catch(error) {setState({loading:false,message:error.message,success:false});}
  }
  const inputClass = "mt-2 w-full rounded-lg border border-[#e9e1d2] bg-white px-4 py-3 font-normal outline-none focus:border-[#8a621b]";
  return <form onSubmit={submit} className="rounded-lg border border-[#e9e1d2] bg-white p-6 soft-shadow md:p-8"><p className="hotel-eyebrow">Stay enquiry</p><h2 className="mb-7 font-serif text-3xl">Tell us a little about your visit.</h2><div className="grid gap-5 sm:grid-cols-2">
    <label className="text-xs font-bold">Your name<input name="name" autoComplete="name" required maxLength={120} className={inputClass} /></label>
    <label className="text-xs font-bold">Mobile number<input name="phone" type="tel" autoComplete="tel" required placeholder="+91 97464 00000" maxLength={18} className={inputClass} /></label>
    <label className="text-xs font-bold">Email (optional)<input name="email" type="email" autoComplete="email" maxLength={254} className={inputClass} /></label>
    <label className="text-xs font-bold">Room or package preference<input name="destination" defaultValue={defaultPackage} maxLength={200} className={inputClass} /></label>
    <label className="text-xs font-bold">Check-in (optional)<input name="checkIn" type="date" className={inputClass} /></label>
    <label className="text-xs font-bold">Check-out (optional)<input name="checkOut" type="date" className={inputClass} /></label>
    <label className="text-xs font-bold">Number of guests<select name="guests" defaultValue="2" className={inputClass}>{[1,2,3,4,5,6].map(n=><option value={n} key={n}>{n} {n===1?"guest":"guests"}</option>)}<option value="7+">7+ guests</option></select></label>
  </div><label className="mt-5 block text-xs font-bold">Your message<textarea name="message" required rows={5} maxLength={5000} placeholder="Tell us about your stay, room preference, or taxi and tour needs." className={inputClass} /></label><button type="submit" disabled={state.loading} className="button-gold mt-6 w-full sm:w-auto">{state.loading ? "Sending…" : "Send enquiry"}<ArrowUpRight size={16} /></button><p className="mt-4 text-xs leading-6 text-[#77716a]">Our team will confirm availability, rates, and booking details with you.</p>{state.message && <p role="status" aria-live="polite" className={`mt-4 text-sm ${state.success?"text-green-700":"text-red-700"}`}>{state.message}</p>}{state.message && !state.success && <a className="gold-link mt-4" href={whatsappUrl(`Hi Stayvo Kochi, I would like to enquire about ${defaultPackage || "a stay"}.`)} target="_blank" rel="noreferrer">Contact us on WhatsApp ↗</a>}</form>;
}
