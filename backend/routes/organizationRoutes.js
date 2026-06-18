const express = require("express");
const router = express.Router();
const Organization = require("../models/Organization");
const { authMiddleware, authorizeRoles } = require("../middleware/auth");

// Get all organizations (public)
router.get("/", async (req, res) => {
  try {
    const { category, location, search } = req.query;
    let filter = {};

    if (category && category !== "All") filter.category = category;
    if (location && location !== "All") filter.location = location;

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { name: regex },
        { category: regex },
        { location: regex },
      ];
    }

    const orgs = await Organization.find(filter).select("-password");
    res.json(orgs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update wishlist (protected)
router.put("/wishlist", authMiddleware, authorizeRoles("organization"), async (req, res) => {
  try {
    if (req.user.role !== "organization")
      return res.status(403).json({ message: "Access denied" });

    const { wishlist } = req.body;
    const org = await Organization.findByIdAndUpdate(
      req.user.id,
      { wishlist },
      { new: true }
    ).select("-password");

    res.json(org);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 💝 Log Wishlist Donation (public)
router.post("/wishlist", async (req, res) => {
  try {
    const { orgId, item, name, email, phone, quantity, method } = req.body;

    const org = await Organization.findById(orgId);
    if (!org) return res.status(404).json({ message: "Organization not found" });

    org.donations.push({
      donorName: name,
      donorEmail: email,
      donorPhone: phone,
      type: "wishlist",
      item,
      quantity,
      method,
      date: new Date(),
      status: "Received",
    });

    await org.save();

    console.log(`✅ Wishlist donation logged for ${org.name}`);
    res.status(200).json({ message: "Wishlist donation saved successfully" });
  } catch (error) {
    console.error("Wishlist donation error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 💰 Log Monetary Donation (public)
router.post("/monetary", async (req, res) => {
  try {
    const { orgId, amount } = req.body;
    const org = await Organization.findById(orgId);
    if (!org) return res.status(404).json({ message: "Organization not found" });

    org.donations.push({
      type: "monetary",
      amount,
      status: "Received",
      date: new Date(),
    });

    await org.save();

    console.log(`💰 Monetary donation logged for ${org.name}`);
    res.status(200).json({ message: "Monetary donation saved successfully" });
  } catch (error) {
    console.error("Monetary donation error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ⚖️ Log Split Donation (public)
router.post("/split", async (req, res) => {
  try {
    const { orgId, amount } = req.body;
    const org = await Organization.findById(orgId);
    if (!org) return res.status(404).json({ message: "Organization not found" });

    org.donations.push({
      type: "split",
      amount,
      status: "Received",
      date: new Date(),
    });

    await org.save();

    console.log(`⚖️ Split donation logged for ${org.name}`);
    res.status(200).json({ message: "Split donation saved successfully" });
  } catch (error) {
    console.error("Split donation error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get organization dashboard (protected)
router.get("/dashboard/me", authMiddleware, authorizeRoles("organization"), async (req, res) => {
  try {
    if (req.user.role !== "organization")
      return res.status(403).json({ message: "Access denied" });

    const org = await Organization.findById(req.user.id).select("-password");
    if (!org) return res.status(404).json({ message: "Organization not found" });

    res.json(org);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Add update/post (protected)
router.post("/updates", authMiddleware, authorizeRoles("organization"), async (req, res) => {
  try {
    if (req.user.role !== "organization")
      return res.status(403).json({ message: "Access denied" });

    const { title, content } = req.body;
    const org = await Organization.findById(req.user.id);
    org.updates.unshift({ title, content, date: new Date() });
    await org.save();

    res.json(org.updates);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete update (protected)
router.delete("/updates/:updateId", authMiddleware, authorizeRoles("organization"), async (req, res) => {
  try {
    if (req.user.role !== "organization")
      return res.status(403).json({ message: "Access denied" });

    const org = await Organization.findById(req.user.id);
    org.updates = org.updates.filter(
      (update) => update._id.toString() !== req.params.updateId
    );
    await org.save();

    res.json(org.updates);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Must be last
router.get("/:id", async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id).select("-password");
    if (!org) return res.status(404).json({ message: "Organization not found" });
    res.json(org);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
