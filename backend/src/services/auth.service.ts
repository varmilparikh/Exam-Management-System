import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";

interface RegisterUserData {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async (
  data: RegisterUserData
): Promise<void> => {
  console.log(data);
};