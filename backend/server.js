import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connectDB } from "./model/db.js";
import Item from "./model/schema.model.js";
import admin from "firebase-admin";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin:"https://srm-eyantralab.vercel.app",
  methods:["GET","POST","PUT","DELETE"],
  credentials:true,
}));
app.use(bodyParser.json());
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

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
    res.status(500).json({ message: "Server Error", error });
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
