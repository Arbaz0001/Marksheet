import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// root route (browser open karne par message ayega)
app.get("/", (req, res) => {
  res.send("🚀 Report Card Backend API is running");
});

// health check
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    message: "Server is running",
  });
});

// routes
app.use("/api/report-cards", reportRoutes);

// start server
const startServer = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
      throw new Error("❌ MONGO_URI missing in environment variables");
    }

    await mongoose.connect(MONGO_URI);

    console.log("✅ MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
