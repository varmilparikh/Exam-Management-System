import { PrismaClient } from "../src/generated/prisma/client.js";
const prisma = new PrismaClient();
async function main() {
    console.log("🌱 Starting database seed...");
}
main()
    .then(async () => {
    console.log("✅ Database seed completed.");
    await prisma.$disconnect();
})
    .catch(async (error) => {
    console.error("❌ Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map