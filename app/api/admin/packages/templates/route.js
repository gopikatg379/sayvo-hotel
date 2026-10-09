import prisma from "@/lib/prisma";
import { refreshPublicPackages } from "@/lib/publicCache";
import { getAdminSession } from "@/lib/auth";
import { samplePackages } from "@/lib/data";
export async function POST() {
  if(!(await getAdminSession())) return Response.json({message:"Unauthorized"},{status:401});
  try {
    await prisma.$transaction(samplePackages.map(item=>{
      const {id,isSample,images,itineraries,...data}=item;
      return prisma.package.upsert({where:{slug:data.slug},update:{},create:{...data,images:{create:images.map(({image})=>({image}))}}});
    }));
    refreshPublicPackages();
    return Response.json({ok:true,message:"Stayvo room templates loaded. Existing packages were preserved."});
  } catch {return Response.json({message:"Could not load room templates. Check the database connection."},{status:500});}
}
