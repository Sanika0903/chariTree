import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import HomePage from "./pages/HomePage";
import DonatePage from "./pages/DonatePage";
import OrganizationDetails from "./pages/OrganizationDetails";
import OrgDashboard from "./pages/OrgDashboard";
import PaymentPage from "./pages/PaymentPage";
import DonorDashboard from "./pages/DonorDashboard";
import DonorProfile from "./pages/DonorProfile";
import DonorProfilePage from "./pages/DonorProfilePage";
import LoginPage from "./pages/DonorLoginPage";
import SignupPage from "./pages/DonorSignupPage";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import VolunteerLanding from "./pages/VolunteerLanding";
import CommunityPage from "./pages/CommunityPage";
import AboutPage from "./pages/AboutPage";
import CampaignCreate from "./pages/CampaignCreate";
import CampaignEdit from "./pages/CampaignEdit";
import CampaignDetails from "./pages/CampaignDetails";
import OrganizationWishlist from "./pages/OrganizationWishlist";
import NotificationsPage from "./pages/NotificationsPage";
import VolunteerEvents from "./pages/VolunteerEvents";
import MyEventsPage from "./pages/MyEventsPage";
import VolunteerCertificates from "./pages/VolunteerCertificates";
import VolunteerProfilePage from "./pages/VolunteerProfilePage";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminOrganizations from "./pages/AdminOrganizations";
import AdminCampaigns from "./pages/AdminCampaigns";
import AdminReports from "./pages/AdminReports";
import AdminAnalytics from "./pages/AdminAnalytics";

