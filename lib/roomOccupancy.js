import hotel from "./hotel.json";

export const extraBedPolicy = "Extra bed available at an additional fee, subject to availability. Please confirm the charge and bedding with our team.";
export const childrenPolicy = "Share the children’s ages when enquiring so we can confirm the bedding arrangements and any additional charges.";
export const arrivalPolicy = "Standard check-in is 12:00 PM and check-out is 11:00 AM. Ask about early check-in or late check-out; availability and any additional charges are confirmed by our team.";

export function getRoomOccupancy(slug) {
  const room = hotel.rooms.find(room => room.slug === slug);
  return room && Number.isInteger(room.adults) && Number.isInteger(room.children) ? room : null;
}

export function occupancyLabel(room) {
  return `${room.adults} ${room.adults === 1 ? "adult" : "adults"} + ${room.children} ${room.children === 1 ? "child" : "children"}`;
}
