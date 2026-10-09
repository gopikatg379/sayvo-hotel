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
    await prisma.package.upsert({where:{slug:room.slug},update:{},create:{
      title:room.name,slug:room.slug,destination:"Kochi",country:"India",category:room.category,
      duration:"1 Night",days:2,nights:1,price:room.offSeason,
      shortDescription:room.description,
      description:room.description+" Stay at Stayvo Kochi by Maparani Group. Check-in from 12:00 PM; check-out by 11:00 AM. Contact us to confirm your seasonal tariff and availability.",
      highlights:`${room.beds}-guest option\n${room.ac?"Air-conditioned":"Non-AC"}\nBreakfast available\nTaxi services and tour packages available`,
      inclusions:"One night in the selected room or capsule type",
      exclusions:"Breakfast unless included in your confirmed booking\nTaxi services and tours\nPersonal expenses",
      hotelDetails:`Stayvo Kochi by Maparani Group. ${room.name}. Check-in: 12:00 PM. Check-out: 11:00 AM.`,
      transportation:"Taxi services and tour packages available on enquiry, charged separately.",
      terms:`Nightly tariff: Off season ₹${room.offSeason}; regular season ₹${room.regularSeason}; peak season ₹${room.peakSeason}. Peak rates apply on holidays and long weekends. Final rates and booking terms are confirmed by the hotel.`,
      image:"/images/stayvo/entrance.jpeg",featured:[0,4,7].includes(index),active:true,
      seoTitle:`${room.name} | Stayvo Kochi`,seoDescription:room.description,
      images:{create:[{image:"/images/stayvo/entrance.jpeg"},{image:"/images/stayvo/rooftop.jpeg"}]}
    }});
  }
  console.log("Stayvo admin and room templates are ready. Existing records were preserved.");
}
main().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>prisma.$disconnect());
