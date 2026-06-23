const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Organization = require("../models/Organization");

// Organization Signup
router.post("/org/signup", async (req, res) => {
  try {
    const { name, email, password, category, location } = req.body;

    const existingOrg = await Organization.findOne({ email });
    if (existingOrg) {
      return res.status(400).json({ message: "Organization already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newOrg = new Organization({
      name,
      email,
      password: hashedPassword,
      category,
      location,
      wishlist: [],
      updates: [],
    });

    await newOrg.save();

    const token = jwt.sign({ id: newOrg._id, role: "organization", type: "organization" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      organization: {
        id: newOrg._id,
        name: newOrg.name,
        email: newOrg.email,
        category: newOrg.category,
        location: newOrg.location,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Organization Login
router.post("/org/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const org = await Organization.findOne({ email });
    if (!org) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, org.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: org._id, role: org.role || 'organization', type: "organization" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      organization: {
        id: org._id,
        name: org.name,
        email: org.email,
        role: org.role || 'organization',
        category: org.category,
        location: org.location,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;