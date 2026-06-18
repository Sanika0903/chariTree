import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { apiUrl } from "../config/api";

export default function OrganizationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const res = await axios.get(apiUrl(`/api/organizations/${id}`));
        setOrg(res.data);
      } catch (err) {
        console.error("Failed to load organization details", err);
        setError("Unable to load this organization. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-20">
        <div className="rounded-3xl bg-white p-8 shadow-lg text-center">
          <p className="text-slate-700">Loading organization details…</p>
        </div>
      </div>
    );
  }

  if (error || !org) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-20">
        <div className="max-w-3xl mx-auto rounded-3xl bg-white p-8 shadow-lg text-center">
          <p className="text-red-600 font-semibold mb-4">{error || "Organization not found."}</p>
          <button onClick={() => navigate("/organizations")} className="px-5 py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition">
            Back to Organizations
          </button>
        </div>
      </div>
    );
  }

  const shortDescription = org.description || `A dedicated ${org.category?.toLowerCase() || "organization"} working to serve the ${org.location || "local"} community.`;
  const campaignItems = org.updates?.length ? org.updates : [];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] bg-white p-8 shadow-xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-5">
              <div className="flex items-center gap-5">
                <div className="h-20 w-20 rounded-[1.5rem] bg-blue-50 flex items-center justify-center text-4xl font-bold text-blue-700">
                  {org.name?.charAt(0) || "O"}
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-blue-600">{org.category}</p>
                  <h1 className="text-4xl font-semibold text-slate-900">{org.name}</h1>
                  <p className="mt-3 text-slate-600 max-w-2xl">{shortDescription}</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Location</p>
                  <p className="mt-2 font-semibold text-slate-900">{org.location || "Unknown"}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Cause</p>
                  <p className="mt-2 font-semibold text-slate-900">{org.category || "Community Support"}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Contact</p>
                  <p className="mt-2 font-semibold text-slate-900">{org.email || "—"}</p>
                </div>
              </div>
            </div>

            <aside className="space-y-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm min-w-[300px]">
              <div className="space-y-3">
                <p className="text-sm text-slate-500">Ready to support?</p>
                <button
                  onClick={() => navigate(`/organizations?donateOrg=${org._id}`)}
                  className="w-full rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
                >
                  Donate Now
                </button>
                <Link
                  to="/volunteer-landing"
                  state={{ org }}
                  className="block text-center rounded-3xl border border-blue-600 px-5 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition"
                >
                  Volunteer with this org
                </Link>
              </div>

              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Wishlist items</p>
                <div className="mt-4 space-y-3">
                  {org.wishlist?.length ? (
                    org.wishlist.slice(0, 5).map((item, index) => (
                      <div key={index} className="rounded-3xl bg-slate-50 p-3">
                        <p className="font-semibold text-slate-900">{item.item}</p>
                        <p className="text-sm text-slate-600">Needed: {item.quantity}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No active wishlist items listed.</p>
                  )}
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.65fr_1fr]">
            <div className="space-y-8">
              <section className="rounded-3xl bg-slate-50 p-8">
                <h2 className="text-2xl font-semibold text-slate-900">About {org.name}</h2>
                <p className="mt-4 text-slate-600 leading-7">
                  {org.description || `${org.name} is focused on ${org.category?.toLowerCase() || "community support"} in ${org.location || "its local area"}.`}
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Organization Email</p>
                    <p className="mt-2 font-semibold text-slate-900">{org.email || "Not provided"}</p>
                  </div>
                  <div className="rounded-3xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Total Wishlist Items</p>
                    <p className="mt-2 font-semibold text-slate-900">{org.wishlist?.length || 0}</p>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl bg-white p-8 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900">Wishlist</h2>
                    <p className="mt-2 text-slate-500">Support this organization with needed items.</p>
                  </div>
                  <button
                    onClick={() => navigate(`/organizations?donateOrg=${org._id}`)}
                    className="rounded-3xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                  >
                    Donate Wishlist
                  </button>
                </div>

                {org.wishlist?.length ? (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {org.wishlist.map((item, index) => (
                      <div key={index} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                        <p className="font-semibold text-slate-900">{item.item}</p>
                        <p className="mt-2 text-sm text-slate-600">Quantity needed: {item.quantity}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-6 text-slate-500">No wishlist items available at the moment.</p>
                )}
              </section>
            </div>

            <section className="space-y-6">
              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900">Campaigns</h2>
                <p className="mt-2 text-slate-500">Track active initiatives and recent updates.</p>
                <div className="mt-6 space-y-4">
                  {campaignItems.length ? (
                    campaignItems.slice(0, 5).map((campaign, index) => (
                      <div key={index} className="rounded-3xl border border-slate-200 p-4">
                        <p className="font-semibold text-slate-900">{campaign.title}</p>
                        <p className="mt-2 text-sm text-slate-600">{campaign.content}</p>
                        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-400">{new Date(campaign.date).toLocaleDateString()}</p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-slate-500">
                      No campaign updates found yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-3xl bg-slate-50 p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900">Need help?</h3>
                <p className="mt-3 text-slate-600">If you’d like a guided donation experience or volunteer match, visit our browse page or contact the organization directly.</p>
                <div className="mt-5 flex flex-col gap-3">
                  <button
                    onClick={() => navigate("/organizations")}
                    className="rounded-3xl bg-white border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100 transition"
                  >
                    Browse More Organizations
                  </button>
                  <button
                    onClick={() => navigate(`/organizations?donateOrg=${org._id}`)}
                    className="rounded-3xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
                  >
                    Donate to this org
                  </button>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
