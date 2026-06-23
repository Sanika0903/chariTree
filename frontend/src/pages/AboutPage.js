import React from "react";
import { motion } from "framer-motion";

export default function AboutPage() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-gray-800">
      {/* About Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto text-center py-20 px-6"
      >
        <h2 className="text-4xl font-extrabold text-blue-700 mb-4">
          About ChariTree 🌱
        </h2>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          ChariTree is a platform designed to connect donors, volunteers, and
          organizations to work together toward creating a positive social impact.
          Our mission is to simplify giving — whether through monetary support,
          fulfilling wishlists, or volunteering time.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {[
            { icon: "💰", title: "Transparent Donations", desc: "Track how every contribution makes a difference." },
            { icon: "🤝", title: "Trusted Organizations", desc: "Partnering with verified NGOs for real impact." },
            { icon: "🌍", title: "Global Community", desc: "Join changemakers from across the world." },
          ].map((feature, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg">
              <div className="text-4xl">{feature.icon}</div>
              <h3 className="font-bold text-blue-700 text-lg mt-3">{feature.title}</h3>
              <p className="text-gray-600 mt-2">{feature.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
