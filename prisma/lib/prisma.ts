//import { PrismaClient } from "@prisma/client";

const { PrismaClient } = require("./../../node_modules/.prisma/client");

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      datasources: {
        db: {
          provider: "postgresql",
          url: process.env.DATABASE_URL,
          max: 100,
        },
      },
    });
  }
  prisma = global.prisma;
}

export default prisma;
