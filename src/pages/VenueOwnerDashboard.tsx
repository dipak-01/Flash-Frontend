"use client";
import CustomDialog from "@/components/scratch/CustomDialog";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from 'react-toastify';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Filter } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  // Add loading states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
  const [venueFilter, setVenueFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Add analytics data state
  interface AnalyticsData {
    month: string;
    bookings: number;
    revenue: number;
  }

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);

  useEffect(() => {
    async function fetchOwnerDetails() {
      setIsLoading(true);
      setError(null);
      const token = sessionStorage.getItem("token");
      
      if (!token) {
        setError("No authentication token found");
        setIsLoading(false);
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

        const data = await response.json();
         // Debug logs
 
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch owner details");
        }

        // Check if data has the expected structure
        if (!data || (!Array.isArray(data) && !data.owner)) {
          throw new Error("Invalid owner data format");
        }

        // Handle both array and object responses
        const ownerData = Array.isArray(data) ? data[0] : data.owner;

        if (!ownerData || !ownerData._id) {
          throw new Error("Owner data is missing required fields");
        }

         setOwner(ownerData);

        // Fetch venues with the owner ID
        await fetchVenues(ownerData._id, token);
      } catch (error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        console.error("Error in fetchOwnerDetails:", message);
        setError(message);
      } finally {
        setIsLoading(false);
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

        const data = await response.json();
        
        // Debug logs
 
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch venues");
        }

        if (!data.result || !Array.isArray(data.result)) {
          throw new Error("Invalid venues data format");
        }

        setVenues(data.result);

        // Fetch slots for each venue
        await Promise.all(data.result.map((venue: Venue) => fetchSlots(venue._id)));
      } catch (error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        console.error("Error in fetchVenues:", message);
        setError(message);
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

  useEffect(() => {
    const calculateAnalytics = () => {
      const analytics: { [key: string]: { bookings: number; revenue: number } } = {};
      
      // Process all bookings
      Object.values(allBookings).forEach(({ upcoming, past }) => {
        [...upcoming, ...past].forEach(booking => {
          const date = new Date(booking.date);
          const monthYear = format(date, 'MMM yyyy');
          
          if (!analytics[monthYear]) {
            analytics[monthYear] = { bookings: 0, revenue: 0 };
          }
          
          analytics[monthYear].bookings += 1;
          // Assuming venue price is available in the booking or calculating from venues
          const venue = venues.find(v => v.name === booking.playgroundName);
          if (venue) {
            analytics[monthYear].revenue += parseInt(venue.price);
          }
        });
      });

      // Convert to array format for chart
      const analyticsArray = Object.entries(analytics).map(([month, data]) => ({
        month,
        bookings: data.bookings,
        revenue: data.revenue
      }));

      setAnalyticsData(analyticsArray.sort((a, b) => 
        new Date(a.month).getTime() - new Date(b.month).getTime()
      ));
    };

    calculateAnalytics();
  }, [allBookings, venues]);

  interface Owner {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string; // Add avatar field
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
      toast.success('Venue added successfully!');
      setIsAddVenueDialogOpen(false);
      // Optionally, refresh the venues list
      // fetchOwnerDetails();
    } catch (error) {
      toast.error('Failed to add venue. Please try again.');
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
      toast.success('Venue updated successfully!');
      setIsUpdateVenueDialogOpen(false);
      // Optionally, refresh the venues list
      // fetchOwnerDetails();
    } catch (error) {
      toast.error('Failed to update venue. Please try again.');
      if (error instanceof Error) {
        console.error("Error updating venue:", error.message);
      }
    }
  };

  // Filter and sort venues
  const filteredVenues = useMemo(() => {
    let filtered = [...venues];
    
    if (venueFilter !== 'all') {
      filtered = filtered.filter(venue => 
        venue.sports.toLowerCase().includes(venueFilter.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      }
      return b.name.localeCompare(a.name);
    });
  }, [venues, venueFilter, sortOrder]);

  // Update the calendar events formatting
  const calendarEvents = useMemo(() => {
    const events: { title: string; date: string; time: string; backgroundColor: string; borderColor: string; textColor: string; extendedProps: { time: string } }[] = [];
    for (const playgroundId in allBookings) {
      allBookings[playgroundId].upcoming.forEach(booking => {
        events.push({
          title: booking.playgroundName,
          date: booking.date,
          time: booking.time, // Add time property
          backgroundColor: '#FFD60A',
          borderColor: '#FFB100',
          textColor: '#111827',
          extendedProps: {
            time: booking.time
          }
        });
      });
    }
    return events;
  }, [allBookings]);

  // Add the renderEventContent function
  const renderEventContent = (eventInfo: { event: { title: string; extendedProps: { time: string } } }) => {
    return (
      <div className="flex flex-col p-1">
        <div className="font-semibold text-xs">{eventInfo.event.title}</div>
        <div className="text-xs opacity-75">{eventInfo.event.extendedProps.time}</div>
      </div>
    );
  };

  // Add loading and error states to the return JSX
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-2 sm:p-4">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-8">
        {/* Header */}
        <header className="bg-white rounded-lg shadow p-3 sm:p-6 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
              <AvatarImage src={owner?.avatar || "/placeholder-avatar.png"} alt={owner?.name || "Owner"} />
              <AvatarFallback>
                {owner?.name?.split(" ").map((n) => n[0]).join("") || "O"}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-[#111827]">Welcome, {owner?.name}</h1>
              <p className="text-sm sm:text-base text-gray-600">Venue Owner since March 2022</p>
            </div>
          </div>
          <Button className="w-full sm:w-auto bg-[#FFD60A] text-[#111827] hover:bg-[#FFC107]/90" onClick={() => setIsAddVenueDialogOpen(true)}>
            Add New Venue
          </Button>
        </header>

        <div className="flex flex-col space-y-4 sm:space-y-8">
          {/* Bookings Card */}
          <Card className="shadow-lg rounded-lg bg-white">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-[#111827]">Bookings</CardTitle>
              <CardDescription className="text-base sm:text-lg text-[#353943]">
                Manage your upcoming and past bookings
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 sm:p-6">
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <div className="min-w-[320px] sm:min-w-[800px]">
                  <Tabs defaultValue="upcoming" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                      <TabsTrigger value="past">Past</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upcoming">
  {Object.keys(allBookings).length === 0 ? (
    <Card className="bg-gray-50">
      <CardContent className="flex items-center justify-center py-4">
        <p className="text-gray-500">No venues have any bookings</p>
      </CardContent>
    </Card>
  ) : (
    Object.keys(allBookings).map((playgroundId) => {
      const venue = venues.find(v => v._id === playgroundId);
      if (!venue || allBookings[playgroundId].upcoming.length === 0) return null;

      return (
        <Card key={playgroundId} className="mb-4 border-none shadow-none">
          <CardContent className="p-2">
            <div className="overflow-x-auto">
              <div className="flex gap-3 p-2">
                {allBookings[playgroundId].upcoming.map((booking) => (
                  <div key={booking._id}
                       className="w-[260px] bg-white rounded-lg border hover:shadow-lg transition-all duration-300 flex-shrink-0">
                    <div className="p-3 border-b">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">{venue.name}</h3>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">
                          Upcoming
                        </span>
                      </div>
                    </div>
                    <div className="p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        <p className="text-sm text-gray-800">
                          {format(new Date(booking.date), "MMMM d, yyyy")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-600" />
                        <p className="text-sm text-gray-800">{booking.time}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-600" />
                        <p className="text-sm text-gray-800">
                          {booking.players.length} / {booking.slotSize} players joined
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      );
    })
  )}
</TabsContent>

<TabsContent value="past">
  {Object.keys(allBookings).length === 0 ? (
    <Card className="bg-gray-50">
      <CardContent className="flex items-center justify-center py-4">
        <p className="text-gray-500">No past bookings found</p>
      </CardContent>
    </Card>
  ) : (
    Object.keys(allBookings).map((playgroundId) => {
      const venue = venues.find(v => v._id === playgroundId);
      if (!venue || allBookings[playgroundId].past.length === 0) return null;

      return (
        <Card key={playgroundId} className="mb-4 border-none shadow-none">
          <CardContent className="p-2">
            <div className="overflow-x-auto">
              <div className="flex gap-3 p-2">
                {allBookings[playgroundId].past.map((booking) => (
                  <div key={booking._id}
                       className="w-[260px] bg-white rounded-lg border hover:shadow-lg transition-all duration-300 flex-shrink-0">
                    <div className="p-3 border-b">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-700">{venue.name}</h3>
                        <span className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded-full">
                          Past
                        </span>
                      </div>
                    </div>
                    <div className="p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <p className="text-sm text-gray-700">
                          {format(new Date(booking.date), "MMMM d, yyyy")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <p className="text-sm text-gray-700">{booking.time}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <p className="text-sm text-gray-700">
                          {booking.players.length} / {booking.slotSize} players joined
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      );
    })
  )}
</TabsContent>

                  </Tabs>
                </div>
              </div>
            </CardContent>
          </Card>

         
          <Card className="shadow-lg rounded-lg">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
              <CardTitle className="text-xl sm:text-2xl font-bold">Your Venues</CardTitle>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <Select value={venueFilter} onValueChange={setVenueFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by sport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sports</SelectItem>
                    <SelectItem value="football">Football</SelectItem>
                    <SelectItem value="cricket">Cricket</SelectItem>
                    <SelectItem value="basketball">Basketball</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <div className="min-w-[320px] grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 p-2 sm:p-0">
                  {filteredVenues.map((venue) => (
                    <Card key={venue._id} className="transition-all duration-200 hover:shadow-lg">
                      <CardHeader className="pb-2">
                        <div className="flex flex-col sm:flex-row justify-between items-start space-y-2 sm:space-y-0">
                          <CardTitle className="text-lg font-bold">{venue.name}</CardTitle>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto border-[#FF3B30] text-[#FF3B30] hover:bg-[#FF3B30]/10"
                            onClick={() => {
                              setVenueToUpdate(venue);
                              setIsUpdateVenueDialogOpen(true);
                            }}
                          >
                            Update Details
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
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics section */}
        <div className="space-y-4 sm:space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Booking Analytics</CardTitle>
            </CardHeader>
            <CardContent className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="bookings" stroke="#FFD60A" name="Bookings" />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#111827" name="Revenue (₹)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Booking Calendar</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="min-w-[320px]">
                <FullCalendar
                  plugins={[dayGridPlugin]}
                  initialView="dayGridMonth"
                  events={calendarEvents}
                  height={window.innerWidth < 640 ? "400px" : "500px"}
                  eventContent={renderEventContent}
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth'
                  }}
                  eventTimeFormat={{
                    hour: 'numeric',
                    minute: '2-digit',
                    meridiem: 'short'
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl font-bold">Analytics Overview</CardTitle>
              <CardDescription>Your venue performance at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
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
            <Button className="bg-[#FFD60A] text-[#111827] hover:bg-[#FFC107]/90" onClick={handleAddVenue}>Add Venue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isUpdateVenueDialogOpen} onOpenChange={setIsUpdateVenueDialogOpen}>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
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
            <Button className="bg-[#FFD60A] text-[#111827] hover:bg-[#FFC107]/90" onClick={handleUpdateVenue}>Update Venue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  );
}

