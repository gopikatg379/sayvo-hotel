import prisma from "@/lib/prisma";
import { hotelCategories } from "@/lib/data";

export async function getDashboardData({ timeoutMs = 8000, now = new Date() } = {}) {
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const chartStart = new Date(todayStart);
  chartStart.setDate(chartStart.getDate() - 13);
  const defaults = { total: 0, active: 0, featured: 0, destinations: 0, enquiries: 0, visitors: 0, visits: 0, todayEnquiries: 0, monthEnquiries: 0 };
  let timer;
  try {
    const result = await Promise.race([
      Promise.all([
        prisma.package.groupBy({ by: ["category", "active", "featured"], where: { category: { in: hotelCategories } }, _count: { _all: true } }),
        prisma.enquiry.count(),
        prisma.enquiry.count({ where: { createdAt: { gte: todayStart } } }),
        prisma.enquiry.count({ where: { createdAt: { gte: monthStart } } }),
        prisma.siteVisitor.aggregate({ _count: { _all: true }, _sum: { visitCount: true } }),
        prisma.enquiry.findMany({ where: { createdAt: { gte: chartStart } }, select: { createdAt: true }, orderBy: { createdAt: "asc" } }),
      ]),
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("Dashboard statistics timed out.")), timeoutMs); }),
    ]);
    const [groups, enquiries, todayEnquiries, monthEnquiries, visitors, recent] = result;
    const stats = { ...defaults, enquiries, todayEnquiries, monthEnquiries, visitors: visitors._count._all, visits: visitors._sum.visitCount || 0 };
    const categories = new Set();
    for (const group of groups) {
      stats.total += group._count._all;
      if (group.active) stats.active += group._count._all;
      if (group.featured) stats.featured += group._count._all;
      categories.add(group.category);
    }
    stats.destinations = categories.size;
    const dateKey = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
    const days = new Map();
    for (let i = 0; i < 14; i++) {
      const date = new Date(chartStart);
      date.setDate(date.getDate() + i);
      days.set(dateKey(date), { date: date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }), enquiries: 0 });
    }
    for (const row of recent) {
      const day = days.get(dateKey(new Date(row.createdAt)));
      if (day) day.enquiries++;
    }
    return { stats, chartData: [...days.values()], available: true };
  } catch {
    return { stats: defaults, chartData: [], available: false };
  } finally { clearTimeout(timer); }
}
