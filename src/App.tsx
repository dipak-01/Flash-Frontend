import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/auth/Login";
import SignupPage from "@/pages/auth/Signup";
import UserProfilePage from "@/pages/UserProfile";
import PlayerDashboard from "@/pages/PlayerDashboard";
import VenueOwnerDashboard from "@/pages/VenueOwnerDashboard";
import VenueDetailsPage from "@/pages/VenueDetails";
import VenueListingPage from "@/pages/VenueListing";
import GroupChatPage from "@/pages/GroupChat";
import Header from "@/components/scratch/Header";

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/player-profile" element={<PlayerDashboard />} />
        <Route path="/venue-owner-profile" element={<VenueOwnerDashboard />} />
        <Route path="/user-profile" element={<UserProfilePage />} />
        <Route path="/venue-details/:id" element={<VenueDetailsPage />} />
        <Route path="/venue-listing" element={<VenueListingPage />} />
        <Route path="/group-chat/:id" element={<GroupChatPage />} />
      </Routes>
    </Router>
  );
}