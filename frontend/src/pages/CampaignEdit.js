import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { apiUrl } from "../config/api";

export default function CampaignEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("token");
  const [form, setForm] = useState({
    title: "",
    description: "",
    goalAmount: "",
    deadline: "",
    images: [],
    status: "active",
  });

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await axios.get(apiUrl(`/api/campaigns/${id}`), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const campaign = res.data;
        setForm({
          title: campaign.title,
          description: campaign.description,
          goalAmount: campaign.goalAmount,
          deadline: campaign.deadline.split("T")[0],
          images: campaign.images || [],
          status: campaign.status,
        });
      } catch (err) {
        console.error("Error fetching campaign:", err);
        alert("Failed to load campaign");
        navigate("/dashboard/org");
      } finally {
        setLoading(false);
      }
    };

    if (id && token) fetchCampaign();
  }, [id, token, navigate]);

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

    setSaving(true);
    try {
      await axios.put(
        apiUrl(`/api/campaigns/${id}`),
        {
          title: form.title,
          description: form.description,
          goalAmount: parseInt(form.goalAmount),
          deadline: new Date(form.deadline).toISOString(),
          images: form.images,
          status: form.status,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Campaign updated successfully!");
      navigate("/dashboard/org");
    } catch (err) {
      console.error("Error updating campaign:", err);
      alert(err.response?.data?.message || "Failed to update campaign");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;

    setSaving(true);
    try {
      await axios.delete(apiUrl(`/api/campaigns/${id}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Campaign deleted successfully!");
      navigate("/dashboard/org");
    } catch (err) {
      console.error("Error deleting campaign:", err);
      alert(err.response?.data?.message || "Failed to delete campaign");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-700 font-semibold">Loading campaign…</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-slate-800 p-8 shadow-xl border border-slate-700"
          >
            <h1 className="text-4xl font-bold mb-2">Edit Campaign</h1>
            <p className="text-slate-400 mb-8">Update your campaign details.</p>

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

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-2xl bg-slate-700 border border-slate-600 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
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
                  disabled={saving}
                  className="flex-1 rounded-2xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : "💾 Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={saving}
                  className="flex-1 rounded-2xl bg-red-600 px-6 py-3 font-semibold hover:bg-red-700 transition disabled:opacity-50"
                >
                  🗑️ Delete
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
