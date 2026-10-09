require("dotenv").config({ quiet: true });
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { syncAdminCredentials } = require("../lib/adminCredentials.cjs");

const prisma = new PrismaClient();

async function main() {
  const account = await syncAdminCredentials(prisma, process.env);
  const saved = await prisma.admin.findUnique({
    where: { id: account.id },
    select: { password: true },
  });
  if (!saved || !(await bcrypt.compare(process.env.ADMIN_SEED_PASSWORD, saved.password))) {
    throw new Error("Admin password verification failed.");
  }
  console.log("Admin credentials synced and verified using your .env settings.");
}

main().catch(error => {
  const message = error.name.startsWith("Prisma")
    ? "Could not sync admin credentials. Check DATABASE_URL and database connectivity."
    : error.message;
  console.error(message);
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());
