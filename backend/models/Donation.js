const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  donorName: { type: String, required: true },
  donorEmail: { type: String, required: true },
  donorPhone: { type: String, default: "" },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
  organizationName: { type: String, required: true },
  type: { type: String, enum: ["monetary", "item", "split"], required: true },
  amount: {
    type: Number,
    required: function () {
      return this.type === "monetary" || this.type === "split";
    },
  },
  item: {
    type: String,
    required: function () {
      return this.type === "item";
    },
  },
  quantity: {
    type: Number,
    required: function () {
      return this.type === "item";
    },
  },
  deliveryMethod: { type: String, enum: ["pickup", "dropoff"] },
  orderId: { type: String },
  paymentId: { type: String },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
  campaignName: { type: String },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "received", "purchased", "distributed", "verified", "Received", "Purchased", "Distributed", "Verified"],
    default: "Received",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Donation", donationSchema);
