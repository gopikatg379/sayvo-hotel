"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BedDouble } from "lucide-react";
export default function LoadRoomTemplates() {
  const [loading,setLoading]=useState(false), [error,setError]=useState("");
  const router=useRouter();
  async function load() {
    setLoading(true);setError("");
    try {
      const res=await fetch("/api/admin/packages/templates",{method:"POST"});
      const data=await res.json();
      if(!res.ok) throw new Error(data.message || "Could not load room templates.");
      router.refresh();
    } catch(error) {setError(error.message);} finally {setLoading(false);}
  }
  return <div><button type="button" onClick={load} disabled={loading} className="button-gold"><BedDouble size={16} />{loading ? "Loading rooms…" : "Load Stayvo room templates"}</button>{error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}</div>;
}
