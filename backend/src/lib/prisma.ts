import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;

// Instead of creating

// new PrismaClient()

// inside every file,

// we create one instance and reuse it.

// Cleaner.

// Faster.

// Professional.