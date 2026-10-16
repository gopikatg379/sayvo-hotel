import { Users } from "lucide-react";
import { getRoomOccupancy, occupancyLabel, extraBedPolicy, childrenPolicy } from "@/lib/roomOccupancy";

export default function RoomOccupancy({ slug, compact = false }) {
  const room = getRoomOccupancy(slug);
  if (!room) return null;
  if (compact) return <div className="room-capacity"><p><Users size={15} aria-hidden="true" /><strong>{occupancyLabel(room)}</strong></p><small>Extra bed available at an additional fee.</small></div>;
  return <section className="room-occupancy-panel" aria-label="Room occupancy and bedding">
    <p className="hotel-eyebrow">Room occupancy & bedding</p><h3 className="font-serif text-2xl">Up to {occupancyLabel(room)}</h3>
    <p>{extraBedPolicy}</p><p>{childrenPolicy}</p>
  </section>;
}
