import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { apiUrl } from "../config/api";
import OrgNavbar from "../components/OrgNavbar";

export default function CampaignCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [form, setForm] = useState({
    title: "",
    description: "",
    goalAmount: "",
    deadline: "",
    images: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, reader.result],
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.goalAmount || !form.deadline) {
      return alert("Please fill in all required fields");
    }

    setLoading(true);
    try {
      await axios.post(
        apiUrl("/api/campaigns"),
        {
          title: form.title,
          description: form.description,
          goalAmount: parseInt(form.goalAmount),
          deadline: new Date(form.deadline).toISOString(),
          images: form.images,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Campaign created successfully!");
      navigate("/dashboard/org");
    } catch (err) {
      console.error("Error creating campaign:", err);
      alert(err.response?.data?.message || "Failed to create campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <OrgNavbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-slate-800 p-8 shadow-xl border border-slate-700"
          >
            <h1 className="text-4xl font-bold mb-2">Create Campaign</h1>
            <p className="text-slate-400 mb-8">
              Launch a new campaign to reach your fundraising goals.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g., Emergency Medical Aid"
                  className="w-full rounded-2xl bg-slate-700 border border-slate-600 px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Tell donors what this campaign is about..."
                  rows="5"
                  className="w-full rounded-2xl bg-slate-700 border border-slate-600 px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                ></textarea>
              </div>

              {/* Goal Amount */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Goal Amount (₹) *
                </label>
                <input
                  type="number"
                  name="goalAmount"
                  value={form.goalAmount}
                  onChange={handleChange}
                  placeholder="e.g., 50000"
                  className="w-full rounded-2xl bg-slate-700 border border-slate-600 px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Deadline *
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  className="w-full rounded-2xl bg-slate-700 border border-slate-600 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Campaign Images
                </label>
                <div className="border-2 border-dashed border-slate-600 rounded-2xl p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer text-blue-400 hover:text-blue-300"
                  >
                    📷 Click to upload or drag and drop
                  </label>
                </div>

                {/* Image Preview */}
                {form.images.length > 0 && (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative rounded-2xl overflow-hidden">
                        <img
                          src={img}
                          alt="Preview"
                          className="w-full h-40 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm hover:bg-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-2xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? "Creating..." : "✅ Create Campaign"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/org")}
                  className="flex-1 rounded-2xl bg-slate-700 px-6 py-3 font-semibold hover:bg-slate-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
}
