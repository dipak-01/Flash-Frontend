"use client";
import CustomDialog from "@/components/scratch/CustomDialog";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
 // import { useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Users,
  IndianRupee,
  Clock,
  ArrowRight,
   
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function VenueOwnerDashboard() {
  const [owner, setOwner] = useState<Owner | null>(null);
  const [venues, setVenues] = useState<Venue[]>([]);
  // const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  // const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlaygroundId, setSelectedPlaygroundId] = useState<
    string | null
  >(null);
  const [selectedVenueTiming, setSelectedVenueTiming] = useState<string>("");
  const [isAddVenueDialogOpen, setIsAddVenueDialogOpen] = useState(false);
  const [newVenue, setNewVenue] = useState({
    name: "",
    location: "",
    timings: "",
    sports: "",
    price: "",
    type: "",
    imgUrl: ""
  });
  const [allBookings, setAllBookings] = useState<{ [key: string]: { upcoming: Booking[], past: Booking[] } }>({});
  const [isUpdateVenueDialogOpen, setIsUpdateVenueDialogOpen] = useState(false);
  const [venueToUpdate, setVenueToUpdate] = useState<Venue | null>(null);

  useEffect(() => {
    async function fetchOwnerDetails() {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("No token found in session storage");
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/owner/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch owner details");
        }

        const data = await response.json();
        if (data.length === 0) {
          console.error("Owner data is empty");
          return;
        }

        setOwner(data[0]);
        const ownerId = data[0]._id;
        if (ownerId) {
          await fetchVenues(ownerId, token);
        } else {
          console.error("Owner ID not found");
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching owner details:", error.message);
        }
      }
    }

    async function fetchVenues(ownerId: string, token: string) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/playground/owner?id=${ownerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch venues");
        }

        const data = await response.json();
        console.log(data);
        setVenues(data.result);

        // Fetch slots for all venues
        data.result.forEach((venue: Venue) => {
          fetchSlots(venue._id);
        });
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching venues:", error.message);
        }
      }
    }

    
