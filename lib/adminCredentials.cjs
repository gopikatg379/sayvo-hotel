const bcrypt = require("bcryptjs");

async function syncAdminCredentials(prisma, env) {
  const email = String(env.ADMIN_SEED_EMAIL || "").trim().toLowerCase();
  const plainPassword = String(env.ADMIN_SEED_PASSWORD || "");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Set a valid ADMIN_SEED_EMAIL in .env.");
  }
  if (!plainPassword) {
    throw new Error("Set ADMIN_SEED_PASSWORD in .env.");
  }

  const password = await bcrypt.hash(plainPassword, 12);
  return prisma.admin.upsert({
    where: { email },
    update: { password },
    create: { name: "Stayvo Kochi Admin", email, password },
    select: { id: true, email: true },
  });
}

module.exports = { syncAdminCredentials };