// Context & nav
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './components/PublicLayout';
import DonorNavbar from './components/DonorNavbar';
import VolunteerNavbar from './components/VolunteerNavbar';
import OrgNavbar from './components/OrgNavbar';
import AdminNavbar from './components/AdminNavbar';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><div className="p-8 text-center text-slate-700 font-semibold">Contact Page - Under Construction</div></PublicLayout>} />
          <Route path="/organizations" element={<PublicLayout><DonatePage /></PublicLayout>} />
          <Route path="/organization/:id" element={<PublicLayout><OrganizationDetails /></PublicLayout>} />
          <Route path="/campaign/:id" element={<PublicLayout><CampaignDetails /></PublicLayout>} />
          <Route path="/volunteer-landing" element={<PublicLayout><VolunteerLanding /></PublicLayout>} />
          <Route path="/campaigns" element={<PublicLayout><CommunityPage /></PublicLayout>} />
          <Route path="/donate" element={<PublicLayout><DonatePage /></PublicLayout>} />
          <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
          <Route path="/signup" element={<PublicLayout><SignupPage /></PublicLayout>} />
          <Route path="/payment" element={<PublicLayout><PaymentPage /></PublicLayout>} />

          {/* Legacy Auth pages (redirecting to unified login/signup) */}
          <Route path="/donor-login" element={<Navigate to="/login" replace />} />
          <Route path="/donor-signup" element={<Navigate to="/signup" replace />} />
          <Route path="/org-login" element={<Navigate to="/login" replace />} />
          <Route path="/volunteer-login" element={<Navigate to="/login" replace />} />
          <Route path="/community" element={<Navigate to="/campaigns" replace />} />

          {/* Donor Dashboard summary (protected) */}
          <Route
            path="/dashboard/donor"
            element={<ProtectedRoute roles={["donor"]}><DonorNavbar /><DonorDashboard /></ProtectedRoute>}
          />
          <Route
            path="/dashboard/donor/donations"
            element={<ProtectedRoute roles={["donor"]}><DonorNavbar /><DonorProfile /></ProtectedRoute>}
          />
          <Route
            path="/dashboard/donor/profile"
            element={<ProtectedRoute roles={["donor"]}><DonorNavbar /><DonorProfilePage /></ProtectedRoute>}
          />
          <Route
            path="/dashboard/donor/notifications"
            element={<ProtectedRoute roles={["donor"]}><DonorNavbar /><NotificationsPage /></ProtectedRoute>}
          />

          {/* Volunteer Dashboard summary (protected) */}
          <Route
            path="/dashboard/volunteer"
            element={<ProtectedRoute roles={["volunteer"]}><VolunteerNavbar /><VolunteerDashboard /></ProtectedRoute>}
          />
          <Route
            path="/dashboard/volunteer/events"
            element={<ProtectedRoute roles={["volunteer"]}><VolunteerNavbar /><VolunteerEvents /></ProtectedRoute>}
          />
          <Route
            path="/dashboard/volunteer/my-events"
            element={<ProtectedRoute roles={["volunteer"]}><VolunteerNavbar /><MyEventsPage /></ProtectedRoute>}
          />
          <Route
            path="/dashboard/volunteer/certificates"
            element={<ProtectedRoute roles={["volunteer"]}><VolunteerNavbar /><VolunteerCertificates /></ProtectedRoute>}
          />
          <Route
            path="/dashboard/volunteer/profile"
            element={<ProtectedRoute roles={["volunteer"]}><VolunteerNavbar /><VolunteerProfilePage /></ProtectedRoute>}
          />

          {/* Organization Dashboard summary (protected) */}
          <Route
            path="/dashboard/org"
            element={<ProtectedRoute roles={["organization"]}><OrgNavbar /><OrgDashboard /></ProtectedRoute>}
          />
          <Route
            path="/dashboard/org/campaigns"
            element={<ProtectedRoute roles={["organization"]}><OrgNavbar /><OrgDashboard /></ProtectedRoute>}
          />
          <Route
            path="/dashboard/org/wishlist"
            element={<ProtectedRoute roles={["organization"]}><OrgNavbar /><OrganizationWishlist /></ProtectedRoute>}
          />
          <Route
            path="/dashboard/org/donations"
            element={<ProtectedRoute roles={["organization"]}><OrgNavbar /><OrgDashboard /></ProtectedRoute>}
          />
          <Route
            path="/dashboard/org/volunteers"
            element={<ProtectedRoute roles={["organization"]}><OrgNavbar /><OrgDashboard /></ProtectedRoute>}
          />
          <Route
            path="/dashboard/org/analytics"
            element={<ProtectedRoute roles={["organization"]}><OrgNavbar /><OrgDashboard /></ProtectedRoute>}
          />
          <Route
            path="/dashboard/org/profile"
            element={<ProtectedRoute roles={["organization"]}><OrgNavbar /><OrgDashboard /></ProtectedRoute>}
          />
          <Route
            path="/dashboard/org/campaigns/create"
            element={<ProtectedRoute roles={["organization"]}><OrgNavbar /><CampaignCreate /></ProtectedRoute>}
          />
          <Route
            path="/dashboard/org/campaigns/:id/edit"
            element={<ProtectedRoute roles={["organization"]}><OrgNavbar /><CampaignEdit /></ProtectedRoute>}
          />

          {/* Admin Dashboard (protected) */}
          <Route
            path="/admin"
            element={<ProtectedRoute roles={["admin"]}><AdminNavbar /><AdminDashboard /></ProtectedRoute>}
          />
          <Route
            path="/admin/users"
            element={<ProtectedRoute roles={["admin"]}><AdminNavbar /><AdminUsers /></ProtectedRoute>}
          />
          <Route
            path="/admin/organizations"
            element={<ProtectedRoute roles={["admin"]}><AdminNavbar /><AdminOrganizations /></ProtectedRoute>}
          />
          <Route
            path="/admin/campaigns"
            element={<ProtectedRoute roles={["admin"]}><AdminNavbar /><AdminCampaigns /></ProtectedRoute>}
          />
          <Route
            path="/admin/reports"
            element={<ProtectedRoute roles={["admin"]}><AdminNavbar /><AdminReports /></ProtectedRoute>}
          />
          <Route
            path="/admin/analytics"
            element={<ProtectedRoute roles={["admin"]}><AdminNavbar /><AdminAnalytics /></ProtectedRoute>}
          />

          {/* Legacy volunteer routes (redirect to dashboards) */}
          <Route path="/events" element={<Navigate to="/dashboard/volunteer/events" replace />} />
          <Route path="/my-events" element={<Navigate to="/dashboard/volunteer/my-events" replace />} />
          <Route path="/certificates" element={<Navigate to="/dashboard/volunteer/certificates" replace />} />
          <Route path="/volunteer-profile" element={<Navigate to="/dashboard/volunteer/profile" replace />} />

          {/* Legacy donor routes (redirect to dashboards) */}
          <Route path="/donor-profile" element={<Navigate to="/dashboard/donor/profile" replace />} />
          <Route path="/notifications" element={<Navigate to="/dashboard/donor/notifications" replace />} />

          {/* Legacy organization routes (redirect to dashboards) */}
          <Route path="/org-dashboard" element={<Navigate to="/dashboard/org" replace />} />
          <Route path="/org-wishlist" element={<Navigate to="/dashboard/org/wishlist" replace />} />
          <Route path="/org-campaigns/create" element={<Navigate to="/dashboard/org/campaigns/create" replace />} />
          <Route path="/org-campaigns/:id/edit" element={<Navigate to="/dashboard/org/campaigns/:id/edit" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
