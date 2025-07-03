import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is missing in environment variables");
  throw new Error("Please provide valid MongoDB URI");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  try {
    if (cached.conn) {
      console.log("Using existing MongoDB connection");
      return cached.conn;
    }

    console.log("Creating new MongoDB connection...");

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
        dbName: "Skoolify"
      };

      cached.promise = mongoose.connect(MONGODB_URI, opts)
        .then(mongoose => {
          console.log("MongoDB connected successfully");
          return mongoose;
        })
        .catch(err => {
          console.error("MongoDB connection error:", err.message);
          throw err;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("Database connection failed:", error.message);
    throw error;
  }
}

export default dbConnect;