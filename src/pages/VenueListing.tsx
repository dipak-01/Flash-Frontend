'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { MapPin, IndianRupee, Star } from 'lucide-react'
import axios from 'axios'
import { Link } from 'react-router-dom'
export default function VenueListingPage() {
  interface Venue {
    id: string;
    name: string;
    location: string;
    sports: string[];
    price: number;
    rating: number;
    availability: string;
    imgUrl: string;
  }

  const [venues, setVenues] = useState<Venue[]>([])
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([])
  const [filters, setFilters] = useState({
    location: '',
    sport: '',
    priceRange: [0, 10000],
    availability: '',
    name: '' // Add name filter
  })

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/playground/all?page=1`)
      .then(response => {
        const fetchedVenues = response.data.result.map((venue: { _id: string; name: string; location: string; sports: string; price: number; imgUrl: string }) => ({
          id: venue._id,
          name: venue.name,
          location: venue.location,
          sports: venue.sports.split(', '),
          price: venue.price,
          rating: 4.5, // Assuming a default rating as it's not provided
          availability: 'High', // Assuming a default availability as it's not provided
          imgUrl: venue.imgUrl
        }))
        setVenues(fetchedVenues)
        setFilteredVenues(fetchedVenues)
      })
      .catch(error => console.error('Error fetching venues:', error))
  }, [])

  const handleFilterChange = (key:string, value:number[]|string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    const filtered = venues.filter(venue => {
      return (
        (!newFilters.location || venue.location.toLowerCase().includes(newFilters.location.toLowerCase())) &&
        (!newFilters.sport || venue.sports.some(s => s.toLowerCase().includes(newFilters.sport.toLowerCase()))) &&
        (!newFilters.name || venue.name.toLowerCase().includes(newFilters.name.toLowerCase())) &&
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                placeholder="Playground Name"
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
              />
              <Input
                placeholder="Location"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
              <Input
                placeholder="Sport"
                value={filters.sport}
                onChange={(e) => handleFilterChange('sport', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm font-medium">Price Range: {filters.priceRange[0]} - {filters.priceRange[1]}</label>
                <Slider
                  min={0}
                  max={10000}
                  step={100}
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
              <img src={venue.imgUrl || "/placeholder.svg"} alt={venue.name} className="w-full h-48 object-cover rounded-t-lg" />
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
                  <IndianRupee className="mr-2 h-4 w-4" /> {venue.price}/hour
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
              <Button asChild>
      <Link to={`/venue-details/${venue.id}`}>View Details</Link>
    </Button>              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}