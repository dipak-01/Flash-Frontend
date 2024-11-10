"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

interface Profile {
  name: string;
  email: string;
  joinedDate: string;
  avatar?: string; // Make sure avatar field is defined
  DOB: string;
  phone: number;
  userhandle: string;
}

interface Booking {
  playgroundName: string;
  playgroundLocation: string;
  slotDate: string;
  slotTime: string;
  players: number;
  slotSize: number;
}

const calculateStats = (bookings: Booking[]) => {
  const now = new Date();
  const stats = {
    totalHours: 0,
    eventsParticipated: bookings.length,
    uniqueVenues: new Set<string>(),
    upcomingEvents: 0,
  };

  bookings.forEach((booking) => {
    // Calculate hours (assuming each slot is 2 hours)
    stats.totalHours += 2;

    // Count unique venues
    stats.uniqueVenues.add(booking.playgroundLocation);

    // Count upcoming events
    const bookingDate = new Date(booking.slotDate);
    if (bookingDate > now) {
      stats.upcomingEvents++;
    }
  });

  return {
    totalHours: stats.totalHours,
    eventsParticipated: stats.eventsParticipated,
    uniqueVenues: stats.uniqueVenues.size,
    upcomingEvents: stats.upcomingEvents,
  };
};

const getUpcomingBookings = (bookings: Booking[]) => {
  const now = new Date();
  return bookings
    .filter((booking) => new Date(booking.slotDate) > now)
    .sort((a, b) => new Date(a.slotDate).getTime() - new Date(b.slotDate).getTime())
    .slice(0, 3); // Get next 3 upcoming events
};

// Add this improved date formatting utility
const formatDateString = (dateString: string | undefined) => {
  if (!dateString) return "N/A";
  try {
    // Handle different date formats
    let date: Date;
    
    // Try parsing ISO format first
    date = new Date(dateString);
    
    // If invalid, try DD-MM-YYYY format
    if (isNaN(date.getTime())) {
      const [day, month, year] = dateString.split(/[-/]/);
      date = new Date(`${year}-${month}-${day}`);
    }
    
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }

    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch {
    console.error('Date parsing error for:', dateString);
    return "N/A";
  }
};

