import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { apiUrl } from "../config/api";

export default function OrganizationWishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [newItem, setNewItem] = useState({ item: "", quantity: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        const res = await axios.get(apiUrl("/api/organizations/dashboard/me"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(res.data.wishlist || []);
      } catch (err) {
        console.error("Error fetching org data:", err);
        alert("Failed to load wishlist");
        navigate("/dashboard/org");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrg();
  }, [token, navigate]);

  const handleAddItem = () => {
    if (!newItem.item || !newItem.quantity) {
      return alert("Please enter both item name and quantity");
    }
    setWishlist([...wishlist, { item: newItem.item, quantity: parseInt(newItem.quantity) }]);
    setNewItem({ item: "", quantity: "" });
  };

  const handleRemoveItem = (index) => {
    setWishlist(wishlist.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(
        apiUrl("/api/organizations/wishlist"),
        { wishlist },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Wishlist saved successfully!");
      navigate("/dashboard/org");
    } catch (err) {
      console.error("Error saving wishlist:", err);
      alert("Failed to save wishlist");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-700 font-semibold">Loading wishlist…</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-gradient-to-r from-yellow-600 to-yellow-700 p-8 shadow-xl"
          >
            <h1 className="text-4xl font-bold">🛍️ Wishlist Management</h1>
            <p className="mt-3 text-yellow-100">Manage items your organization needs donations for.</p>
          </motion.div>

          {/* Current Wishlist */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl bg-slate-800 p-8 shadow-xl border border-slate-700"
          >
            <h2 className="text-2xl font-bold mb-6">Current Wishlist Items ({wishlist.length})</h2>

            {wishlist.length > 0 ? (
              <div className="space-y-4">
                {wishlist.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between bg-slate-700 rounded-2xl p-6 border border-slate-600 hover:border-yellow-500 transition"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-lg">{item.item}</p>
                      <p className="text-slate-400 text-sm">Quantity needed: {item.quantity}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(i)}
                      className="ml-4 px-4 py-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold transition"
                    >
                      ✕ Remove
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <p className="text-lg">No wishlist items yet</p>
                <p className="text-sm">Add items below to get started</p>
              </div>
            )}
          </motion.div>

          {/* Add New Item */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl bg-slate-800 p-8 shadow-xl border border-slate-700"
          >
            <h2 className="text-2xl font-bold mb-6">➕ Add New Item</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Item Name *</label>
                <input
                  type="text"
                  value={newItem.item}
                  onChange={(e) => setNewItem({ ...newItem, item: e.target.value })}
                  placeholder="e.g., Medical Supplies, Food Packages"
                  className="w-full rounded-2xl bg-slate-700 border border-slate-600 px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Quantity Needed *</label>
                <input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  placeholder="e.g., 100"
                  className="w-full rounded-2xl bg-slate-700 border border-slate-600 px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleAddItem}
                className="w-full rounded-2xl bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 font-semibold transition"
              >
                ➕ Add Item
              </button>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4"
          >
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 rounded-2xl bg-green-600 hover:bg-green-700 text-white px-6 py-4 font-bold text-lg transition disabled:opacity-50"
            >
              {saving ? "Saving…" : "💾 Save Wishlist"}
            </button>
            <button
              onClick={() => navigate("/dashboard/org")}
              className="flex-1 rounded-2xl bg-slate-700 hover:bg-slate-600 text-white px-6 py-4 font-bold text-lg transition"
            >
              ← Back to Dashboard
            </button>
          </motion.div>
        </div>
      </div>
    </>
  );
}
