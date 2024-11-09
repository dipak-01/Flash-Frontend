'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, IndianRupee, Star, Users, Clock, Calendar } from 'lucide-react'
import { useParams } from "react-router-dom"

interface Slot {
  _id: string;
  playgroundId: string;
  ownerId: string;
  time: string;
  date: string;
  players: string[];
  slotSize: number;
  playgroundName: string;
}

export default function VenueDetailPage() {
  const { id } = useParams<{ id: string }>()
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

  if (!venue) return <div>Loading...</div>

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
      console.log(slotId, token);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/player/book?slotId=${slotId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
       
      });
      if (response.ok) {
        alert('Slot booked successfully!')
        // Refresh slots after successful booking
        await fetchSlots()
      } else {
        alert('Failed to book slot. Please try again.')
      }
    } catch (error) {
      console.error('Error booking slot:', error)
      alert('An error occurred while booking the slot.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardContent className="p-0">
            <img src={venue.imgUrl || "/placeholder.svg"} alt={venue.name} className="w-full h-64 object-cover rounded-t-lg" />
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-2">{venue.name}</h1>
              <p className="text-gray-600 mb-4">{venue.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {venue.sports.split(', ').map((sport: string) => (
                  <Badge key={sport} variant="secondary">{sport}</Badge>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                  <span>{venue.location}</span>
                </div>
                <div className="flex items-center">
                  <IndianRupee className="h-5 w-5 mr-2 text-gray-500" />
                  <span>₹{venue.price} per hour</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  <span>{venue.rating} Rating</span>
                </div>
                <div className="flex items-center">
                  <p className="h-5 w-5 mr-2 text-gray-500" />
                  <span>Capacity: {venue.capacity} people</span>
                </div>
                <div className="flex items-center">
                  <p className="h-5 w-5 mr-2 text-gray-500" />
                  <span>{venue.openingHours}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Slots</CardTitle>
            <CardDescription>Book your preferred time slot</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {slots.map((slot) => (
                <Card key={slot._id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="font-semibold">{slot.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(slot.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{getRemainingSpots(slot)} spots remaining</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => bookSlot(slot._id)}
                      disabled={getRemainingSpots(slot) === 0}
                    >
                      {getRemainingSpots(slot) === 0 ? 'Full' : 'Book Now'}
                    </Button>
                  </div>
                </Card>
              ))}
              {slots.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Slots Available</h3>
                  <p className="text-gray-500 mb-4">
                    Currently there are no available slots for this venue. 
                    New slots are usually added regularly.
                  </p>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Refresh Slots
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="flex items-center">
                <p className="mr-2 h-5 w-5 text-gray-500" /> {venue.contactPhone}
              </p>
              <p className="flex items-center">
                <p  className="mr-2 h-5 w-5 text-gray-500" /> {venue.contactEmail}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Contact Venue</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}