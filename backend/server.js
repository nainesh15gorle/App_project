import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connectDB } from "./model/db.js";
import Item from "./model/schema.model.js";
import Borrow from "./model/BorrowSchema.js";
import Return from "./model/ReturnSchema.js";
import admin from "firebase-admin";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin:["https://srm-eyantralab.vercel.app","http://localhost:5173"],
  methods:["GET","POST","PUT","DELETE"],
  credentials:true,
}));
app.use(bodyParser.json());


// ✅ Initialize Firebase Admin (backend SDK)
import fs from "fs";

const serviceAccount = JSON.parse(
  fs.readFileSync(new URL("./serviceAccountKey.json", import.meta.url))
);


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// ✅ Route to fetch all items from MongoDB
app.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    console.error("[GET /items] Error fetching items:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Route to handle borrowing components
// This will:
// 1. Validate the request body.
// 2. Check if the requested component exists and has enough quantity.
// 3. Decrease the quantity in the Item (test collection).
// 4. Create a Borrow document with a timestamp.
app.post("/borrow", async (req, res) => {
  try {
    const { name, registrationNumber, componentId, quantity } = req.body;

    // Basic validation for incoming data
    if (!name || !registrationNumber || !componentId || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than zero" });
    }

    // Find the component in the inventory
    const item = await Item.findById(componentId);
    if (!item) {
      return res.status(404).json({ message: "Component not found" });
    }

    // Check if there is enough quantity to borrow
    if (item.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient quantity available" });
    }

    // Decrease the quantity and save the updated inventory
    item.quantity -= quantity;
    await item.save();

    // Create a borrow record with timestamp
    const borrowRecord = await Borrow.create({
      name,
      registrationNumber,
      component: item._id,
      componentName: item.name || item.material_name || "Unknown Component",
      quantity,
      borrowedAt: new Date(),
    });

    return res.status(201).json({
      message: "Borrow recorded successfully",
      borrow: borrowRecord,
      updatedItem: item,
    });
  } catch (error) {
    console.error("[POST /borrow] Error handling borrow request:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Route to handle returning components
// This will:
// 1. Validate the request body.
// 2. Check if the requested component exists.
// 3. Increase the quantity in the Item (test collection).
// 4. Create a Return document with a timestamp.
app.post("/return", async (req, res) => {
  try {
    const { name, registrationNumber, componentId, quantity } = req.body;

    // Basic validation for incoming data
    if (!name || !registrationNumber || !componentId || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than zero" });
    }

    // Find the component in the inventory
    const item = await Item.findById(componentId);
    if (!item) {
      return res.status(404).json({ message: "Component not found" });
    }

    // Increase the quantity and save the updated inventory
    item.quantity += quantity;
    await item.save();

    // Create a return record with timestamp
    const returnRecord = await Return.create({
      name,
      registrationNumber,
      component: item._id,
      componentName: item.name || item.material_name || "Unknown Component",
      quantity,
      returnedAt: new Date(),
    });

    return res.status(201).json({
      message: "Return recorded successfully",
      return: returnRecord,
      updatedItem: item,
    });
  } catch (error) {
    console.error("[POST /return] Error handling return request:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// ✅ Route to verify Firebase ID token from frontend
app.post("/session", async (req, res) => {
  const idToken = req.body.idToken;

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const email = decoded.email || "";

    // Only allow SRM emails
    if (!email.toLowerCase().endsWith("@srmist.edu.in")) {
      return res.status(403).json({ error: "Forbidden domain" });
    }

    res.json({ ok: true, email });
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
