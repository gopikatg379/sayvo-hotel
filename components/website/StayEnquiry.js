"use client";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { whatsappUrl } from "@/lib/config";
import { roomTypes } from "@/lib/data";
import { guestDetails } from "@/lib/stayEnquiry";
export default function StayEnquiry() {
  const [checkIn, setCheckIn] = useState("");
  const today = new Date();
  const minimumDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
  const nextDay = checkIn ? new Date(checkIn+"T00:00:00") : null;
  if(nextDay) nextDay.setDate(nextDay.getDate()+1);
  const minimumCheckout = nextDay ? `${nextDay.getFullYear()}-${String(nextDay.getMonth()+1).padStart(2,"0")}-${String(nextDay.getDate()).padStart(2,"0")}` : minimumDate;
  function submit(event) {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));
    const checkout = event.currentTarget.elements.checkOut;
    if(form.checkOut<=form.checkIn){checkout.setCustomValidity("Check-out must be after check-in.");checkout.reportValidity();return;}
    window.open(whatsappUrl(`Hi Stayvo Kochi, I would like to enquire about availability.\nCheck-in: ${form.checkIn}\nCheck-out: ${form.checkOut}\n${guestDetails(form)}\nRoom preference: ${form.room || "Help me choose"}\nPlease confirm the tariff, bedding arrangements and any extra bed charges.`), "_blank", "noopener,noreferrer");
  }
  return <form onSubmit={submit} className="stay-enquiry">
    <div className="enquiry-intro"><small>YOUR CENTRAL KOCHI BASE</small><strong>Plan your stay</strong></div>
    <label>Check-in<input aria-label="Check-in date" type="date" name="checkIn" min={minimumDate} value={checkIn} onChange={e=>setCheckIn(e.target.value)} required /></label>
    <label>Check-out<input aria-label="Check-out date" type="date" name="checkOut" min={minimumCheckout} onChange={e=>e.target.setCustomValidity("")} required /></label>
    <label>Adults<select name="adults" defaultValue="2">{[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n} {n===1?"adult":"adults"}</option>)}<option value="7+">7+ adults</option></select></label>
    <label>Children<select name="children" defaultValue="0">{[0,1,2,3,4].map(n=><option key={n} value={n}>{n} {n===1?"child":"children"}</option>)}<option value="5+">5+ children</option></select></label>
    <label>Room preference<select name="room" defaultValue=""><option value="">Help me choose</option>{roomTypes.map(room=><option key={room.slug}>{room.name}</option>)}</select></label>
    <button type="submit" className="button-gold">Check availability <ArrowUpRight size={17} /></button>
    <p className="enquiry-footnote">Enquire on WhatsApp · Tell us children’s ages in your message · Extra beds carry an additional fee · Our team confirms your booking.</p>
  </form>;
}
