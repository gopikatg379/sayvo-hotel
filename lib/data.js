import hotel from "./hotel.json";
export const hotelCategories = hotel.categories;
export const roomTypes = hotel.rooms;
export const seasons = hotel.seasons;
export const samplePackages = roomTypes.map((room, index) => ({
  id: index + 1, isSample: true, title: room.name, slug: room.slug,
  destination: "Kochi", country: "India", category: room.category,
  duration: "1 Night", days: 2, nights: 1, price: room.offSeason, originalPrice: null,
  shortDescription: room.description,
  description: `${room.description} Stay at Stayvo Kochi by Maparani Group. Check in from 12:00 PM and check out by 11:00 AM. Contact our team with your dates to confirm availability and the applicable seasonal tariff.`,
  highlights: `${room.beds}-guest option\n${room.ac ? "Air-conditioned" : "Non-AC"}\nKochi city stay\nBreakfast available\nTaxi services and tour packages available`,
  inclusions: `One night in the selected ${room.category === "Capsule Pods" ? "capsule pod" : "room type"}\n${room.ac ? "Air conditioning" : "Non-AC accommodation"}`,
  exclusions: "Breakfast unless confirmed in your booking\nTaxi services and tours\nPersonal expenses",
  hotelDetails: `Stayvo Kochi, by Maparani Group. ${room.name}. Check-in: 12:00 PM. Check-out: 11:00 AM.`,
  transportation: "Taxi services and tour packages can be arranged on enquiry. Charges are confirmed separately.",
  terms: `Off season: ₹${room.offSeason.toLocaleString("en-IN")}. Regular season: ₹${room.regularSeason.toLocaleString("en-IN")}. Peak season: ₹${room.peakSeason.toLocaleString("en-IN")}. Prices shown are per night, subject to availability. Peak tariffs apply during holidays and long weekends. Please confirm your final rate and booking terms with the hotel.`,
  image: "/images/stayvo/entrance.jpeg", featured: [0, 4, 7].includes(index), active: true,
  seoTitle: `${room.name} | Stayvo Kochi`, seoDescription: room.description,
  images: [{ id: 1, image: "/images/stayvo/entrance.jpeg" }, { id: 2, image: "/images/stayvo/rooftop.jpeg" }], itineraries: [],
}));
export const destinations = [
  { name: "Fort Kochi", subtitle: "Heritage lanes & Chinese fishing nets" },
  { name: "Mattancherry", subtitle: "Culture, art & spice markets" },
  { name: "Marine Drive", subtitle: "Waterfront walks & evening views" },
  { name: "Alleppey", subtitle: "A backwater day trip from Kochi" },
];