async function fetchSlots(playgroundId: string) {
  const token = sessionStorage.getItem('token');
  if (!token) {
    console.error('No token found in session storage');
    return;
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/slot/all?playgroundId=${playgroundId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch slots");
    }

    const data = await response.json();
    console.log(data);

    const currentDate = new Date();

    // Access the bookings array from data.slots
    const bookings: Booking[] = data.slots;

    if (!Array.isArray(bookings)) {
      throw new Error("Invalid data format: bookings should be an array");
    }

    const upcoming = bookings.filter(
      (slot: Booking) => new Date(slot.date) >= currentDate
    );
    const past = bookings.filter(
      (slot: Booking) => new Date(slot.date) < currentDate
    );

    setAllBookings((prev) => ({
      ...prev,
      [playgroundId]: { upcoming, past },
    }));
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching slots:", error.message);
    }
  }}

    fetchOwnerDetails();
  }, []);

  interface Owner {
    name: string;
  }

  interface Venue {
    _id: string;
    name: string;
    location: string;
    timings: string;
    sports: string;
    price: string;
  }

  interface Booking {
    _id: string;
    playgroundName: string;
    sport: string;
    date: string;
    time: string;
    participants: number;
    slotSize: number;
    players: string[];
  }

  const handleAddVenue = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("No token found in session storage");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/playground/new`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newVenue),
      });

      if (!response.ok) {
        throw new Error("Failed to add new venue");
      }

      const data = await response.json();
      console.log(data);
      setIsAddVenueDialogOpen(false);
      // Optionally, refresh the venues list
      // fetchOwnerDetails();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error adding new venue:", error.message);
      }
    }
  };

  const handleUpdateVenue = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("No token found in session storage");
      return;
    }
  
    if (!venueToUpdate) {
      console.error("No venue selected for update");
      return;
    }
  
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/playground/update?id=${venueToUpdate._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(venueToUpdate),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update venue");
      }
  
      const data = await response.json();
      console.log(data);
      setIsUpdateVenueDialogOpen(false);
      // Optionally, refresh the venues list
      // fetchOwnerDetails();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error updating venue:", error.message);
      }
    }
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
          <Button onClick={() => setIsAddVenueDialogOpen(true)}>Add New Venue</Button>
        </header>

        <div className="space-y-8">
          <Card className="shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Bookings</CardTitle>
              <CardDescription className="text-lg">
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
  {Object.keys(allBookings).map((playgroundId) => (
    <div key={playgroundId} className="space-y-6">
      <h3 className="font-semibold text-xl text-primary mt-4">{venues.find(v => v._id === playgroundId)?.name}</h3>
      {allBookings[playgroundId].upcoming.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {allBookings[playgroundId].upcoming.map((booking) => (
            <Card key={booking._id} className="transition-all duration-200 hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-bold">{booking.playgroundName}</CardTitle>
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                    Upcoming
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm space-x-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium">
                      {format(new Date(booking.date), "MMMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center text-sm space-x-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-medium">{booking.time}</span>
                  </div>
                  <div className="flex items-center text-sm space-x-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="font-medium">
                      {booking.players.length}/{booking.slotSize} players joined
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-50">
          <CardContent className="flex items-center justify-center py-8">
            <p className="text-gray-500">No upcoming bookings to show</p>
          </CardContent>
        </Card>
      )}
    </div>
  ))}
</TabsContent>
<TabsContent value="past">
  {Object.keys(allBookings).map((playgroundId) => (
    <div key={playgroundId} className="space-y-6">
      <h3 className="font-semibold text-xl text-primary mt-4">{venues.find(v => v._id === playgroundId)?.name}</h3>
      {allBookings[playgroundId].past.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {allBookings[playgroundId].past.map((booking) => (
            <Card key={booking._id} className="transition-all duration-200 hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-bold">{booking.playgroundName}</CardTitle>
                  <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
                    Past
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-600">
                      {format(new Date(booking.date), "MMMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center text-sm space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-600">{booking.time}</span>
                  </div>
                  <div className="flex items-center text-sm space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-600">
                      {booking.players.length}/{booking.slotSize} players attended
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-50">
          <CardContent className="flex items-center justify-center py-8">
            <p className="text-gray-500">No past bookings to show</p>
          </CardContent>
        </Card>
      )}
    </div>
  ))}
</TabsContent>

              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Your Venues</CardTitle>
              <CardDescription>Manage your venue listings</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              {venues.map((venue) => (
                <Card key={venue._id} className="transition-all duration-200 hover:shadow-lg">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-bold">{venue.name}</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setVenueToUpdate(venue);
                          setIsUpdateVenueDialogOpen(true);
                        }}
                      >
                        Update Playground Details
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>{venue.timings}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <IndianRupee className="h-4 w-4 text-primary" />
                          <span>{venue.price}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <ArrowRight className="h-4 w-4 text-primary" />
                        <span>{venue.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Users className="h-4 w-4 text-primary" />
                        <span>{venue.sports}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedPlaygroundId(venue._id);
                        setSelectedVenueTiming(venue.timings);
                        setIsDialogOpen(true);
                      }}
                    >
                      Add Slot
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg">
  <CardHeader>
    <CardTitle className="text-2xl font-bold">Analytics Overview</CardTitle>
    <CardDescription>Your venue performance at a glance</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { icon: Calendar, label: "Total Bookings", value: "156" },
        { icon: Users, label: "Unique Customers", value: "89" },
        { icon: IndianRupee, label: "Revenue", value: "₹12,450" },
        { icon: Clock, label: "Avg. Duration", value: "2h 15m" },
      ].map((stat, index) => (
        <Card key={index} className="bg-primary/5">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-2">
              <stat.icon className="h-6 w-6 text-primary" />
              <p className="text-sm font-medium text-gray-600">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-primary">
                {stat.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </CardContent>
</Card>
      </div>

      <CustomDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAddSlot={(slot) => {
          // Handle the slot addition logic here
          console.log("Slot added:", slot);
        }}
        selectedPlaygroundId={selectedPlaygroundId ?? ""}
        timing={selectedVenueTiming}
      />

      <Dialog open={isAddVenueDialogOpen} onOpenChange={setIsAddVenueDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Venue</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={newVenue.name} onChange={(e) => setNewVenue({ ...newVenue, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={newVenue.location} onChange={(e) => setNewVenue({ ...newVenue, location: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="timings">Timings</Label>
              <Input id="timings" value={newVenue.timings} onChange={(e) => setNewVenue({ ...newVenue, timings: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="sports">Sports</Label>
              <Input id="sports" value={newVenue.sports} onChange={(e) => setNewVenue({ ...newVenue, sports: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input id="price" value={newVenue.price} onChange={(e) => setNewVenue({ ...newVenue, price: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Input id="type" value={newVenue.type} onChange={(e) => setNewVenue({ ...newVenue, type: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="imgUrl">Image URL</Label>
              <Input id="imgUrl" value={newVenue.imgUrl} onChange={(e) => setNewVenue({ ...newVenue, imgUrl: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddVenue}>Add Venue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isUpdateVenueDialogOpen} onOpenChange={setIsUpdateVenueDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Venue</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="update-name">Name</Label>
              <Input id="update-name" value={venueToUpdate?.name || ""} onChange={(e) => setVenueToUpdate({ ...venueToUpdate, name: e.target.value, _id: venueToUpdate?._id || "", location: venueToUpdate?.location || "", timings: venueToUpdate?.timings || "", sports: venueToUpdate?.sports || "", price: venueToUpdate?.price || "" })} />
            </div>
            <div>
              <Label htmlFor="update-timings">Timings</Label>
              <Input id="update-timings" value={venueToUpdate?.timings || ""} onChange={(e) => setVenueToUpdate({ ...venueToUpdate, timings: e.target.value, _id: venueToUpdate?._id || "", name: venueToUpdate?.name || "", location: venueToUpdate?.location || "", sports: venueToUpdate?.sports || "", price: venueToUpdate?.price || "" })} />
            </div>
            <div>
              <Label htmlFor="update-sports">Sports</Label>
              <Input id="update-sports" value={venueToUpdate?.sports || ""} onChange={(e) => setVenueToUpdate({ ...venueToUpdate, sports: e.target.value, _id: venueToUpdate?._id || "", name: venueToUpdate?.name || "", location: venueToUpdate?.location || "", timings: venueToUpdate?.timings || "", price: venueToUpdate?.price || "" })} />
            </div>
            <div>
              <Label htmlFor="update-price">Price</Label>
              <Input id="update-price" value={venueToUpdate?.price || ""} onChange={(e) => setVenueToUpdate({ ...venueToUpdate, price: e.target.value, _id: venueToUpdate?._id || "", name: venueToUpdate?.name || "", location: venueToUpdate?.location || "", timings: venueToUpdate?.timings || "", sports: venueToUpdate?.sports || "" })} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateVenue}>Update Venue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
