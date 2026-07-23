import bcrypt from "bcryptjs";
import prisma from "../prisma.js";
import { LoginProvider } from "../../src/generated/prisma/enums.js";

import { employees } from "./data/employees.data.js";

export async function seedEmployees() {
  console.log("👨‍🏫 Seeding Employees...");

  const hashedPassword = await bcrypt.hash("Password@123", 10);

  for (const employee of employees) {
    const department = await prisma.department.findUnique({
      where: {
        name: employee.department,
      },
    });

    if (!department) {
      throw new Error(`Department '${employee.department}' not found.`);
    }

    await prisma.employee.upsert({
      where: {
        email: employee.email,
      },

      update: {},

      create: {
        employeeCode: employee.employeeCode,
        name: employee.name,
        email: employee.email,

        password: hashedPassword,

        designation: employee.designation,

        role: employee.role,

        loginProvider: LoginProvider.LOCAL,

        departmentId: department.id,
      },
    });
  }

  console.log(`✅ ${employees.length} employees seeded.`);
}
