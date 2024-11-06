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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function VenueOwnerDashboard() {
  const [owner, setOwner] = useState<Owner | null>(null);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [upcomingBookings] = useState<Booking[]>([]);
  const [pastBookings] = useState<Booking[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSlot, setNewSlot] = useState({ time: "", date: "", slotSize: "" });
  const [selectedPlaygroundId, setSelectedPlaygroundId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOwnerDetails() {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/owner/profile`);
      const data = await response.json();
      setOwner(data[0]);
      console.log(data);
    }

    async function fetchVenues() {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/playground/owner?id=672a0e70727bb1402e0040e5`);
      const data = await response.json();
      setVenues(data.result);
    }

    fetchOwnerDetails();
    fetchVenues();
  }, []);

  interface Owner {
    name: string;
  }

  interface Venue {
    _id: string;
    name: string;
    location: string;
  }

  interface Booking {
    id: string;
    venue: string;
    sport: string;
    date: string;
    time: string;
    participants: number;
  }

  const handleAddSlot = async (): Promise<void> => {
    if (!selectedPlaygroundId) return;

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/slot/new?playgroundId=${selectedPlaygroundId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSlot),
    });
    const data = await response.json();
    console.log(data);
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg" alt="Venue Owner" />
              <AvatarFallback>{owner?.name}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome, {owner?.name}</h1>
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
                    key={venue._id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold">{venue.name}</h3>
                      <p className="text-sm text-gray-600">{venue.location}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => {
                      setSelectedPlaygroundId(venue._id);
                      setIsDialogOpen(true);
                    }}>
                      Add Slot
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Slot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Time"
              value={newSlot.time}
              onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
            />
            <Input
              placeholder="Date"
              value={newSlot.date}
              onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
            />
            <Input
              placeholder="Slot Size"
              value={newSlot.slotSize}
              onChange={(e) => setNewSlot({ ...newSlot, slotSize: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddSlot}>Add Slot</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
