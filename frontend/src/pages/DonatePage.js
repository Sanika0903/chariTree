import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { apiUrl } from "../config/api";

export default function DonatePage() {
  const [activeCard, setActiveCard] = useState("money");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterLocation, setFilterLocation] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [organizationData, setOrganizationData] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);

  // Wishlist form states
  const [selectedWishlistItem, setSelectedWishlistItem] = useState("");
  const [wishlistForm, setWishlistForm] = useState({
    name: "",
    email: "",
    phone: "",
    quantity: "",
    method: "pickup",
  });

  // Monetary donation state
  const [monetaryAmount, setMonetaryAmount] = useState("");

  // Split donation states
  const [selectedSplitOrgs, setSelectedSplitOrgs] = useState([]);
  const [splitAmount, setSplitAmount] = useState("");

  const categories = [
    "All",
    "Elderly Care",
    "Child Welfare",
    "Education",
    "Healthcare",
    "Animal Welfare",
  ];

  const locations = [
    "All",
    "Pune",
    "Mumbai",
    "Delhi",
    "Chennai",
    "Bangalore",
    "Kolkata",
  ];

  // Fetch organizations
  const fetchOrganizations = useCallback(async () => {
    try {
      const res = await axios.get(apiUrl("/api/organizations"), {
        params: { category: filterCategory, location: filterLocation, search: searchTerm },
      });
      setOrganizationData(res.data);
    } catch (err) {
      console.error("Error fetching organizations:", err);
    }
  }, [filterCategory, filterLocation, searchTerm]);

  const location = useLocation();
  const donateOrgId = new URLSearchParams(location.search).get("donateOrg");

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  useEffect(() => {
    if (!donateOrgId || organizationData.length === 0) return;
    const org = organizationData.find((item) => item._id === donateOrgId);
    if (org) {
      setSelectedOrg(org);
      setIsModalOpen(true);
    }
  }, [donateOrgId, organizationData]);

  // --- Wishlist donation ---
  const handleWishlistSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(apiUrl("/api/donations/wishlist"), {
        orgId: selectedOrg._id,
        name: wishlistForm.name,
        email: wishlistForm.email,
        phone: wishlistForm.phone,
        item: selectedWishlistItem,
        quantity: wishlistForm.quantity,
        method: wishlistForm.method,
      });


      alert(
        `🎁 Thank you, ${wishlistForm.name}!\nYour donation of "${selectedWishlistItem}" to ${selectedOrg.name} has been logged.`
      );

      setWishlistForm({ name: "", email: "", phone: "", quantity: "", method: "pickup" });
      setSelectedWishlistItem("");
      setIsModalOpen(false);
      fetchOrganizations(); // refresh updated wishlist instantly
    } catch (err) {
      console.error(err);
      alert("Failed to log wishlist donation.");
    }
  };

 // --- Monetary donation ---
