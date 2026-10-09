export default function DashboardLoading() {
  return <div role="status" aria-live="polite">
    <h1 className="text-3xl font-black text-[#20211f]">Stayvo Kochi Dashboard</h1>
    <p className="mt-3 text-sm text-slate-500">Loading your hotel statistics…</p>
    <div aria-hidden="true" className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">{[1,2,3,4,5].map(item => <div key={item} className="h-44 rounded-3xl border border-[#e9e1d2] bg-white p-6"><div className="h-10 w-10 rounded-2xl bg-[#f5f0e7]" /><div className="mt-6 h-6 w-16 rounded bg-[#f5f0e7]" /><div className="mt-3 h-3 w-24 rounded bg-[#f5f0e7]" /></div>)}</div>
  </div>;
}
