import prisma from "../prisma.js";

const departments = [
  { name: "Computer Engineering" },
  { name: "Information Technology" },
  { name: "Artificial Intelligence" },
  { name: "Electronics & Communication" },
  { name: "Mechanical Engineering" },
  { name: "Civil Engineering" },
];

export async function seedDepartments() {
  console.log("📚 Seeding Departments...");

  for (const department of departments) {
    await prisma.department.upsert({
      where: {
        name: department.name,
      },
      update: {},
      create: department,
    });
  }

  console.log(`✅ ${departments.length} departments seeded.`);
}