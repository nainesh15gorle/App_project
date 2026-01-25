import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs";
import admin from "firebase-admin";

import { connectDB } from "./model/db.js";
import Item from "./model/schema.model.js";
import Borrow from "./model/BorrowSchema.js";
import Return from "./model/ReturnSchema.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------- MIDDLEWARE ---------- */
app.use(express.json());

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

/* ---------- FIREBASE ADMIN ---------- */
const serviceAccount = JSON.parse(
  fs.readFileSync(new URL("./serviceAccountKey.json", import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

/* ---------- ROUTES ---------- */

// Health check
app.get("/", (req, res) => {
  res.send("Backend running");
});

// Get all inventory items
app.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});

/* ---------- BORROW ---------- */
app.post("/borrow", async (req, res) => {
  const { name, registrationNumber, COMPONENTS, QUANTITY } = req.body;

  try {
    if (!name || !registrationNumber || !COMPONENTS || QUANTITY == null) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (isNaN(QUANTITY) || QUANTITY <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    await Borrow.create({
      name,
      registrationNumber,
      COMPONENTS,
      QUANTITY,
    });

    res.json({ message: "Borrow successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

  
/* ---------- RETURN ---------- */
app.post("/return", async (req, res) => {
  const { name, registrationNumber, component, quantity } = req.body;

  if (!name || !registrationNumber || !component || !quantity) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (isNaN(quantity) || quantity <= 0) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  try {


    // Save return record
    await Return.create({
      name,
      registrationNumber,
      componentName: component,
      quantity,
    });

    res.json({ message: "Return successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
