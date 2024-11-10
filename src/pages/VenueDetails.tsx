'use client'

import { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, IndianRupee, Star, Users, Clock, Calendar } from 'lucide-react'
import { useParams } from "react-router-dom"
// import { loadStripe } from '@stripe/stripe-js';

interface Slot {
  _id: string;
  playgroundId: string;
  ownerId: string;
  time: string;
  date: string;
  players: string[];
  slotSize: number;
  playgroundName: string;
  price: number; // Add price to Slot interface
}

interface Venue {
  imgUrl: string;
  name: string;
  description: string;
  sports: string;
  location: string;
  price: number;
  rating: number;
  capacity: number;
  openingHours: string;
  amenities: string[];
  contactPhone: string;
  contactEmail: string;
}

export default function VenueDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [venue, setVenue] = useState<Venue | null>(null)
  const [slots, setSlots] = useState<Slot[]>([])

  const fetchSlots = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/slot/all?playgroundId=${id}`)
      const data = await response.json()
      setSlots(Array.isArray(data) ? data : data.slots || [])
    } catch (error) {
      console.error('Error fetching slots:', error)
      setSlots([])
    }
  }

  useEffect(() => {
    async function fetchVenueDetails() {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/playground/detail?id=${id}`)
      const data = await response.json()
      setVenue({
        ...data.result,
        rating: 4.5, // Hardcoded value
        capacity: 100, // Hardcoded value
        openingHours: 'Mon-Fri: 6am-10pm, Sat-Sun: 8am-8pm', // Hardcoded value
        amenities: ['Changing Rooms', 'Parking', 'Floodlights', 'Equipment Rental'], // Hardcoded value
        contactPhone: '+1 (555) 123-4567', // Hardcoded value
        contactEmail: 'info@citysportscomplex.com' // Hardcoded value
      })
    }

    fetchVenueDetails()
    fetchSlots()
  }, [id])

  if (!venue) return <div className="min-h-screen flex items-center justify-center text-[#111827]">Loading...</div>

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getRemainingSpots = (slot: Slot) => {
    return typeof slot.slotSize === 'number' && Array.isArray(slot.players) 
      ? slot.slotSize - slot.players.length 
      : 0;
  }

  const bookSlot = async (slotId: string) => {
    try {
      const token = sessionStorage.getItem('token');
       const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/player/book?slotId=${slotId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.ok) {
        toast.success('Slot booked successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        await fetchSlots()
      } else {
        toast.error('Failed to book slot. Please try again.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error('Error booking slot:', error)
      toast.error('An error occurred while booking the slot.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }

  const handlePayment = async (slotId: string) => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        toast.error('Please login to book a slot');
        return;
      }
      
      // Direct booking without payment
      await bookSlot(slotId);
      
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to book slot. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4">
      <ToastContainer />
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg">
          <CardContent className="p-0">
            <img src={venue.imgUrl || "/placeholder.svg"} alt={venue.name} className="w-full h-64 object-cover" />
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-2 text-[#111827]">{venue.name}</h1>
              <p className="text-[#9CA3AF] mb-4">{venue.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {venue.sports.split(', ').map((sport: string) => (
                  <Badge key={sport} variant="secondary" className="bg-[#FFD60A] text-[#111827]">{sport}</Badge>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-[#FF3B30]" />
                  <span className="text-[#111827]">{venue.location}</span>
                </div>
                <div className="flex items-center">
                  <IndianRupee className="h-5 w-5 mr-2 text-[#FF3B30]" />
                  <span className="text-[#111827]">₹{venue.price} per hour</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-[#FFD60A]" />
                  <span className="text-[#111827]">{venue.rating} Rating</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-[#FF3B30]" />
                  <span className="text-[#111827]">Capacity: {venue.capacity} people</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-[#FF3B30]" />
                  <span className="text-[#111827]">{venue.openingHours}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 ease-in-out hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#111827]">Available Slots</CardTitle>
            <CardDescription className="text-[#9CA3AF]">Book your preferred time slot</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {slots.map((slot) => (
                <Card key={slot._id} className="p-4 transition-all duration-300 ease-in-out hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#FF3B30]" />
                        <span className="font-semibold text-[#111827]">{slot.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#FF3B30]" />
                        <span className="text-[#111827]">{formatDate(slot.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-[#FF3B30]" />
                        <span className="text-[#111827]">{getRemainingSpots(slot)} spots remaining</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handlePayment(slot._id)}
                      disabled={getRemainingSpots(slot) === 0}
                      className="bg-[#FFD60A] text-[#111827] hover:bg-[#FFD60A]/90 transition-all duration-300 ease-in-out hover:scale-105"
                    >
                      {getRemainingSpots(slot) === 0 ? 'Full' : 'Book Now'}
                    </Button>
                  </div>
                </Card>
              ))}
              {slots.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-[#9CA3AF] mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-[#111827]">No Slots Available</h3>
                  <p className="text-[#9CA3AF] mb-4">
                    Currently there are no available slots for this venue. 
                    New slots are usually added regularly.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.reload()}
                    className="border-[#000000] text-[#000000] hover:bg-[#000000] hover:text-white transition-all duration-300 ease-in-out hover:scale-105"
                  >
                    Refresh Slots
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 ease-in-out hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#111827]">Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="flex items-center text-[#111827]">
                <p className="mr-2 h-5 w-5 text-[#FF3B30]" /> {venue.contactPhone}
              </p>
              <p className="flex items-center text-[#111827]">
                <p className="mr-2 h-5 w-5 text-[#FF3B30]" /> {venue.contactEmail}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full border-[#000000] text-[#000000] hover:bg-[#000000] hover:text-white transition-all duration-300 ease-in-out hover:scale-105"
            >
              Contact Venue
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}