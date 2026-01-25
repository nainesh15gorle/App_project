import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs";
import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./model/db.js";
import Item from "./model/schema.model.js";
import Borrow from "./model/BorrowSchema.js";
import Return from "./model/ReturnSchema.js";

/* ---------- CONFIG ---------- */
dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------- MIDDLEWARE (ORDER MATTERS) ---------- */

// JSON parser
app.use(express.json());

// CORS – production-safe
app.use(
  cors({
    origin: "https://spatialcomputinglab.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Handle preflight requests
app.options("*", cors());

/* ---------- FIREBASE ADMIN ---------- */

// Fix for ES modules path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.join(
  __dirname,
  "serviceAccountKey.json"
);

const serviceAccount = JSON.parse(
  fs.readFileSync(serviceAccountPath, "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

/* ---------- ROUTES ---------- */

// Health check (VERY IMPORTANT for Render)
app.get("/", (req, res) => {
  res.status(200).json({ status: "Backend running" });
});

/* ---------- ITEMS ---------- */
app.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (err) {
    console.error("Fetch items error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ---------- BORROW ---------- */
app.post("/borrow", async (req, res) => {
  const { name, registrationNumber, COMPONENTS, QUANTITY } = req.body;

  if (!name || !registrationNumber || !COMPONENTS || QUANTITY == null) {
    return res.status(400).json({ message: "Missing fields" });
  }

  if (isNaN(QUANTITY) || QUANTITY <= 0) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  try {
    await Borrow.create({
      name,
      registrationNumber,
      COMPONENTS,
      QUANTITY,
    });

    res.status(201).json({ message: "Borrow successful" });
  } catch (err) {
    console.error("Borrow error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ---------- RETURN ---------- */
app.post("/return", async (req, res) => {
  const { name, registrationNumber, component, quantity } = req.body;

  if (!name || !registrationNumber || !component || quantity == null) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (isNaN(quantity) || quantity <= 0) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  try {
    await Return.create({
      name,
      registrationNumber,
      componentName: component,
      quantity,
    });

    res.status(201).json({ message: "Return successful" });
  } catch (err) {
    console.error("Return error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ---------- SERVER ---------- */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
