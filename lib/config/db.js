import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export const ConnectDB = async () => {
  if (!MONGODB_URI) {
    console.error("❌ MongoDB URI is missing in .env.local");
    throw new Error("MongoDB URI is required");
  }

  if (mongoose.connection.readyState >= 1) {
    console.log("✅ Already connected to MongoDB");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "blog-app", // Explicitly define the database
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
    });

    console.log("🚀 Database connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw new Error("Database connection failed");
  }
};
