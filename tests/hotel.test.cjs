const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

async function load(file, mocks = {}) {
  mocks = {
    "next/cache": { unstable_cache: query => query, revalidateTag: () => {}, revalidatePath: () => {} },
    "react": { cache: query => query },
    ...mocks,
  };
  const context = vm.createContext({ URL, FormData, Response, Request, console, setTimeout, clearTimeout });
  const cache = new Map();
  async function moduleFor(filename) {
    const full = path.resolve(filename);
    if(cache.has(full)) return cache.get(full);
    let mod;
    if(full.endsWith(".json")) {
      const value = JSON.parse(fs.readFileSync(full,"utf8"));
      mod = new vm.SyntheticModule(["default"],function(){this.setExport("default",value);},{context,identifier:full});
    } else {
      mod = new vm.SourceTextModule(fs.readFileSync(full,"utf8"),{context,identifier:full});
    }
    cache.set(full,mod);
    await mod.link(async (specifier, referencing) => {
      if(mocks[specifier]) {
        const values=mocks[specifier];
        return new vm.SyntheticModule(Object.keys(values),function(){for(const [key,value] of Object.entries(values)) this.setExport(key,value);},{context});
      }
      const target=specifier.startsWith("@/") ? specifier.slice(2) : path.resolve(path.dirname(referencing.identifier),specifier);
      return moduleFor(path.extname(target) ? target : target+".js");
    });
    return mod;
  }
  const mod=await moduleFor(file);
  await mod.evaluate();
  return mod.namespace;
}

function packageForm(overrides = {}) {
  const form=new FormData();
  const values={title:"Kochi Family Stay",slug:"kochi-family-stay",destination:"Kochi",country:"India",category:"Stay Packages",duration:"1 Night",days:"2",nights:"1",price:"3500",shortDescription:"A Kochi family stay.",description:"Stay in Kochi.",highlights:"Family room",inclusions:"Accommodation",exclusions:"Taxi services",imageUrl:"/images/stayvo/entrance.jpeg",active:"on",galleryUrls:JSON.stringify(["/images/stayvo/entrance.jpeg","/images/stayvo/rooftop.jpeg"]),...overrides};
  for(const [key,value] of Object.entries(values)) form.set(key,value);
  return form;
}

test("the eight seasonal tariffs match the supplied chart",()=>{
  const hotel=JSON.parse(fs.readFileSync("lib/hotel.json","utf8"));
  assert.deepEqual(hotel.rooms.map(room=>[room.offSeason,room.regularSeason,room.peakSeason]),[
    [1800,2200,2800],[1400,1700,2200],[3500,4500,5500],[2500,3000,4000],
    [5000,6500,8000],[3500,4000,5500],[700,900,1200],[500,600,800]
  ]);
});

test("an uninitialized hotel catalog shows the room templates and honours filters",async()=>{
  const mod=await load("lib/packages.js",{"@/lib/prisma":{default:{package:{findMany:async()=>[],count:async()=>0}}}});
  assert.equal((await mod.getPackages()).length,8);
  assert.equal((await mod.getPackages({featured:true})).length,3);
  assert.equal((await mod.getPackages({category:"Capsule Pods"})).length,2);
  assert.equal((await mod.getPackages({destination:"Bali"})).length,0);
});

test("hidden or deleted packages in an initialized catalog are not replaced by templates",async()=>{
  const mod=await load("lib/packages.js",{"@/lib/prisma":{default:{package:{findMany:async()=>[{id:1,category:"Double Rooms",active:false}],findUnique:async()=>null}}}});
  assert.equal((await mod.getPackages()).length,0);
  assert.equal(await mod.getPackageBySlug("double-room-ac"),null);
});

function publicCacheHarness() {
  const entries = new Map();
  const paths = [];
  const expirations = [];
  return {
    paths, expirations,
    api: {
      unstable_cache: (query, keys, options) => async (...args) => {
        const key = JSON.stringify([keys, args]);
        if (entries.has(key)) return entries.get(key).value;
        const value = await query(...args);
        entries.set(key, { value, tags: options.tags });
        return value;
      },
      revalidateTag: (tag, profile) => {
        expirations.push({tag, expire: profile.expire});
        for (const [key, item] of entries) if (item.tags.includes(tag)) entries.delete(key);
      },
      revalidatePath: (path, type) => paths.push([path, type]),
    },
  };
}

