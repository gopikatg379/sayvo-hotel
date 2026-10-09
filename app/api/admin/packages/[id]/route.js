import prisma from "@/lib/prisma";
import { refreshPublicPackages } from "@/lib/publicCache";
import { getAdminSession } from "@/lib/auth";
import { parsePackageForm } from "@/lib/packageFormData";
export async function PUT(request,{params}) {
  if(!(await getAdminSession())) return Response.json({message:"Unauthorized"},{status:401});
  try {
    const {id}=await params;
    const form=await request.formData();
    const {data,itineraries,gallery}=await parsePackageForm(form);
    const pkg=await prisma.package.update({where:{id:Number(id)},data:{...data,itineraries:{deleteMany:{},create:itineraries},...(form.has("galleryUrls")?{images:{deleteMany:{},create:gallery}}:{})}});
    refreshPublicPackages();
    return Response.json(pkg);
  } catch(error) {return Response.json({message:error.message || "Could not update package."},{status:400});}
}
export async function DELETE(request,{params}) {
  if(!(await getAdminSession())) return Response.json({message:"Unauthorized"},{status:401});
  try {const {id}=await params;await prisma.package.delete({where:{id:Number(id)}});refreshPublicPackages();return Response.json({ok:true});}
  catch {return Response.json({message:"Could not delete package."},{status:400});}
}
