require("dotenv").config({quiet:true});
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const hotel = require("../lib/hotel.json");
const prisma = new PrismaClient();
async function main() {
  const email = (process.env.ADMIN_SEED_EMAIL || "admin@stayvokochi.com").trim().toLowerCase();
  const password = await bcrypt.hash(process.env.ADMIN_SEED_PASSWORD || "ChangeMe123!",12);
  await prisma.admin.upsert({where:{email},update:{},create:{name:"Stayvo Kochi Admin",email,password}});
  for(const [index,room] of hotel.rooms.entries()) {
    const occupancy = Number.isInteger(room.adults) && Number.isInteger(room.children)
      ? `${room.adults} adults + ${room.children} ${room.children === 1 ? "child" : "children"}`
      : `${room.beds}-guest option`;
    await prisma.package.upsert({where:{slug:room.slug},update:{},create:{
      title:room.name,slug:room.slug,destination:"Kochi",country:"India",category:room.category,
      duration:"1 Night",days:2,nights:1,price:room.offSeason,
      shortDescription:room.description,
      description:room.description+" Stay at Stayvo Kochi by Maprani Group. Check-in from 12:00 PM; check-out by 11:00 AM. Contact us to confirm your seasonal tariff and availability.",
      highlights:`${occupancy}\n${room.ac?"Air-conditioned":"Non-AC"}\nCentral Kochi location\nWalk to South Railway Station, Metro and Medical Trust Hospital\nClose to Cochin Shipyard\nBreakfast available`,
      inclusions:"One night in the selected room type",
      exclusions:"Extra bed charges\nBreakfast unless included in your confirmed booking\nTaxi services and tours\nPersonal expenses",
      hotelDetails:`Stayvo Kochi by Maprani Group. ${room.name}. ${occupancy}. Check-in: 12:00 PM. Check-out: 11:00 AM. Ask about early check-in or late check-out; availability and any additional charges are confirmed by our team. Extra bed available at an additional fee, subject to availability.`,
      transportation:"Taxi services and tour packages available on enquiry, charged separately.",
      terms:`Nightly tariff: Off season ₹${room.offSeason}; regular season ₹${room.regularSeason}; peak season ₹${room.peakSeason}. Peak rates apply on holidays and long weekends. Final rates and booking terms are confirmed by the hotel.`,
      image:"/images/stayvo/entrance.jpeg",featured:[0,2,4].includes(index),active:true,
      seoTitle:`${room.name} | Stayvo Kochi`,seoDescription:room.description,
      images:{create:[{image:"/images/stayvo/entrance.jpeg"},{image:"/images/stayvo/rooftop.jpeg"}]}
    }});
  }
  console.log("Stayvo admin and room templates are ready. Existing records were preserved.");
}
main().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>prisma.$disconnect());