test("public catalog filters reuse a lightweight query and admin changes expire it", async () => {
  const harness = publicCacheHarness();
  let reads = 0;
  const rows = [
    {id:1,category:"Double Rooms",active:true,featured:true,destination:"Kochi"},
    {id:2,category:"Capsule Pods",active:true,featured:false,destination:"Kochi"},
    {id:3,category:"Family Suites",active:false,featured:false,destination:"Kochi"},
  ];
  const mod = await load("lib/packages.js", {
    "next/cache": harness.api,
    "@/lib/prisma": {default:{package:{findMany:async query=>{
      reads++;
      assert.equal(query.include,undefined);
      assert.equal(query.select.image,true);
      return rows.slice();
    }}}},
  });
  assert.equal((await mod.getPackages()).length,2);
  assert.equal((await mod.getPackages({featured:true})).length,1);
  assert.equal((await mod.getPackages({category:"Capsule Pods"}))[0].id,2);
  assert.equal((await mod.getPackages({destination:"kochi"})).length,2);
  assert.equal(reads,1);
  const cache = await load("lib/publicCache.js", {"next/cache":harness.api});
  rows[0] = {...rows[0],active:false};
  cache.refreshPublicPackages();
  assert.equal((await mod.getPackages()).length,1);
  assert.equal(reads,2);
  assert.ok(harness.paths.some(([path,type])=>path==="/packages/[slug]"&&type==="page"));
  assert.equal(harness.expirations[0].expire,0);
});

test("moderating a review refreshes the cached public feedback", async () => {
  const harness = publicCacheHarness();
  let rows = [], reads = 0;
  const mod = await load("lib/reviews.js", {
    "next/cache":harness.api,
    "@/lib/prisma":{default:{review:{findMany:async()=>{reads++;return rows;}}}},
  });
  assert.equal((await mod.getApprovedHotelReviews()).length,0);
  assert.equal((await mod.getApprovedHotelReviews()).length,0);
  assert.equal(reads,1);
  rows = [{id:10,featured:false,status:"APPROVED"}];
  const cache = await load("lib/publicCache.js", {"next/cache":harness.api});
  cache.refreshPublicReviews();
  assert.equal((await mod.getApprovedHotelReviews())[0].id,10);
  assert.equal(reads,2);
  assert.ok(harness.paths.some(([path])=>path==="/"));
});

test("review moderation expires public feedback after a successful write", async () => {
  const harness = publicCacheHarness();
  const changes = [];
  const mod = await load("app/api/admin/reviews/[id]/route.js", {
    "next/cache":harness.api,
    "next/navigation":{redirect:path=>{throw new Error("Redirect: "+path);}},
    "@/lib/auth":{getAdminSession:async()=>({id:1})},
    "@/lib/prisma":{default:{review:{
      findFirst:async()=>({id:10}),
      update:async query=>{changes.push(query.data);},
      delete:async()=>{},
    }}},
  });
  for (const action of ["approve","reject","delete"]) {
    const form = new FormData();form.set("action",action);
    await assert.rejects(()=>mod.POST({formData:async()=>form},{params:Promise.resolve({id:"10"})}),/Redirect: \/admin\/reviews/);
  }
  assert.equal(changes[0].status,"APPROVED");
  assert.equal(changes[1].status,"REJECTED");
  assert.equal(harness.expirations.length,3);
  assert.ok(harness.expirations.every(entry=>entry.tag==="stayvo-approved-reviews"&&entry.expire===0));
});

test("failed and stalled public queries are not cached and can recover", async () => {
  const harness = publicCacheHarness();
  const mod = await load("lib/publicCache.js", {"next/cache":harness.api});
  let reads = 0;
  const query = mod.cachePublicQuery(async()=>{
    reads++;
    if (reads===1) throw new Error("Offline");
    return "Recovered";
  }, "recovery-test", "test", 25);
  await assert.rejects(query, /Offline/);
  assert.equal(await query(),"Recovered");
  assert.equal(await query(),"Recovered");
  assert.equal(reads,2);
  const stalled = mod.cachePublicQuery(()=>new Promise(()=>{}),"stall-test","test",25);
  const start = performance.now();
  await assert.rejects(stalled, /timed out/);
  assert.ok(performance.now()-start<500);
});

