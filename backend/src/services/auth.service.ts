import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  // Check existing user
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return user;
};

// Login user
export const loginUser = async (email: string, password: string) => {

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // If email doesn't exist
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare entered password with hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  // If password is incorrect
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id },                  // Payload
    process.env.JWT_SECRET as string,     // Secret key
    { expiresIn: "1d" }                   // Token valid for 1 day
  );

  // Remove password before sending user data
const { password: _, ...userWithoutPassword } = user;

  // Return token and user details
  return { token, user };
};