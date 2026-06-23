import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function DonorLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800">
      {/* 💙 Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto text-center py-20 px-6"
      >
        <h2 className="text-4xl font-extrabold text-blue-700 mb-4">
          Welcome Back, Generous Soul 💙
        </h2>
        <p className="text-gray-600 text-lg mb-8">
          Your contributions make real change. Continue spreading kindness through impactful donations and community support.
        </p>

        <button
          onClick={() => navigate("/donate")}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition"
        >
          Donate Now 💰
        </button>
      </motion.section>

      {/* 🌍 Community Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-blue-50 py-16 px-6 text-center"
      >
        <h3 className="text-3xl font-bold text-blue-700 mb-4">
          Join Our Donor Community 🤝
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Connect with other donors, track your impact, and see how your help changes lives.
        </p>
        <button
          onClick={() => navigate("/community")}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Explore Community
        </button>
      </motion.section>
    </div>
  );
}
