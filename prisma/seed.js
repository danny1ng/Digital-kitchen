import { Prisma, PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

const password = "123123123";

async function main() {
  const hashedPassword = await argon2.hash(password);

  const userData = [
    {
      email: "admin@admin.io",
      password: hashedPassword,
    },
  ];
  console.log("🚀 ~ main ~ userData:", userData)

  console.log("Start seeding ...");
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });

    console.log(`Created user with id: ${user.id}`);
  }
  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
