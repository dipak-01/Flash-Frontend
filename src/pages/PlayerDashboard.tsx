'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
 import { Calendar, MapPin, Users, Star, Clock, ArrowRight, Search } from 'lucide-react'
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PlayerDashboard() {
  const [activeTab, setActiveTab] = useState('upcoming')

  const upcomingEvents = [
    { id: 1, name: 'Soccer Match', date: '2023-07-15', time: '14:00', location: 'City Park', participants: 22 },
    { id: 2, name: 'Basketball Tournament', date: '2023-07-18', time: '10:00', location: 'Sports Center', participants: 32 },
  ]

  const pastEvents = [
    { id: 3, name: 'Tennis Practice', date: '2023-07-10', time: '16:00', location: 'Tennis Club', participants: 4 },
    { id: 4, name: 'Volleyball Game', date: '2023-07-08', time: '18:00', location: 'Beach Arena', participants: 12 },
  ]

  const recommendedVenues = [
    { id: 1, name: 'Green Field Stadium', sport: 'Soccer', rating: 4.5, distance: '2.5 miles' },
    { id: 2, name: 'Central Court', sport: 'Tennis', rating: 4.8, distance: '1.8 miles' },
    { id: 3, name: 'Aqua Center', sport: 'Swimming', rating: 4.2, distance: '3.2 miles' },
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg" alt="Player" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome, John Doe</h1>
              <p className="text-gray-600">Player since January 2023</p>
            
            </div>
          </div>
          <Button variant="outline">Edit Profile</Button>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Your Events</CardTitle>
              <CardDescription>Manage your upcoming and past events</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming">
                  {upcomingEvents.map((event) => (
                    <Card key={event.id} className="mb-4">
                      <CardHeader>
                        <CardTitle>{event.name}</CardTitle>
                        <CardDescription>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{event.date} at {event.time}</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>{event.participants} participants</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline">View Details</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </TabsContent>
                <TabsContent value="past">
                  {pastEvents.map((event) => (
                    <Card key={event.id} className="mb-4">
                      <CardHeader>
                        <CardTitle>{event.name}</CardTitle>
                        <CardDescription>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{event.date} at {event.time}</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>{event.participants} participants</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline">View Recap</Button>
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
                  <Calendar className="mr-2 h-4 w-4" /> Create New Event
                </Button>
                <Button className="w-full" variant="outline">
                  <Search className="mr-2 h-4 w-4" /> Find Nearby Venues
                </Button>
                <Button className="w-full" variant="outline">
                  <Users className="mr-2 h-4 w-4" /> Join a Team
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended Venues</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {recommendedVenues.map((venue) => (
                  <div key={venue.id} className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{venue.name}</h3>
                      <p className="text-sm text-gray-600">{venue.sport} • {venue.distance}</p>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span>{venue.rating}</span>
                    </div>
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
            <CardTitle>Your Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {[
                { icon: Calendar, label: 'Events Attended', value: 12 },
                { icon: Users, label: 'Teams Joined', value: 3 },
                { icon: MapPin, label: 'Venues Visited', value: 8 },
                { icon: Star, label: 'Average Rating', value: '4.7' },
                { icon: Clock, label: 'Hours Played', value: 36 },
              ].map((stat, index) => (
                <Card key={index} className="flex-shrink-0 w-40">
                  <CardContent className="p-4 text-center">
                    <stat.icon className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}