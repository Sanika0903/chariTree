const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["organization"], default: "organization" },
  verified: { type: Boolean, default: false },

  // 🎁 Wishlist section (for item donations)
  wishlist: [
    {
      item: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],

  // 💰 Donations tracking (wishlist, monetary, split)
  donations: [
    {
      donorName: { type: String },
      donorEmail: { type: String },
      donorPhone: { type: String },
      donorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      type: { type: String, enum: ["wishlist", "monetary", "split"], required: true },
      item: { type: String }, // only for wishlist donations
      quantity: { type: Number }, // only for wishlist donations
      amount: { type: Number }, // only for monetary/split
      method: { type: String }, // pickup/dropoff (wishlist)
      status: { type: String, default: "Pending" },
      impact: { type: String },
      date: { type: Date, default: Date.now },
    },
  ],

  // 📰 Updates section (for posts or announcements)
  updates: [
    {
      title: { type: String, required: true },
      content: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Organization", organizationSchema);
