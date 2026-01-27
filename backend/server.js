import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";

// Database imports
import { connectDB } from "./model/db.js";
import Item from "./model/schema.model.js";
import Borrow from "./model/BorrowSchema.js";
import Return from "./model/ReturnSchema.js";

/* ---------- CONFIG ---------- */
dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------- MIDDLEWARE ---------- */
app.use(express.json());

// Optimized CORS
const allowedOrigins = [
  "https://spatialcomputinglab.vercel.app",
  "http://localhost:5173"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.options("*", cors());

/* ---------- FIREBASE ADMIN ---------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin Initialized ✅");
} catch (error) {
  console.error("Firebase Auth Error ❌:", error.message);
}

/* ---------- ROUTES ---------- */

app.get("/", (req, res) => {
  res.status(200).json({ status: "Backend running 🚀", timestamp: new Date() });
});

/* ---------- ITEMS ---------- */
app.get("/items", async (req, res) => {
  try {
    const items = await Item.find().sort({ name: 1 });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

/* ---------- BORROW ---------- */
app.post("/borrow", async (req, res) => {
  const { name, registrationNumber, COMPONENTS, QUANTITY } = req.body;

  if (!name || !registrationNumber || !COMPONENTS || !QUANTITY) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // 1. Check if item exists and has enough stock
    const item = await Item.findOne({ name: COMPONENTS });
    
    if (!item) {
      return res.status(404).json({ message: "Component not found in inventory" });
    }

    if (item.QUANTITY < QUANTITY) {
      return res.status(400).json({ message: `Insufficient stock. Only ${item.QUANTITY} left.` });
    }

    // 2. Create Borrow Record
    await Borrow.create({ name, registrationNumber, COMPONENTS, QUANTITY });

    // 3. Update Inventory (Decrease count)
    item.QUANTITY -= QUANTITY;
    await item.save();

    res.status(201).json({ message: "Borrow successful", remainingStock: item.QUANTITY });
  } catch (err) {
    console.error("Borrow error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/* ---------- RETURN ---------- */
app.post("/return", async (req, res) => {
  const { name, registrationNumber, component, quantity } = req.body;

  if (!name || !registrationNumber || !component || !quantity) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // 1. Create Return Record
    await Return.create({
      name,
      registrationNumber,
      componentName: component,
      quantity: Number(quantity),
    });

    // 2. Update Inventory (Increase count)
    const item = await Item.findOne({ name: component });
    if (item) {
      item.QUANTITY += Number(quantity);
      await item.save();
    }

    res.status(201).json({ message: "Return processed successfully" });
  } catch (err) {
    console.error("Return error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/* ---------- SERVER ---------- */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});