export default function PlayerDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalHours: 0,
    eventsParticipated: 0,
    uniqueVenues: 0,
    upcomingEvents: 0,
  });
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const [bookingsRes, profileRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/player/bookings`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/player/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
        ]);

        if (!bookingsRes.ok || !profileRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [bookingsData, profileData] = await Promise.all([
          bookingsRes.json(),
          profileRes.json(),
        ]);

        // Sort bookings by date
        bookingsData.sort(
          (a: Booking, b: Booking) =>
            new Date(a.slotDate).getTime() - new Date(b.slotDate).getTime()
        );

        setBookings(bookingsData);
        setProfile(profileData[0]);
        console.log(profileData);

        // Calculate stats from bookings
        const calculatedStats = calculateStats(bookingsData);
        setStats(calculatedStats);

        // Get upcoming bookings
        const upcoming = getUpcomingBookings(bookingsData);
        setUpcomingBookings(upcoming);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Convert bookings to calendar events
  const calendarEvents = bookings.map((booking) => ({
    title: `${booking.playgroundName} - ${booking.slotTime}`,
    date: booking.slotDate,
  }));

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start">
            <div className="flex items-start space-x-6 w-full">
              <Avatar className="h-20 w-20">
                <AvatarImage 
                  src={profile?.avatar || "/placeholder-avatar.png"} 
                  alt={profile?.name || "Player"}
                />
                <AvatarFallback>
                  {profile?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "P"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-3">
                {isLoading ? (
                  <div className="h-12 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#FF3B30]"></div>
                  </div>
                ) : (
                  <>
                    <div>
                      <h1 className="text-3xl font-bold text-[#111827] mb-1">
                        {profile?.name}
                      </h1>
                      <p className="text-[#FF3B30] font-medium">
                        @{profile?.userhandle}
                      </p>
                    </div>
                    <div className="flex space-x-6">
                      <div className="space-y-1">
                        <p className="text-sm text-[#9CA3AF]">Email</p>
                        <p className="text-sm font-medium text-[#111827]">
                          {profile?.email}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-[#9CA3AF]">Date of Birth</p>
                        <p className="text-sm font-medium text-[#111827]">
                          {formatDateString(profile?.DOB)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-[#9CA3AF]">Member Since</p>
                        <p className="text-sm font-medium text-[#111827]">
                          {formatDateString(profile?.joinedDate)}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Adjusted the bookings section to reduce height */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="text-[#111827]">Your Bookings</CardTitle>
              <CardDescription className="text-[#9CA3AF]">
                {isLoading
                  ? "Loading bookings..."
                  : `${bookings.length} bookings found`}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF3B30]"></div>
                </div>
              ) : (
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  style={{ maxHeight: '400px', overflowY: 'auto' }} // Add this line
                >
                  {/* Adjusted to two columns to reduce height */}
                  {bookings.map((booking: Booking, index: number) => (
                    <Card
                      key={index}
                      className="transition-all duration-300 ease-in-out hover:shadow-lg"
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-[#111827]">
                          {booking.playgroundName}
                        </CardTitle>
                        <div className="flex items-center space-x-2 text-[#9CA3AF]">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">
                            {booking.playgroundLocation}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-[#9CA3AF]">
                              <Calendar className="h-4 w-4" />
                              <span className="text-sm">
                                {formatDateString(booking.slotDate)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-[#9CA3AF]">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm">
                                {booking.slotTime}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-[#FF3B30]" />
                              <span className="text-sm font-medium">
                                {booking.players}/{booking.slotSize} players
                              </span>
                            </div>
                            <div
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                booking.players === booking.slotSize
                                  ? "bg-red-100 text-red-600"
                                  : "bg-green-100 text-green-600"
                              }`}
                            >
                              {booking.players === booking.slotSize
                                ? "Full"
                                : "Available"}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add Calendar Component */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="text-[#111827]">Booking Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={calendarEvents}
                height="400px" // Adjust height as needed
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#111827]">Your Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Clock, label: "Hours Played", value: stats.totalHours },
                  {
                    icon: Calendar,
                    label: "Events Participated",
                    value: stats.eventsParticipated,
                  },
                  { icon: MapPin, label: "Venues Visited", value: stats.uniqueVenues },
                  {
                    icon: Calendar,
                    label: "Upcoming Events",
                    value: stats.upcomingEvents,
                  },
                ].map((stat, index) => (
                  <Card
                    key={index}
                    className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <stat.icon className="h-6 w-6 mb-2 text-[#FF3B30]" />
                      <p className="text-sm font-medium text-[#9CA3AF] text-center mb-1">
                        {stat.label}
                      </p>
                      <p className="text-xl font-bold text-[#111827]">
                        {stat.value}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#111827]">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {upcomingBookings.length === 0 ? (
                  <p className="text-center text-[#9CA3AF]">No upcoming events</p>
                ) : (
                  upcomingBookings.map((booking, index) => (
                    <Card
                      key={index}
                      className="hover:shadow-md transition-shadow duration-200"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-[#111827]">
                              {booking.playgroundName}
                            </h3>
                            <div className="flex items-center space-x-2 text-[#9CA3AF] mt-1">
                              <MapPin className="h-4 w-4" />
                              <span className="text-sm">
                                {booking.playgroundLocation}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-[#111827]">
                              {formatDateString(booking.slotDate)}
                            </p>
                            <p className="text-sm text-[#9CA3AF]">
                              {booking.slotTime}
                            </p>
                          </div>
                          <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                            {`${booking.players}/${booking.slotSize} players`}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
