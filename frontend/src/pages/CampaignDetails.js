import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { apiUrl } from "../config/api";

export default function CampaignDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await axios.get(apiUrl(`/api/campaigns/${id}`));
        setCampaign(res.data);

        // Fetch organization details
        const orgRes = await axios.get(apiUrl(`/api/organizations/${res.data.organizationId}`));
        setOrg(orgRes.data);
      } catch (err) {
        console.error("Error fetching campaign:", err);
        alert("Campaign not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCampaign();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-700 font-semibold">Loading campaign…</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-700 font-semibold">Campaign not found</p>
      </div>
    );
  }

  const progress = (campaign.raisedAmount / campaign.goalAmount) * 100;
  const daysLeft = Math.max(
    0,
    Math.floor((new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <button
              onClick={() => navigate(-1)}
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
            >
              ← Back
            </button>
            <h1 className="text-5xl font-bold text-slate-900">{campaign.title}</h1>
            <p className="text-xl text-slate-600">{campaign.description}</p>
            {org && (
              <p className="text-lg text-slate-700">
                By <span className="font-semibold text-blue-600">{org.name}</span>
              </p>
            )}
          </motion.div>

          {/* Main Content */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Images & Description */}
            <div className="lg:col-span-2 space-y-8">
              {/* Images */}
              {campaign.images && campaign.images.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-3xl overflow-hidden shadow-lg"
                >
                  <img
                    src={campaign.images[0]}
                    alt={campaign.title}
                    className="w-full h-96 object-cover"
                  />
                </motion.div>
              )}

              {/* Full Description */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="rounded-3xl bg-white p-8 shadow-lg border border-slate-200"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-4">About This Campaign</h2>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {campaign.description}
                </p>
              </motion.div>

              {/* Status & Timeline */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid gap-6 sm:grid-cols-2"
              >
                <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 border border-blue-200">
                  <p className="text-slate-600 text-sm">Status</p>
                  <p className="mt-2 text-2xl font-bold text-blue-600 capitalize">
                    {campaign.status}
                  </p>
                </div>
                <div className="rounded-3xl bg-gradient-to-br from-purple-50 to-purple-100 p-6 border border-purple-200">
                  <p className="text-slate-600 text-sm">Days Left</p>
                  <p className="mt-2 text-2xl font-bold text-purple-600">{daysLeft}</p>
                </div>
              </motion.div>
            </div>

            {/* Donation Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:sticky lg:top-24 h-fit rounded-3xl bg-white p-8 shadow-xl border border-slate-200"
            >
              {/* Goal Progress */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-slate-900">Funds Raised</h3>
                  <span className="text-sm font-semibold text-blue-600">{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-4 rounded-full bg-slate-200 overflow-hidden mb-3">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">₹{campaign.raisedAmount}</span>
                  <span>of ₹{campaign.goalAmount}</span>
                </div>
              </div>

              {/* Donate Button */}
              <button
                onClick={() => navigate(`/donate?donateOrg=${org?._id}&campaignId=${campaign?._id}&campaignName=${encodeURIComponent(campaign?.title)}`)}
                className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 font-bold text-lg hover:shadow-lg transition mb-4"
              >
                💝 Donate Now
              </button>

              {/* Deadline */}
              <div className="text-center text-sm text-slate-600 mb-6">
                Deadline: {new Date(campaign.deadline).toLocaleDateString()}
              </div>

              {/* Share */}
              <div className="border-t border-slate-200 pt-6 space-y-3">
                <p className="text-sm font-semibold text-slate-900">Share this campaign</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const text = `Support ${campaign.title} - ${window.location.href}`;
                      navigator.share?.({ title: campaign.title, text });
                    }}
                    className="flex-1 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 px-3 py-2 font-semibold transition"
                  >
                    Share
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Link copied!");
                    }}
                    className="flex-1 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 px-3 py-2 font-semibold transition"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Additional Images */}
          {campaign.images && campaign.images.length > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-slate-900">Campaign Gallery</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {campaign.images.slice(1).map((img, i) => (
                  <div
                    key={i}
                    className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition"
                  >
                    <img
                      src={img}
                      alt={`Campaign ${i + 2}`}
                      className="w-full h-48 object-cover hover:scale-110 transition"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
  );
}
