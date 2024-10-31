"use client";

// import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
 
  Users,
  DollarSign,
  Clock,
  ArrowRight,
  BarChart2,
} from "lucide-react";
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
 

export default function VenueOwnerDashboard() {
  // const [activeTab, setActiveTab] = useState("upcoming");

  const venues = [
    {
      id: 1,
      name: "City Sports Complex",
      location: "Downtown",
      sports: ["Soccer", "Basketball"],
    },
    {
      id: 2,
      name: "Green Field Park",
      location: "Suburb",
      sports: ["Soccer", "Tennis"],
    },
  ];

  const upcomingBookings = [
    {
      id: 1,
      venue: "City Sports Complex",
      sport: "Soccer",
      date: "2023-07-15",
      time: "14:00-16:00",
      participants: 22,
    },
    {
      id: 2,
      venue: "Green Field Park",
      sport: "Tennis",
      date: "2023-07-18",
      time: "10:00-12:00",
      participants: 4,
    },
  ];

  const pastBookings = [
    {
      id: 3,
      venue: "City Sports Complex",
      sport: "Basketball",
      date: "2023-07-10",
      time: "18:00-20:00",
      participants: 10,
    },
    {
      id: 4,
      venue: "Green Field Park",
      sport: "Soccer",
      date: "2023-07-08",
      time: "16:00-18:00",
      participants: 22,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg" alt="Venue Owner" />
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome, Jane Smith</h1>
              <p className="text-gray-600">Venue Owner since March 2022</p>
            </div>
          </div>
          <Button>Add New Venue</Button>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Bookings</CardTitle>
              <CardDescription>
                Manage your upcoming and past bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming">
                  {upcomingBookings.map((booking) => (
                    <Card key={booking.id} className="mb-4">
                      <CardHeader>
                        <CardTitle>{booking.venue}</CardTitle>
                        <CardDescription>
                          <Badge>{booking.sport}</Badge>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {booking.date} at {booking.time}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Users className="h-4 w-4" />
                          <span>{booking.participants} participants</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline">Manage Booking</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </TabsContent>
                <TabsContent value="past">
                  {pastBookings.map((booking) => (
                    <Card key={booking.id} className="mb-4">
                      <CardHeader>
                        <CardTitle>{booking.venue}</CardTitle>
                        <CardDescription>
                          <Badge>{booking.sport}</Badge>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {booking.date} at {booking.time}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Users className="h-4 w-4" />
                          <span>{booking.participants} participants</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline">View Details</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Button className="w-full">
                  <Calendar className="mr-2 h-4 w-4" /> Manage Availability
                </Button>
                <Button className="w-full" variant="outline">
                  <DollarSign className="mr-2 h-4 w-4" /> Update Pricing
                </Button>
                <Button className="w-full" variant="outline">
                  <BarChart2 className="mr-2 h-4 w-4" /> View Analytics
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Venues</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {venues.map((venue) => (
                  <div
                    key={venue.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold">{venue.name}</h3>
                      <p className="text-sm text-gray-600">{venue.location}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="link" className="w-full">
                  View All Venues <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Analytics Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {[
                { icon: Calendar, label: "Total Bookings", value: 156 },
                { icon: Users, label: "Unique Customers", value: 89 },
                { icon: DollarSign, label: "Revenue", value: "$12,450" },
                {
                  icon: Clock,
                  label: "Avg. Booking Duration",
                  value: "2h 15m",
                },
              ].map((stat, index) => (
                <Card key={index} className="flex-shrink-0 w-40">
                  <CardContent className="p-4 text-center">
                    <stat.icon className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View Detailed Analytics
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
