"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  MapPin,
  Users,
  Star,
  Clock,
  ArrowRight,
  Search,
} from "lucide-react";

interface Profile {
  name: string;
  email: string;
  joinedDate: string;
  avatar?: string;
}

interface Booking {
  playgroundName: string;
  playgroundLocation: string;
  slotDate: string;
  slotTime: string;
  players: number;
  slotSize: number;
}

export default function PlayerDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

        setBookings(bookingsData);
        setProfile(profileData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const recommendedVenues = [
    {
      id: 1,
      name: "Green Field Stadium",
      sport: "Soccer",
      rating: 4.5,
      distance: "2.5 miles",
    },
    {
      id: 2,
      name: "Central Court",
      sport: "Tennis",
      rating: 4.8,
      distance: "1.8 miles",
    },
    {
      id: 3,
      name: "Aqua Center",
      sport: "Swimming",
      rating: 4.2,
      distance: "3.2 miles",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={profile?.avatar || "/placeholder.svg"}
                alt={profile?.name || "Player"}
              />
              <AvatarFallback>
                {profile?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "P"}
              </AvatarFallback>
            </Avatar>
            <div>
              {isLoading ? (
                <div className="h-12 flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#FF3B30]"></div>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-[#111827]">
                    Welcome, {profile?.name}
                  </h1>
                  <p className="text-[#9CA3AF]">
                    Player since{" "}
                    {new Date(profile?.joinedDate || "").toLocaleDateString(
                      "en-US",
                      { month: "long", year: "numeric" }
                    )}
                  </p>
                </>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            className="border-[#000000] text-[#000000] hover:bg-[#000000] hover:text-white transition-all duration-300 ease-in-out hover:scale-105"
          >
            Edit Profile
          </Button>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-[#111827]">Your Bookings</CardTitle>
              <CardDescription className="text-[#9CA3AF]">
                {isLoading
                  ? "Loading bookings..."
                  : `${bookings.length} bookings found`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF3B30]"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                {new Date(
                                  booking.slotDate
                                ).toLocaleDateString()}
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

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#111827]">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Button className="w-full bg-[#FFD60A] text-[#111827] hover:bg-[#FFD60A]/90 transition-all duration-300 ease-in-out hover:scale-105">
                  <Calendar className="mr-2 h-4 w-4" /> Create New Event
                </Button>
                <Button className="w-full bg-[#FF3B30] text-white hover:bg-[#FF3B30]/90 transition-all duration-300 ease-in-out hover:scale-105">
                  <Search className="mr-2 h-4 w-4" /> Find Nearby Venues
                </Button>
                <Button className="w-full bg-[#FF3B30] text-white hover:bg-[#FF3B30]/90 transition-all duration-300 ease-in-out hover:scale-105">
                  <Users className="mr-2 h-4 w-4" /> Join a Team
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[#111827]">
                  Recommended Venues
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {recommendedVenues.map((venue) => (
                  <div
                    key={venue.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold text-[#111827]">
                        {venue.name}
                      </h3>
                      <p className="text-sm text-[#9CA3AF]">
                        {venue.sport} • {venue.distance}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-[#FFD60A] mr-1" />
                      <span className="text-[#111827]">{venue.rating}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button
                  variant="link"
                  className="w-full text-[#FF3B30] hover:text-[#FF3B30]/90 transition-all duration-300 ease-in-out hover:scale-105"
                >
                  View All Venues <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#111827]">Your Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {[
                { icon: Calendar, label: "Events Attended", value: 12 },
                { icon: Users, label: "Teams Joined", value: 3 },
                { icon: MapPin, label: "Venues Visited", value: 8 },
                { icon: Star, label: "Average Rating", value: "4.7" },
                { icon: Clock, label: "Hours Played", value: 36 },
              ].map((stat, index) => (
                <Card
                  key={index}
                  className="flex-shrink-0 w-40 transition-all duration-300 ease-in-out hover:shadow-lg"
                >
                  <CardContent className="p-4 text-center">
                    <stat.icon className="h-8 w-8 mx-auto mb-2 text-[#FF3B30]" />
                    <p className="text-sm font-medium text-[#9CA3AF]">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-[#111827]">
                      {stat.value}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
