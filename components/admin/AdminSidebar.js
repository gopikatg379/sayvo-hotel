import Link from "next/link";
import {
  LayoutDashboard,
  PackageOpen,
  MessageSquareText,
  LogOut,
  Hotel,
  Star,
} from "lucide-react";

export default function AdminSidebar() {
  return (
    <aside className="border-r border-slate-200 bg-[#151614] p-5 text-white lg:min-h-screen">
      
      {/* Logo */}
      <Link
        href="/admin/dashboard"
        className="flex items-center gap-3 px-2 text-xl font-black"
      >
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#8a621b]">
          <Hotel size={20} />
        </span>

        Stayvo Kochi Admin
      </Link>

      {/* Navigation */}
      <nav className="mt-10 grid gap-2">
        {[
          [LayoutDashboard, "Dashboard", "/admin/dashboard"],
          [PackageOpen, "Rooms & packages", "/admin/packages"],
          [MessageSquareText, "Enquiries", "/admin/enquiries"],
          [Star, "Reviews", "/admin/reviews"],
        ].map(([Icon, title, href]) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <Icon size={18} />
            {title}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <form
        action="/api/admin/logout"
        method="post"
        className="mt-10"
      >
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white">
          <LogOut size={18} />
          Logout
        </button>
      </form>
    </aside>
  );
}