'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { MapPin, IndianRupee, Star } from 'lucide-react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useParams } from "react-router-dom"

export default function VenueDetailPage() {
  const { id } = useParams<{ id: string }>()
  console.log(id);
  const [date, setDate] = useState<Date | undefined>(new Date())
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
  interface Review {
    id: string;
    user: string;
    rating: number;
    date: string;
    comment: string;
  }

  const [reviews, setReviews] = useState<Review[]>([])
  const [slots, setSlots] = useState<{ time: string, date: string }[]>([])

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
      // Assuming reviews are part of the fetched data
      setReviews(data.reviews || [])
    }
    async function fetchSlots() {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/slot/all?playgroundId=${id}`)
      const data = await response.json()
      console.log(data);
      setSlots(data.map((slot: { time: string, date: string }) => ({ time: slot.time, date: slot.date })))
    }
    fetchVenueDetails()
    fetchSlots()
  }, [id])

  if (!venue) {
    return <div>Loading...</div>
  }

  const isSlotAvailable = (slotDate: string) => {
    const slotDateTime = new Date(slotDate).getTime()
    const currentDateTime = new Date().getTime()
    return slotDateTime >= currentDateTime
  }

  const formatTime = (time: string, date: string) => {
    const [hour, minute] = time.split(':')
    const hourInt = parseInt(hour)
    const ampm = hourInt >= 12 ? 'PM' : 'AM'
    const formattedHour = hourInt % 12 || 12
    return `${date} ${formattedHour}:${minute} ${ampm}`
  }

  const filteredSlots = slots.filter(slot => {
    const slotDate = new Date(slot.date).toDateString()
    const selectedDate = date?.toDateString()
    return slotDate === selectedDate
  })

  const bookSlot = async (slotId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/player/book?slotId=${slotId}`, {
        method: 'POST',
      });
      if (response.ok) {
        alert('Slot booked successfully!');
      } else {
        alert('Failed to book slot.');
      }
    } catch (error) {
      console.error('Error booking slot:', error);
      alert('An error occurred while booking the slot.');
    }
  };

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

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Booking</CardTitle>
              <CardDescription>Select a date and time to book this venue</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="calendar">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="calendar">Calendar</TabsTrigger>
                  <TabsTrigger value="timeslots">Time Slots</TabsTrigger>
                </TabsList>
                <TabsContent value="calendar">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </TabsContent>
                <TabsContent value="timeslots">
                  <div className="grid grid-cols-3 gap-2">
                    {filteredSlots.map(({ time, date }) => (
                      <Button
                        key={time}
                        variant="outline"
                        className="w-full"
                        disabled={!isSlotAvailable(date)}
                        onClick={() => bookSlot(time)}
                      >
                        {formatTime(time, date)}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Book Now</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {venue.amenities.map((amenity: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7"></path></svg>
                    {amenity}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {reviews.map((review) => (
              <div key={review.id} className="mb-4 pb-4 border-b last:border-b-0">
                <div className="flex items-center mb-2">
                  <Avatar className="h-10 w-10 mr-2">
                    <AvatarFallback>{review.user[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{review.user}</p>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span>{review.rating}</span>
                    </div>
                  </div>
                  <span className="ml-auto text-sm text-gray-500">{review.date}</span>
                </div>
                <p>{review.comment}</p>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Write a Review</Button>
          </CardFooter>
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