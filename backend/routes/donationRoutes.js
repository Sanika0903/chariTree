const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation");
const Organization = require("../models/Organization");

// ✅ Monetary Donation
router.post("/monetary", async (req, res) => {
  try {
    console.log("📩 Monetary donation received:", req.body);

    const { orgId, donorName, donorEmail, donorPhone, amount, campaignId, campaignName } = req.body;

    if (!orgId || !amount) {
      return res.status(400).json({ message: "Missing orgId or amount" });
    }

    const org = await Organization.findById(orgId);
    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Create Donation record
    const donation = await Donation.create({
      donorName: donorName || "Anonymous",
      donorEmail: donorEmail || "unknown@example.com",
      donorPhone: donorPhone || "",
      organizationId: orgId,
      organizationName: org.name,
      type: "monetary",
      amount,
      campaignId,
      campaignName,
      status: "completed",
    });

    // Push into organization's donations
    org.donations.push({
      donorName: donorName || "Anonymous",
      donorEmail,
      donorPhone,
      amount,
      type: "monetary",
      status: "completed",
      donationRef: donation._id,
      impact: "Monetary Support",
      date: new Date(),
    });

    // ✅ Skip unrelated field validation
    await org.save({ validateBeforeSave: false });

    // Update Campaign raisedAmount if associated
    if (campaignId) {
      const Campaign = require("../models/Campaign");
      const campaign = await Campaign.findById(campaignId);
      if (campaign) {
        campaign.raisedAmount = (campaign.raisedAmount || 0) + Number(amount);
        await campaign.save();
        console.log(`✅ Campaign ${campaignId} raisedAmount updated to: ${campaign.raisedAmount}`);
      }
    }

    console.log("✅ Monetary donation saved:", donation._id);
    res.status(200).json({ message: "Monetary donation logged successfully", donation });
  } catch (error) {
    console.error("❌ Monetary donation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get all donations by donor (donation tracking)
router.get("/donor/:email", async (req, res) => {
  try {
    const donorEmail = req.params.email;
    console.log("[Donation Tracking] Requested donorEmail:", donorEmail);
    if (!donorEmail) {
      return res.status(400).json({ message: "Missing donor email" });
    }
    const donations = await Donation.find({ donorEmail }).sort({ createdAt: -1 });
    console.log("[Donation Tracking] Found donations:", donations);
    res.status(200).json({ donations });
  } catch (error) {
    console.error("[Donation Tracking] Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get donations by email alias for legacy frontend paths
router.get("/by-email/:email", async (req, res) => {
  try {
    const donorEmail = req.params.email;
    if (!donorEmail) {
      return res.status(400).json({ message: "Missing donor email" });
    }
    const donations = await Donation.find({ donorEmail }).sort({ createdAt: -1 });
    res.status(200).json({ donations });
  } catch (error) {
    console.error("[Donation Tracking Alias] Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get donor summary data
router.get("/donor/:email/summary", async (req, res) => {
  try {
    const donorEmail = req.params.email;
    if (!donorEmail) {
      return res.status(400).json({ message: "Missing donor email" });
    }

    const donations = await Donation.find({ donorEmail }).sort({ createdAt: -1 });
    const totalCount = donations.length;
    const totalDonated = donations
      .filter((donation) => donation.type === "monetary" || donation.type === "split")
      .reduce((sum, donation) => sum + (Number(donation.amount) || 0), 0);
    const wishlistCount = donations.filter((donation) => donation.type === "item" || donation.type === "wishlist").length;

    const recentDonations = donations.slice(0, 5).map((donation) => ({
      id: donation._id,
      organizationName: donation.organizationName,
      type: donation.type,
      amount: donation.amount,
      item: donation.item,
      quantity: donation.quantity,
      status: donation.status,
      createdAt: donation.createdAt,
    }));

    res.status(200).json({
      summary: {
        totalDonated,
        totalCount,
        wishlistCount,
      },
      recentDonations,
    });
  } catch (error) {
    console.error("[Donation Summary] Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get donor notifications from donation tracking updates
router.get("/donor/:email/notifications", async (req, res) => {
  try {
    const donorEmail = req.params.email;
    if (!donorEmail) {
      return res.status(400).json({ message: "Missing donor email" });
    }

    const donations = await Donation.find({ donorEmail }).select("_id organizationName");
    const donationIds = donations.map((donation) => donation._id);

    if (donationIds.length === 0) {
      return res.status(200).json({ notifications: [] });
    }

    const DonationTracking = require("../models/DonationTracking");
    const notifications = await DonationTracking.find({ donationId: { $in: donationIds } })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      notifications: notifications.map((entry) => ({
        id: entry._id,
        donationId: entry.donationId,
        organizationName: entry.organizationName,
        title: entry.title,
        description: entry.description,
        status: entry.status,
        createdAt: entry.createdAt,
      })),
    });
  } catch (error) {
    console.error("[Donation Notifications] Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Wishlist Donation
router.post("/wishlist", async (req, res) => {
  try {
    console.log("📦 Wishlist donation received:", req.body);

    const { orgId, name, email, phone, item, quantity, method, campaignId, campaignName } = req.body;

    if (!orgId || !item || !quantity) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const org = await Organization.findById(orgId);
    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Create donation record
    const donation = await Donation.create({
      donorName: name || "Anonymous",
      donorEmail: email || "unknown@example.com",
      donorPhone: phone || "",
      organizationId: orgId,
      organizationName: org.name,
      type: "item",
      item,
      quantity,
      deliveryMethod: method,
      campaignId,
      campaignName,
      status: "completed",
    });

    // Add to organization donations
    org.donations.push({
      donorName: name || "Anonymous",
      donorEmail: email,
      donorPhone: phone,
      type: "wishlist",
      item,
      quantity,
      method,
      status: "completed",
      donationRef: donation._id,
      impact: `${quantity} x ${item} (${method})`,
      date: new Date(),
    });

    // ✅ Skip validation for unrelated required fields
    await org.save({ validateBeforeSave: false });

    console.log("✅ Wishlist donation saved:", donation._id);
    res.status(200).json({ message: "Wishlist donation logged successfully", donation });
  } catch (error) {
    console.error("❌ Wishlist donation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Split Donation (each logged individually)
router.post("/split", async (req, res) => {
  try {
    console.log("💰 Split donation received:", req.body);

    const { orgId, donorName, donorEmail, amount } = req.body;

    if (!orgId || !amount) {
      return res.status(400).json({ message: "Missing orgId or amount" });
    }

    const org = await Organization.findById(orgId);
    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Create donation record
    const donation = await Donation.create({
      donorName: donorName || "Anonymous",
      donorEmail: donorEmail || "unknown@example.com",
      organizationId: orgId,
      organizationName: org.name,
      type: "split",
      amount,
      status: "completed", // ✅ lowercase & valid
    });

    // Push into organization's donations (include amount)
    org.donations.push({
      donorName: donorName || "Anonymous",
      donorEmail: donorEmail || "unknown@example.com",
      type: "split",
      amount,
      status: "completed",
      donationRef: donation._id,
      impact: `Split donation of ₹${amount}`,
      date: new Date(),
    });

    // ✅ Add an update entry so validation passes
    org.updates.push({
      title: "Split Donation Received",
      content: `A new split donation of ₹${amount} was received from ${donorName || "Anonymous"}.`,
    });

    await org.save();

    console.log(`✅ Split donation logged successfully: ₹${amount}`);
    res.status(200).json({ message: "Split donation logged successfully", donation });
  } catch (error) {
    console.error("❌ Split donation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



module.exports = router;
