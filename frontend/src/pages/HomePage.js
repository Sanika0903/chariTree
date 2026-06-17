import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function HomePage() {
  const navigate = useNavigate();

  const featured = [
    { id: 1, title: "Winter Clothes Drive", org: "Care & Share", goal: 50000, raised: 32000 },
    { id: 2, title: "School Supplies for Kids", org: "BrightFutures", goal: 30000, raised: 21000 },
    { id: 3, title: "Community Health Camp", org: "HealthNow", goal: 40000, raised: 35000 },
  ];

  const categories = ["Education", "Healthcare", "Food", "Animal Welfare", "Elderly Care", "Environment"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white text-gray-800">
      {/* Hero */}
      <header className="bg-gradient-to-r from-sky-200 via-white to-sky-200 py-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-1 text-center lg:text-left">
            <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-extrabold text-blue-700 leading-tight mb-4">
              Grow kindness. Multiply impact.
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-700 text-lg max-w-2xl mb-6">
              Connect with verified organizations, support causes you care about, and track your donation impact — all in one place.
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-4 sm:justify-start justify-center">
              <button onClick={() => navigate("/donate")} className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition font-semibold">Donate Now</button>
              <button onClick={() => navigate("/campaigns")} className="px-6 py-3 bg-white border border-blue-200 text-blue-700 rounded-xl hover:shadow-lg transition">Explore Campaigns</button>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={() => navigate('/donor-login')} className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-white hover:shadow-md">💙 Donor Login</button>
                <button onClick={() => navigate('/org-login')} className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-white hover:shadow-md">🏢 Organization Login</button>
                <button onClick={() => navigate('/volunteer-login')} className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-white hover:shadow-md">🤝 Volunteer</button>
                <button onClick={() => navigate('/donor-signup')} className="p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-white hover:shadow-md">✨ Become a Donor</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Impact statistics */}
        <section className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <div className="text-sm text-gray-500">Total Donations</div>
            <div className="text-3xl font-bold text-blue-700">₹12,45,000</div>
            <div className="text-sm text-gray-500">across 1,234 contributions</div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <div className="text-sm text-gray-500">Organizations</div>
            <div className="text-3xl font-bold text-blue-700">342</div>
            <div className="text-sm text-gray-500">verified causes</div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <div className="text-sm text-gray-500">Volunteers</div>
            <div className="text-3xl font-bold text-blue-700">4,890</div>
            <div className="text-sm text-gray-500">active community members</div>
          </div>
        </section>

        {/* Featured campaigns */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Featured Campaigns</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((c) => {
              const pct = Math.min(100, Math.round((c.raised / c.goal) * 100));
              return (
                <div key={c.id} className="bg-white rounded-2xl shadow p-6">
                  <div className="font-semibold text-lg text-blue-700">{c.title}</div>
                  <div className="text-sm text-gray-500 mb-3">{c.org}</div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                    <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div>Raised: ₹{c.raised}</div>
                    <div>{pct}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Causes by Category</h2>
          <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <div key={cat} className="bg-white rounded-xl shadow p-4 flex flex-col items-center text-center hover:shadow-lg transition">
                <div className="bg-blue-50 text-blue-600 rounded-full p-3 mb-3">🌿</div>
                <div className="font-medium">{cat}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Success stories / Testimonials */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="font-semibold text-blue-700">A Warm Winter</div>
              <p className="text-gray-600 mt-2">Thanks to donors, 500+ families received warm clothes and blankets last season.</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="font-semibold text-blue-700">Better Classrooms</div>
              <p className="text-gray-600 mt-2">School supplies distributed to 1,200 students across rural areas.</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="font-semibold text-blue-700">Community Health</div>
              <p className="text-gray-600 mt-2">Medical camps provided free checkups and medicines to 2,000+ people.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-12 bg-gradient-to-r from-blue-50 to-white rounded-2xl p-8 shadow-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-blue-700">Ready to make an impact?</h3>
              <p className="text-gray-600">Explore causes, donate, or volunteer — every action helps.</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => navigate('/donate')} className="px-6 py-3 bg-blue-600 text-white rounded-xl">Donate</button>
              <button onClick={() => navigate('/volunteer-login')} className="px-6 py-3 bg-white border border-blue-200 text-blue-700 rounded-xl">Volunteer</button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
