import WebsiteShell from "./WebsiteShell";

export default function PageLoading() {
  return <WebsiteShell trackVisits={false}>
    <section className="hotel-page-header" role="status" aria-live="polite" aria-busy="true">
      <div className="container-site">
        <p className="hotel-eyebrow !text-[#e8c986]">Stayvo Kochi</p>
        <p className="font-serif text-3xl text-white sm:text-4xl">A warm welcome awaits.</p>
        <p className="mt-4 text-sm text-white/65">Getting your page ready…</p>
      </div>
    </section>
    <section className="section-pad" aria-hidden="true">
      <div className="container-site grid gap-6 motion-safe:animate-pulse md:grid-cols-3">
        {[1, 2, 3].map(item => <div key={item} className="rounded-2xl border border-[#e9e1d2] bg-white p-5">
          <div className="h-48 rounded-xl bg-[#ece5d8]" />
          <div className="mt-6 h-5 w-3/4 rounded-full bg-[#ece5d8]" />
          <div className="mt-4 h-3 rounded-full bg-[#f5f0e7]" />
          <div className="mt-3 h-3 w-2/3 rounded-full bg-[#f5f0e7]" />
        </div>)}
      </div>
    </section>
  </WebsiteShell>;
}
