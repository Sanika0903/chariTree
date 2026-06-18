const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const organizationRoutes = require("./routes/organizationRoutes");
const donationRoutes = require("./routes/donationRoutes");
const donationTrackingRoutes = require("./routes/donationTrackingRoutes");
const authRoutes = require("./routes/authRoutes");
const userAuthRoutes = require("./routes/userAuthRoutes"); // ✅ NEW
const volunteerRoutes = require("./routes/volunteerRoutes");
const campaignRoutes = require("./routes/campaignRoutes"); // ✅ NEW

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes); // organization auth
app.use("/api/user", userAuthRoutes); // ✅ donor & volunteer auth
app.use("/api/organizations", organizationRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/donations", donationTrackingRoutes);
app.use("/api/campaigns", campaignRoutes); // ✅ NEW

// DB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

app.get("/", (req, res) => res.send("🌱 ChariTree Backend Running Successfully"));

const PORT = process.env.PORT || 5000;
app.listen(PORT,"0.0.0.0", () => console.log(`Server running on port ${PORT}`));  
