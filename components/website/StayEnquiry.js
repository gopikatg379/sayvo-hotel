"use client";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { whatsappUrl } from "@/lib/config";
import { roomTypes } from "@/lib/data";
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
    window.open(whatsappUrl(`Hi Stayvo Kochi, I would like to enquire about availability.\nCheck-in: ${form.checkIn}\nCheck-out: ${form.checkOut}\nGuests: ${form.guests}\nRoom preference: ${form.room}\nPlease confirm the seasonal tariff and availability.`), "_blank", "noopener,noreferrer");
  }
  return <form onSubmit={submit} className="stay-enquiry"><div className="enquiry-intro"><small>MAKE YOURSELF AT HOME</small><strong>Your next stay</strong></div><label>Check-in<input aria-label="Check-in date" type="date" name="checkIn" min={minimumDate} value={checkIn} onChange={e=>setCheckIn(e.target.value)} required /></label><label>Check-out<input aria-label="Check-out date" type="date" name="checkOut" min={minimumCheckout} onChange={e=>e.target.setCustomValidity("")} required /></label><label>Guests<select name="guests" defaultValue="2">{[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n} {n===1?"guest":"guests"}</option>)}<option value="7+">7+ guests</option></select></label><label>Room preference<select name="room" defaultValue=""><option value="">Help me choose</option>{roomTypes.map(room=><option key={room.slug}>{room.name}</option>)}</select></label><button type="submit" className="button-gold">Check availability <ArrowUpRight size={16} /></button><p className="enquiry-footnote">Enquire on WhatsApp · Your booking is confirmed by our hotel team.</p></form>;
}
