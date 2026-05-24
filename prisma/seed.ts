import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.resolve(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` } as any);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log("🌱 Seeding database...");

  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD ?? "idm@admin2025",
    12
  );

  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL ?? "admin@idmacademy.com" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL ?? "admin@idmacademy.com",
      password: hashedPassword,
      name: "Admin IDM",
      role: "ADMIN",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    },
  });

  console.log("✅ Admin user ready — add your courses via the admin UI");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
