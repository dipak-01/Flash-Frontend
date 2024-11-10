import { BrowserRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/auth/Login";
import SignupPage from "@/pages/auth/Signup";
import PlayerDashboard from "@/pages/PlayerDashboard";
import VenueOwnerDashboard from "@/pages/VenueOwnerDashboard";
import VenueDetailsPage from "@/pages/VenueDetails";
import VenueListingPage from "@/pages/VenueListing";
import Header from "@/components/scratch/Header";
import UpdateVenue from "@/pages/UpdateVenue";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AboutPage from "@/pages/AboutPage";
// import ContactPage from "@/pages/ContactPage";
import TermsPage from "@/pages/TermsPage";
import PrivacyPage from "@/pages/PrivacyPage";
// import FAQPage from "@/pages/FAQPage";
// import BlogPage from "@/pages/BlogPage";
// import CookiePolicyPage from "@/pages/CookiePolicyPage";
// import RefundPolicyPage from "@/pages/RefundPolicyPage";
import Footer from "@/components/scratch/Footer";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              
              {/* Protected Player Routes */}
              <Route path="/player-profile" element={
                <ProtectedRoute allowedRole="player">
                  <PlayerDashboard />
                </ProtectedRoute>
              } />
              
              {/* Protected Venue Owner Routes */}
              <Route path="/venue-owner-profile" element={
                <ProtectedRoute allowedRole="venue_owner">
                  <VenueOwnerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/update-venue/:id" element={
                <ProtectedRoute allowedRole="venue_owner">
                  <UpdateVenue />
                </ProtectedRoute>
              } />
              
              {/* Semi-protected Routes */}
              <Route path="/venue-details/:id" element={
                <ProtectedRoute>
                  <VenueDetailsPage />
                </ProtectedRoute>
              } />
              <Route path="/venue-listing" element={<VenueListingPage />} />

              {/* Public Routes */}
              <Route path="/about" element={<AboutPage />} />
              {/* <Route path="/contact" element={<ContactPage />} /> */}
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              {/* <Route path="/faq" element={<FAQPage />} /> */}
              {/* <Route path="/blog" element={<BlogPage />} /> */}
              {/* <Route path="/cookie-policy" element={<CookiePolicyPage />} /> */}
              {/* <Route path="/refund-policy" element={<RefundPolicyPage />} /> */}

              {/* Unauthorized Route */}
              <Route 
                path="/unauthorized" 
                element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold text-red-600">Unauthorized Access</h1>
                      <p className="mt-2">You don't have permission to access this page.</p>
                      <Link to="/" className="mt-4 inline-block text-blue-600">
                        Return to Home
                      </Link>
                    </div>
                  </div>
                } 
              />

              {/* Catch-all route for 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
      {/* ToastContainer moved outside Router for better organization */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AuthProvider>
  );
}