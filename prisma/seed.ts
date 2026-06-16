import { prisma } from "../src/lib/prisma";

const defaultCategories = [
  { name: "Salaire", type: "INCOME" as const, budget: null },
  { name: "Loyer", type: "EXPENSE" as const, budget: 800 },
  { name: "Courses", type: "EXPENSE" as const, budget: 300 },
  { name: "Transport", type: "EXPENSE" as const, budget: 100 },
];

async function main() {
  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: { name_type: { name: category.name, type: category.type } },
      update: {},
      create: category,
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
