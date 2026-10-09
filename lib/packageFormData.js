import { hotelCategories } from "@/lib/data";
const text = (form, key) => String(form.get(key) || "").trim();
function validImage(value) {
  if(value.startsWith("/") && !value.startsWith("//")) return true;
  try { return ["https:","http:"].includes(new URL(value).protocol); } catch { return false; }
}
export async function parsePackageForm(form) {
  const image = text(form,"imageUrl");
  if(!image || !validImage(image)) throw new Error("A valid main image URL or local image path is required.");
  const category = text(form,"category");
  if(!hotelCategories.includes(category)) throw new Error("Choose a hotel room or package category.");
  const title = text(form,"title");
  if(!title) throw new Error("Package title is required.");
  const days=Number(form.get("days")), nights=Number(form.get("nights")), price=Number(form.get("price"));
  const originalPrice = text(form,"originalPrice") ? Number(form.get("originalPrice")) : null;
  if(!Number.isInteger(days) || days<1 || !Number.isInteger(nights) || nights<0 || !Number.isFinite(price) || price<0 || (originalPrice!==null && (!Number.isFinite(originalPrice) || originalPrice<0))) throw new Error("Enter valid days, nights and non-negative prices.");
  let galleryUrls=[];
  if(form.has("galleryUrls")) {
    try { galleryUrls=JSON.parse(text(form,"galleryUrls") || "[]"); } catch { throw new Error("Invalid gallery image data."); }
    if(!Array.isArray(galleryUrls) || galleryUrls.some(url=>typeof url!=="string" || !validImage(url))) throw new Error("Gallery images must be valid URLs or local image paths.");
  }
  const itineraries=text(form,"itinerary").split("\n").filter(line=>line.trim()).map((line,index)=>{
    const [first,...rest]=line.split("|");
    return {day:index+1,title:rest.length ? (first.trim() || `Day ${index+1}`).slice(0,200) : `Day ${index+1}`,description:rest.length ? (rest.join("|").trim() || "Details will be shared.") : first.trim()};
  });
  const data={title,slug:text(form,"slug").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,""),destination:text(form,"destination"),country:text(form,"country"),category,duration:text(form,"duration"),days,nights,price,originalPrice,image,featured:form.get("featured")==="on",active:form.get("active")==="on"};
  for(const key of ["shortDescription","description","highlights","inclusions","exclusions"]) data[key]=text(form,key);
  for(const key of ["hotelDetails","transportation","terms","seoTitle","seoDescription"]) data[key]=text(form,key)||null;
  for(const key of ["destination","country","duration","shortDescription","description","highlights","inclusions","exclusions"]) if(!data[key]) throw new Error("Please complete the required package information.");
  return {data,itineraries,gallery:galleryUrls.map(image=>({image}))};
}
