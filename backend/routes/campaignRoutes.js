const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");
const Organization = require("../models/Organization");
const { authMiddleware, authorizeRoles } = require("../middleware/auth");

// Get all campaigns
router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find({}).sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Admin Update/Moderate campaign
router.put("/:id/admin", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    const { status } = req.body;
    if (status) campaign.status = status;
    campaign.updatedAt = Date.now();

    await campaign.save();
    res.json({ message: "Campaign moderated successfully", campaign });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Admin Delete campaign
router.delete("/:id/admin", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    await Campaign.findByIdAndDelete(req.params.id);
    res.json({ message: "Campaign deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all campaigns for an organization (public)
router.get("/org/:orgId", async (req, res) => {
  try {
    const { orgId } = req.params;
    const campaigns = await Campaign.find({ organizationId: orgId }).sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single campaign (public)
router.get("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create campaign (organization only)
router.post("/", authMiddleware, authorizeRoles("organization"), async (req, res) => {
  try {
    const { title, description, goalAmount, deadline, images } = req.body;
    const org = await Organization.findById(req.user.id);

    if (!org) return res.status(404).json({ message: "Organization not found" });

    const campaign = await Campaign.create({
      organizationId: req.user.id,
      organizationName: org.name,
      title,
      description,
      goalAmount,
      deadline,
      images: images || [],
    });

    res.status(201).json({ message: "Campaign created successfully", campaign });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update campaign (organization only)
router.put("/:id", authMiddleware, authorizeRoles("organization"), async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    if (campaign.organizationId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "You can only edit your own campaigns" });
    }

    const { title, description, goalAmount, deadline, images, status } = req.body;
    campaign.title = title || campaign.title;
    campaign.description = description || campaign.description;
    campaign.goalAmount = goalAmount || campaign.goalAmount;
    campaign.deadline = deadline || campaign.deadline;
    if (images) campaign.images = images;
    if (status) campaign.status = status;
    campaign.updatedAt = Date.now();

    await campaign.save();
    res.json({ message: "Campaign updated successfully", campaign });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete campaign (organization only)
router.delete("/:id", authMiddleware, authorizeRoles("organization"), async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    if (campaign.organizationId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "You can only delete your own campaigns" });
    }

    await Campaign.findByIdAndDelete(req.params.id);
    res.json({ message: "Campaign deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get organization's campaigns (protected)
router.get("/org/:orgId/list", authMiddleware, authorizeRoles("organization"), async (req, res) => {
  try {
    const { orgId } = req.params;
    if (orgId !== req.user.id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const campaigns = await Campaign.find({ organizationId: orgId }).sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
