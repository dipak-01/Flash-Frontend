'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { MapPin, DollarSign, Star, Users, Calendar } from 'lucide-react'

const venues = [
  { id: 1, name: 'City Sports Complex', location: 'Downtown', sports: ['Soccer', 'Basketball', 'Tennis'], price: 50, rating: 4.5, availability: 'High' },
  { id: 2, name: 'Green Field Park', location: 'Suburb', sports: ['Soccer', 'Cricket'], price: 30, rating: 4.2, availability: 'Medium' },
  { id: 3, name: 'Ace Tennis Court', location: 'Westside', sports: ['Tennis'], price: 40, rating: 4.8, availability: 'Low' },
  { id: 4, name: 'Hoops Arena', location: 'Eastside', sports: ['Basketball'], price: 45, rating: 4.3, availability: 'High' },
  { id: 5, name: 'Aqua Center', location: 'North End', sports: ['Swimming'], price: 60, rating: 4.7, availability: 'Medium' },
]

export default function VenueListingPage() {
  const [filteredVenues, setFilteredVenues] = useState(venues)
  const [filters, setFilters] = useState({
    location: '',
    sport: '',
    priceRange: [0, 100],
    availability: ''
  })

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    const filtered = venues.filter(venue => {
      return (
        (!newFilters.location || venue.location.toLowerCase().includes(newFilters.location.toLowerCase())) &&
        (!newFilters.sport || venue.sports.includes(newFilters.sport)) &&
        (venue.price >= newFilters.priceRange[0] && venue.price <= newFilters.priceRange[1]) &&
        (!newFilters.availability || venue.availability === newFilters.availability)
      )
    })
    setFilteredVenues(filtered)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">Find Your Perfect Venue</h1>

        <Card>
          <CardHeader>
            <CardTitle>Filter Venues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                placeholder="Location"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
              <Select onValueChange={(value) => handleFilterChange('sport', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Sport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Soccer">Soccer</SelectItem>
                  <SelectItem value="Basketball">Basketball</SelectItem>
                  <SelectItem value="Tennis">Tennis</SelectItem>
                  <SelectItem value="Cricket">Cricket</SelectItem>
                  <SelectItem value="Swimming">Swimming</SelectItem>
                </SelectContent>
              </Select>
              <div>
                <label className="text-sm font-medium">Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}</label>
                <Slider
                  min={0}
                  max={100}
                  step={10}
                  value={filters.priceRange}
                  onValueChange={(value) => handleFilterChange('priceRange', value)}
                  className="mt-2"
                />
              </div>
              <Select onValueChange={(value) => handleFilterChange('availability', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue) => (
            <Card key={venue.id} className="flex flex-col">
              <img src="/placeholder.svg" alt={venue.name} className="w-full h-48 object-cover rounded-t-lg" />
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{venue.name}</span>
                  <Badge variant={venue.availability === 'High' ? 'default' : venue.availability === 'Medium' ? 'secondary' : 'outline'}>
                    {venue.availability} Availability
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="flex items-center text-gray-600 mb-2">
                  <MapPin className="mr-2 h-4 w-4" /> {venue.location}
                </p>
                <p className="flex items-center text-gray-600 mb-2">
                  <DollarSign className="mr-2 h-4 w-4" /> ${venue.price}/hour
                </p>
                <p className="flex items-center text-yellow-500 mb-2">
                  <Star className="mr-2 h-4 w-4" /> {venue.rating}
                </p>
                <div className="mt-2">
                  {venue.sports.map((sport) => (
                    <Badge key={sport} variant="secondary" className="mr-2 mb-2">
                      {sport}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}