import Link from "next/link";
import { getDashboardData } from "@/lib/dashboard";

import {
  PackageOpen,
  Star,
  MapPinned,
  MessageSquareText,
  CircleCheckBig,
  Users,
  Eye,
  ArrowUpRight,
  Plus,
  CalendarDays,
  TrendingUp,
  Inbox,
  Hotel,
} from "lucide-react";

import { getAdminSession } from "@/lib/auth";
import EnquiryChart from "@/components/admin/EnquiryChart";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const session = await getAdminSession();

  const { stats, chartData, available } = await getDashboardData();

  const cards = [
    {
      icon: PackageOpen,
      title: "Total Packages",
      value: stats.total,
      description:
        "Packages created",
    },

    {
      icon: CircleCheckBig,
      title: "Active Packages",
      value: stats.active,
      description:
        "Currently published",
    },

    {
      icon: MessageSquareText,
      title: "Enquiries",
      value: stats.enquiries,
      description: `${stats.todayEnquiries} received today`,
    },

    {
      icon: Users,
      title: "Visitors",
      value: stats.visitors,
      description:
        "Unique website visitors",
    },

    {
      icon: Eye,
      title: "Total Visits",
      value: stats.visits,
      description:
        "Website visits",
    },
  ];

  return (
    <div className="pb-12">
      {!available && <p role="alert" className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Hotel statistics could not be loaded. You can still manage packages, enquiries and reviews using the menu. Reload to retry.</p>}
      {/* ================= HEADER ================= */}

      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Welcome back,{" "}
            <span className="font-bold text-[#20211f]">
              {session?.name ||
                "Admin"}
            </span>
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#20211f] md:text-4xl">
            Stayvo Kochi Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Track your packages,
            enquiries and website
            activity.
          </p>
        </div>

       <Link
  href="/admin/packages/add"
  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#20211f] px-5 py-3 text-sm font-bold !text-white transition hover:bg-[#34352f] hover:!text-white"
>
  <Plus size={18} className="text-white" />
  <span className="text-white">Add Package</span>
</Link>
      </div>

      {/* ================= MAIN CARDS ================= */}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map(
          ({
            icon: Icon,
            title,
            value,
            description,
          }) => (
            <div
              key={title}
              className="group rounded-[24px] border border-slate-100 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(32,33,31,.08)]"
            >
              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#f5f0e7] text-[#20211f]">
                  <Icon size={21} />
                </span>

                <ArrowUpRight
                  size={17}
                  className="text-slate-300 transition group-hover:text-[#c89a40]"
                />
              </div>

              <div className="mt-6 text-3xl font-black tracking-tight text-[#20211f]">
                {available ? value.toLocaleString() : "—"}
              </div>

              <div className="mt-1 text-sm font-bold text-slate-700">
                {title}
              </div>

              <p className="mt-1 text-xs text-slate-400">
                {description}
              </p>
            </div>
          )
        )}
      </div>

      {/* ================= GRAPH AREA ================= */}

      <div className="mt-7 grid gap-6 xl:grid-cols-[1.7fr_.7fr]">
        {/* ENQUIRY GRAPH */}

        <div className="rounded-[28px] border border-slate-100 bg-white p-6 md:p-8">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#c89a40]">
                <TrendingUp size={15} />

                Enquiry performance
              </div>

              <h2 className="mt-2 text-2xl font-black text-[#20211f]">
                Enquiries over time
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Customer enquiries received
                during the last 14 days.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-xl bg-[#f8f4e9] px-4 py-2 text-xs font-bold text-[#20211f]">
              <CalendarDays
                size={15}
              />

              Last 14 days
            </div>
          </div>

          <EnquiryChart
            data={chartData}
          />
        </div>

        {/* ENQUIRY SUMMARY */}

        <div className="overflow-hidden rounded-[28px] bg-[#20211f] p-7 text-white">
          <div className="relative">
            <div className="absolute -right-16 -top-20 h-44 w-44 rounded-full border border-white/10" />

            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10">
              <Inbox size={21} />
            </span>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-[#e5c27e]">
              Enquiry Summary
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Customer interest
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/60">
              See how many customers are
              reaching out to Stayvo Kochi.
            </p>

            <div className="mt-7 grid gap-3">
              <div className="rounded-2xl bg-white/[0.07] p-5">
                <div className="text-3xl font-black">
                  {
                    available ? stats.todayEnquiries : "—"
                  }
                </div>

                <p className="mt-1 text-sm text-white/60">
                  Enquiries today
                </p>
              </div>

              <div className="rounded-2xl bg-white/[0.07] p-5">
                <div className="text-3xl font-black">
                  {
                    available ? stats.monthEnquiries : "—"
                  }
                </div>

                <p className="mt-1 text-sm text-white/60">
                  This month
                </p>
              </div>

              <div className="rounded-2xl bg-white/[0.07] p-5">
                <div className="text-3xl font-black">
                  {available ? stats.enquiries : "—"}
                </div>

                <p className="mt-1 text-sm text-white/60">
                  Total enquiries
                </p>
              </div>
            </div>

            <Link
              href="/admin/enquiries"
              className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#e5c27e]"
            >
              View enquiries

              <ArrowUpRight
                size={16}
              />
            </Link>
          </div>
        </div>
      </div>

      {/* ================= WEBSITE PERFORMANCE ================= */}

      <div className="mt-7 grid gap-6 lg:grid-cols-3">
        {/* VISITORS */}

        <div className="rounded-[26px] border border-slate-100 bg-white p-7">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#f5f0e7] text-[#20211f]">
            <Users size={21} />
          </span>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
            Website audience
          </p>

          <div className="mt-2 text-4xl font-black text-[#20211f]">
            {available ? stats.visitors.toLocaleString() : "—"}
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Unique visitors
          </p>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Total visits
              </span>

              <span className="font-bold text-[#20211f]">
                {available ? stats.visits.toLocaleString() : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* DESTINATIONS */}

        <div className="rounded-[26px] border border-slate-100 bg-white p-7">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#faf4e8] text-[#b98434]">
            <MapPinned size={21} />
          </span>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
            Room & package variety
          </p>

          <div className="mt-2 text-4xl font-black text-[#20211f]">
            {available ? stats.destinations : "—"}
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Hotel categories available
          </p>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Featured packages
              </span>

              <span className="font-bold text-[#20211f]">
                {available ? stats.featured : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* TIP */}

        <div className="relative overflow-hidden rounded-[26px] bg-[#f8f4e9] p-7">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full border border-[#c89a40]/20" />

          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#20211f] text-white">
            <Hotel size={21} />
          </span>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-[#b98434]">
            Stayvo Kochi tip
          </p>

          <h3 className="mt-2 text-xl font-black text-[#20211f]">
            Keep your storefront fresh.
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Add seasonal packages,
            refresh your pricing and
            feature your strongest
            stays to welcome more
            guests.
          </p>

          <Link
            href="/admin/packages"
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#20211f]"
          >
            Manage packages

            <ArrowUpRight
              size={16}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}