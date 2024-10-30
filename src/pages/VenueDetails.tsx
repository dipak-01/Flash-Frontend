'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { MapPin, DollarSign, Star, Users, Clock, Phone, Mail, Calendar as CalendarIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function VenueDetailPage({ params=1 }: { params: { id: string } }) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Mock venue data
  const venue = {
    id: params.id,
    name: 'City Sports Complex',
    location: '123 Main St, Cityville',
    sports: ['Soccer', 'Basketball', 'Tennis'],
    price: 50,
    rating: 4.5,
    capacity: 100,
    amenities: ['Changing Rooms', 'Parking', 'Floodlights', 'Equipment Rental'],
    contactPhone: '+1 (555) 123-4567',
    contactEmail: 'info@citysportscomplex.com',
    description: 'State-of-the-art sports facility offering multiple courts and fields for various sports. Ideal for team practices, tournaments, and casual play.',
    openingHours: 'Mon-Fri: 6am-10pm, Sat-Sun: 8am-8pm',
  }

  const reviews = [
    { id: 1, user: 'John D.', rating: 5, comment: 'Excellent facilities and friendly staff. Highly recommended!', date: '2023-06-15' },
    { id: 2, user: 'Sarah M.', rating: 4, comment: 'Great place for team practice. Could use more parking spaces.', date: '2023-06-10' },
    { id: 3, user: 'Mike R.', rating: 4.5, comment: 'Clean and well-maintained. Booking process was smooth.', date: '2023-06-05' },
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardContent className="p-0">
            <img src="/placeholder.svg" alt={venue.name} className="w-full h-64 object-cover rounded-t-lg" />
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-2">{venue.name}</h1>
              <p className="text-gray-600 mb-4">{venue.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {venue.sports.map((sport) => (
                  <Badge key={sport} variant="secondary">{sport}</Badge>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                  <span>{venue.location}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-gray-500" />
                  <span>${venue.price} per hour</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  <span>{venue.rating} Rating</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-gray-500" />
                  <span>Capacity: {venue.capacity} people</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-gray-500" />
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
                    {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((time) => (
                      <Button key={time} variant="outline" className="w-full">
                        {time}
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
                {venue.amenities.map((amenity, index) => (
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
                <Phone className="mr-2 h-5 w-5 text-gray-500" /> {venue.contactPhone}
              </p>
              <p className="flex items-center">
                <Mail  className="mr-2 h-5 w-5 text-gray-500" /> {venue.contactEmail}
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