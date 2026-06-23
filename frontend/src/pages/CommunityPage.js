import React from "react";
import { motion } from "framer-motion";

export default function CommunityPage() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white text-gray-800">
      {/* 💙 Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-10"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-700">
          Welcome to the ChariTree Community! 🌍
        </h1>
        <p className="text-gray-600 mt-3">
          Join, engage, and make a difference with like-minded individuals.
        </p>
      </motion.header>

      {/* 💪 Community Campaigns */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6">
          Community Challenges & Campaigns
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Feed the Future", desc: "100 Meals Drive", progress: "80/100" },
            { title: "Warm Hearts", desc: "500 Blankets for Winter", progress: "250/500" },
            { title: "Education for All", desc: "200 School Kits", progress: "85/200" },
          ].map((campaign, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-2xl shadow-md text-center border-t-4 border-indigo-400"
            >
              <h3 className="font-bold text-lg text-indigo-700">{campaign.title}</h3>
              <p className="text-gray-600">{campaign.desc}</p>
              <div className="mt-3 w-full bg-gray-200 h-3 rounded-full">
                <div
                  className="bg-indigo-600 h-3 rounded-full"
                  style={{
                    width: `${(parseInt(campaign.progress.split("/")[0]) /
                      parseInt(campaign.progress.split("/")[1])) *
                      100}%`,
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{campaign.progress}</p>
              <button className="mt-4 text-indigo-600 font-semibold hover:underline">
                Join Now
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🏆 Community Features */}
      <section className="max-w-6xl mx-auto px-6 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        <div className="bg-indigo-100 p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="font-bold text-indigo-700 mb-2">🏅 Community Leaderboards</h3>
          <button className="text-indigo-600 font-semibold hover:underline">
            View More
          </button>
        </div>

        <div className="bg-purple-100 p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="font-bold text-purple-700 mb-2">💬 Community Forums</h3>
          <button className="text-purple-600 font-semibold hover:underline">
            Join Discussions
          </button>
        </div>

        <div className="bg-blue-100 p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="font-bold text-blue-700 mb-2">📢 Job Opportunities</h3>
          <button className="text-blue-600 font-semibold hover:underline">
            View More
          </button>
        </div>

        <div className="bg-orange-100 p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="font-bold text-orange-700 mb-2">📅 Upcoming Events</h3>
          <button className="text-orange-600 font-semibold hover:underline">
            Register Now
          </button>
        </div>
      </section>

      {/* 🗓 Upcoming Events */}
      <section className="bg-indigo-50 py-10 text-center">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6">Upcoming Events</h2>
        <div className="flex flex-col md:flex-row justify-center gap-6 px-6">
          {[
            { title: "Step for a Cause – Charity Walkathon" },
            { title: "Books for Brighter Futures – Literacy Drive" },
          ].map((event, index) => (
            <div
              key={index}
              className="bg-white px-6 py-4 rounded-lg shadow-md w-full md:w-1/3"
            >
              <h4 className="font-semibold text-gray-700">{event.title}</h4>
              <button className="mt-2 text-indigo-600 font-semibold hover:underline">
                Register Now
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