const handleMonetarySubmit = async (e) => {
  e.preventDefault();

  if (!monetaryAmount || monetaryAmount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  try {
    const payload = {
      orgId: selectedOrg._id,
      donorName: "Anonymous Donor",
      donorEmail: "anonymous@example.com",
      donorPhone: "",
      amount: monetaryAmount,
    };

    console.log("🧾 Sending monetary donation:", payload);

    const res = await axios.post(apiUrl("/api/donations/monetary"), payload);

    if (res.status === 200) {
      // Show temporary fake payment processing screen
      const paymentWindow = window.open("", "_blank", "width=400,height=400");
      paymentWindow.document.write(`
        <html>
          <head>
            <title>Processing Payment</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background: linear-gradient(to bottom, #e0f2fe, #ffffff);
                color: #1e3a8a;
                text-align: center;
              }
              .loader {
                border: 6px solid #f3f3f3;
                border-top: 6px solid #2563eb;
                border-radius: 50%;
                width: 60px;
                height: 60px;
                animation: spin 1s linear infinite;
                margin-bottom: 20px;
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            </style>
          </head>
          <body>
            <div class="loader"></div>
            <h2>Processing your payment...</h2>
            <p>Please wait while we confirm your donation.</p>
          </body>
        </html>
      `);

      // Wait 3 seconds, close popup, and redirect
      setTimeout(() => {
        paymentWindow.close();
        window.location.href = `/payment?org=${selectedOrg.name}&amount=${monetaryAmount}`;
      }, 3000);
    } else {
      alert("Unexpected response from server. Please try again.");
    }
  } catch (err) {
    console.error("❌ Monetary donation request failed:", err.response?.data || err.message);
    alert("Failed to log monetary donation. Check server console for details.");
  }
};

  // --- Split donation ---
  const handleSplitSubmit = async () => {
    if (selectedSplitOrgs.length === 0) {
      alert("Please select at least one organization.");
      return;
    }
    if (!splitAmount || splitAmount <= 0) {
      alert("Please enter a valid total amount.");
      return;
    }

    try {
      const amountPerOrg = (splitAmount / selectedSplitOrgs.length).toFixed(2);

      await Promise.all(
        selectedSplitOrgs.map((org) =>
          axios.post(apiUrl("/api/donations/split"), {
            orgId: org._id,
            amount: amountPerOrg,
          })
        )
      );

      const summary = selectedSplitOrgs
        .map((org) => `• ${org.name} — ₹${amountPerOrg}`)
        .join("\n");

      alert(`⚖️ Split Donation Summary\n\nTotal: ₹${splitAmount}\nDistributed equally:\n${summary}`);

      setSelectedSplitOrgs([]);
      setSplitAmount("");
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to log split donation.");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-white text-gray-800 relative">
      {/* Header */}
      <header className="bg-gradient-to-r from-sky-200 via-white to-sky-200 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl font-extrabold text-blue-700"
          >
            Make an Impact
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-2 text-gray-700"
          >
            Choose from verified organizations and contribute securely.
          </motion.p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white p-6 rounded-2xl shadow-md mb-10"
        >
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Filter by Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
              >
                {categories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Filter by Location
              </label>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
              >
                {locations.map((loc) => (
                  <option key={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Search Organization
              </label>
              <input
                type="text"
                placeholder="Type organization name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
        </motion.div>

        {/* Donation Type Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {["money", "wishlist", "split"].map((card, index) => (
            <motion.div
              key={card}
              onClick={() => setActiveCard(card)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`cursor-pointer p-6 rounded-2xl shadow transition-all ${
                activeCard === card
                  ? "bg-blue-600 text-white"
                  : "bg-white hover:shadow-lg"
              }`}
            >
              <h2 className="text-2xl font-bold mb-2">
                {card === "money"
                  ? "💰 Monetary Donation"
                  : card === "wishlist"
                  ? "🎁 Wishlist Fulfillment"
                  : "⚖️ Split Donation"}
              </h2>
              <p>
                {card === "money"
                  ? "Support organizations with one-time or recurring donations."
                  : card === "wishlist"
                  ? "Donate specific items directly from verified NGO wishlists."
                  : "Contribute to multiple causes in a single donation."}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Organizations */}
        <h3 className="text-2xl font-semibold text-blue-700 mb-6 text-center">
          Organizations You Can Support
        </h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {organizationData.length > 0 ? (
              organizationData.map((org) => (
                <motion.article
                  key={org._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-3xl bg-blue-50 text-3xl font-bold text-blue-700 flex items-center justify-center">
                      {org.name?.charAt(0) || "O"}
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.25em] text-blue-600">{org.category}</p>
                      <h2 className="mt-2 text-xl font-semibold text-slate-900">{org.name}</h2>
                    </div>
                  </div>
                  <p className="mt-5 text-slate-600 line-clamp-3 min-h-[4.5rem]">{org.description || "A mission-driven organization working to create lasting local impact."}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{org.location}</span>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">Cause: {org.category}</span>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      to={`/organization/${org._id}`}
                      className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/organization/${org._id}?action=donate`}
                      className="rounded-2xl border border-blue-200 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition"
                    >
                      Donate
                    </Link>
                    <Link
                      to={`/volunteer-landing`}
                      className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
                    >
                      Volunteer
                    </Link>
                  </div>
                </motion.article>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-14 text-center text-slate-500 shadow-sm col-span-full">
                No organizations found.
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedOrg && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-lg w-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 className="text-2xl font-bold text-blue-700 mb-4">
                Donate to {selectedOrg.name}
              </h2>

              {/* Wishlist Donation Form */}
              {activeCard === "wishlist" && (
                <>
                  {!selectedWishlistItem ? (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">
                        Select an item to donate:
                      </h3>
                      <div className="flex flex-col gap-2">
                        {selectedOrg.wishlist?.map((item, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedWishlistItem(item.item)}
                            className="border rounded-lg py-2 px-3 hover:bg-blue-100 transition"
                          >
                            {item.item} — needed: {item.quantity}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleWishlistSubmit} className="flex flex-col gap-3">
                      <p className="font-semibold">Donating: {selectedWishlistItem}</p>
                      <input
                        type="text"
                        placeholder="Full Name"
                        required
                        value={wishlistForm.name}
                        onChange={(e) =>
                          setWishlistForm({ ...wishlistForm, name: e.target.value })
                        }
                        className="border px-4 py-2 rounded-lg"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        required
                        value={wishlistForm.email}
                        onChange={(e) =>
                          setWishlistForm({ ...wishlistForm, email: e.target.value })
                        }
                        className="border px-4 py-2 rounded-lg"
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        required
                        value={wishlistForm.phone}
                        onChange={(e) =>
                          setWishlistForm({ ...wishlistForm, phone: e.target.value })
                        }
                        className="border px-4 py-2 rounded-lg"
                      />
                      <input
                        type="number"
                        placeholder="Quantity"
                        required
                        value={wishlistForm.quantity}
                        onChange={(e) =>
                          setWishlistForm({
                            ...wishlistForm,
                            quantity: e.target.value,
                          })
                        }
                        className="border px-4 py-2 rounded-lg"
                      />
                      <select
                        value={wishlistForm.method}
                        onChange={(e) =>
                          setWishlistForm({
                            ...wishlistForm,
                            method: e.target.value,
                          })
                        }
                        className="border px-4 py-2 rounded-lg"
                      >
                        <option value="pickup">Pickup</option>
                        <option value="dropoff">Dropoff</option>
                      </select>
                      <button
                        type="submit"
                        className="bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
                      >
                        Confirm Donation
                      </button>
                    </form>
                  )}
                </>
              )}

              {/* Monetary Donation Form */}
              {activeCard === "money" && (
                <form onSubmit={handleMonetarySubmit} className="flex flex-col gap-3">
                  <label className="font-semibold text-gray-700">
                    Enter amount (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 500"
                    value={monetaryAmount}
                    onChange={(e) => setMonetaryAmount(e.target.value)}
                    className="border px-4 py-2 rounded-lg"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
                  >
                    Donate Now
                  </button>
                </form>
              )}

              {/* Split Donation Form */}
              {activeCard === "split" && (
                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-semibold text-blue-700">
                    ⚖️ Split Donation — Support Multiple Causes
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Select one or more organizations. Your donation will be split equally.
                  </p>

                  <div className="max-h-40 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                    {organizationData.map((org) => (
                      <label
                        key={org._id}
                        className="flex items-center gap-2 text-gray-700 mb-1"
                      >
                        <input
                          type="checkbox"
                          value={org._id}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSplitOrgs((prev) => [...prev, org]);
                            } else {
                              setSelectedSplitOrgs((prev) =>
                                prev.filter((o) => o._id !== org._id)
                              );
                            }
                          }}
                          className="w-4 h-4 accent-blue-600"
                        />
                        <span className="font-medium">{org.name}</span>
                      </label>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                      Total Donation Amount (₹)
                    </label>
                    <input
                      type="number"
                      min="100"
                      placeholder="Enter total amount"
                      value={splitAmount}
                      onChange={(e) => setSplitAmount(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
                    />
                  </div>

                  <button
                    onClick={handleSplitSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Confirm Split Donation
                  </button>
                </div>
              )}

              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 px-4 py-2 border border-blue-600 rounded-lg text-blue-600 w-full"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