test("legacy travel packages stay outside the hotel storefront",async()=>{
  const mod=await load("lib/packages.js",{"@/lib/prisma":{default:{package:{findUnique:async()=>({category:"International",slug:"bali"})}}}});
  assert.equal(await mod.getPackageBySlug("bali"),null);
});

test("room package parsing accepts local images, optional itinerary and saved gallery URLs",async()=>{
  const {parsePackageForm}=await load("lib/packageFormData.js");
  const parsed=await parsePackageForm(packageForm({itinerary:"Arrival | Check in from 12 PM\nExplore Kochi | Waterfront walk"}));
  assert.equal(parsed.data.category,"Stay Packages");
  assert.equal(parsed.data.price,3500);
  assert.equal(parsed.gallery.length,2);
  assert.equal(parsed.itineraries[1].title,"Explore Kochi");
  assert.equal(parsed.itineraries[1].day,2);
});

test("room package parsing rejects travel categories, invalid prices and malformed galleries",async()=>{
  const {parsePackageForm}=await load("lib/packageFormData.js");
  await assert.rejects(()=>parsePackageForm(packageForm({category:"International"})),/hotel room/);
  await assert.rejects(()=>parsePackageForm(packageForm({price:"-1"})),/non-negative/);
  await assert.rejects(()=>parsePackageForm(packageForm({days:"1.5"})),/valid days/);
  await assert.rejects(()=>parsePackageForm(packageForm({galleryUrls:'{"bad":true}'})),/Gallery images/);
  await assert.rejects(()=>parsePackageForm(packageForm({imageUrl:"javascript:alert(1)"})),/valid main image/);
});

test("editing replaces the complete gallery and supports removing all photos",async()=>{
  let saved;
  const mod=await load("app/api/admin/packages/[id]/route.js",{
    "@/lib/prisma":{default:{package:{update:async input=>{saved=input;return {id:3};}}}},
    "@/lib/auth":{getAdminSession:async()=>({id:1})}
  });
  const res=await mod.PUT({formData:async()=>packageForm()},{params:Promise.resolve({id:"3"})});
  assert.equal(res.status,200);
  assert.equal(saved.data.images.create.length,2);
  assert.equal(Object.keys(saved.data.images.deleteMany).length,0);
  await mod.PUT({formData:async()=>packageForm({galleryUrls:"[]"})},{params:Promise.resolve({id:"3"})});
  assert.equal(saved.data.images.create.length,0);
  const noGallery=packageForm();noGallery.delete("galleryUrls");
  await mod.PUT({formData:async()=>noGallery},{params:Promise.resolve({id:"3"})});
  assert.equal(saved.data.images,undefined);
});

test("room initialization requires an admin session",async()=>{
  let writes=0;
  const mod=await load("app/api/admin/packages/templates/route.js",{
    "@/lib/prisma":{default:{$transaction:async()=>{writes++;}}},
    "@/lib/auth":{getAdminSession:async()=>null}
  });
  assert.equal((await mod.POST()).status,401);
  assert.equal(writes,0);
});

test("room initialization is repeatable and preserves existing room edits",async()=>{
  const rows=new Map([["double-room-ac",{title:"Edited Double Room"}]]);
  const prisma={package:{upsert:async input=>{
    assert.equal(Object.keys(input.update).length,0);
    if(!rows.has(input.where.slug)) rows.set(input.where.slug,input.create);
  }},$transaction:async operations=>Promise.all(operations)};
  const mod=await load("app/api/admin/packages/templates/route.js",{
    "@/lib/prisma":{default:prisma},"@/lib/auth":{getAdminSession:async()=>({id:1})}
  });
  assert.equal((await mod.POST()).status,200);
  assert.equal((await mod.POST()).status,200);
  assert.equal(rows.size,8);
  assert.equal(rows.get("double-room-ac").title,"Edited Double Room");
});

