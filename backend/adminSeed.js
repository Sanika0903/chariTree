const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("❌ MONGO_URI not found in env");
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected for admin seeding");

    const existingAdmin = await User.findOne({ email: "admin@charitree.org" });
    if (existingAdmin) {
      console.log("ℹ️ Admin user already exists");
    } else {
      const admin = new User({
        name: "System Admin",
        email: "admin@charitree.org",
        password: "admin123",
        phone: "1234567890",
        role: "admin",
      });
      await admin.save();
      console.log("🌱 Admin user successfully created!");
    }

    mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
