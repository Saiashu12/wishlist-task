import { PrismaClient } from "@prisma/client";

if (process.env.NODE_ENV !== "production") {
  if (!global.prismaGlobal) {
    global.prismaGlobal = new PrismaClient();
  }
}

import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  const mongoURI = process.env.MONGODB_URL || "mongodb://localhost:27017/freeShippingApp";
  
  try {
    await mongoose.connect(mongoURI);
    isConnected = true;
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}


const prisma = global.prismaGlobal ?? new PrismaClient();

export default prisma;