test("dashboard combines hotel statistics and builds a complete 14-day chart", async () => {
  const prisma = {
    package: { groupBy: async () => [
      {category:"Double Rooms", active:true, featured:true, _count:{_all:2}},
      {category:"Family Suites", active:false, featured:false, _count:{_all:1}},
    ] },
    enquiry: { count: async options => options ? 1 : 2, findMany: async () => [{createdAt:new Date(2026,9,9,12)}] },
    siteVisitor: { aggregate: async () => ({_count:{_all:5},_sum:{visitCount:8}}) },
  };
  const mod = await load("lib/dashboard.js", {"@/lib/prisma":{default:prisma}});
  const result = await mod.getDashboardData({now:new Date(2026,9,9,13)});
  assert.equal(result.available,true);
  assert.equal(result.stats.total,3);
  assert.equal(result.stats.active,2);
  assert.equal(result.stats.featured,2);
  assert.equal(result.stats.destinations,2);
  assert.equal(result.stats.visitors,5);
  assert.equal(result.stats.visits,8);
  assert.equal(result.chartData.length,14);
  assert.equal(result.chartData[13].enquiries,1);
});

test("a stalled database cannot leave the dashboard loading indefinitely", async () => {
  const stall = () => new Promise(() => {});
  const prisma = { package:{groupBy:stall},enquiry:{count:stall,findMany:stall},siteVisitor:{aggregate:stall} };
  const mod = await load("lib/dashboard.js", {"@/lib/prisma":{default:prisma}});
  const start = performance.now();
  const result = await mod.getDashboardData({timeoutMs:25});
  assert.equal(result.available,false);
  assert.ok(performance.now()-start<500);
});

test("hotel review queries exclude feedback from the previous travel site", async () => {
  let filters;
  const mod = await load("lib/reviews.js", {"@/lib/prisma":{default:{review:{findMany:async query=>{filters=query.where;return [];}}}}});
  const reviews = await mod.getApprovedHotelReviews();
  assert.equal(filters.createdAt.gte.toISOString(),"2026-10-08T18:30:00.000Z");
  assert.equal(filters.status,"APPROVED");
  assert.equal(filters.featured,undefined);
  assert.equal(reviews.length,0);
});

test("all approved Stayvo reviews appear without requiring featured status", async () => {
  const rows = [
    {id:10, status:"APPROVED", featured:false, createdAt:new Date("2026-10-09T10:00:00Z")},
    {id:11, status:"APPROVED", featured:true, createdAt:new Date("2026-10-09T11:00:00Z")},
    {id:12, status:"APPROVED", featured:false, createdAt:new Date("2026-10-09T12:00:00Z")},
    {id:13, status:"APPROVED", featured:false, createdAt:new Date("2026-10-09T13:00:00Z")},
    {id:14, status:"PENDING", featured:true, createdAt:new Date("2026-10-09T14:00:00Z")},
    {id:15, status:"REJECTED", featured:false, createdAt:new Date("2026-10-09T15:00:00Z")},
    {id:16, status:"APPROVED", featured:true, createdAt:new Date("2026-09-01T10:00:00Z")},
  ];
  const mod = await load("lib/reviews.js", {"@/lib/prisma":{default:{review:{findMany:async query=>{
    const matches = rows.filter(row => row.status===query.where.status && row.createdAt>=query.where.createdAt.gte && (query.where.featured===undefined || row.featured===query.where.featured));
    assert.equal(query.orderBy.createdAt,"desc");
    matches.sort((a,b)=>b.createdAt-a.createdAt);
    return query.take ? matches.slice(0,query.take) : matches;
  }}}}});
  const reviews = await mod.getApprovedHotelReviews();
  assert.deepEqual(Array.from(reviews,review=>review.id),[13,12,11,10]);
});

test("unavailable review data never creates sample guest feedback", async () => {
  const mod = await load("lib/reviews.js", {"@/lib/prisma":{default:{review:{findMany:async()=>{throw new Error("Database unavailable");}}}}});
  assert.equal((await mod.getApprovedHotelReviews()).length,0);
});
