"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calendar, MapPin, Users, Search } from "lucide-react";
import { useNavigate } from 'react-router-dom';
 
export default function HomePage() {
  const navigate = useNavigate();
 
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const location = (event.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
    navigate(`/venue-listing?location=${location}`);
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
     
      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#111827] mb-4">
            Connect, Play, and Book with Flash
          </h1>
          <p className="text-xl text-[#111827] mb-8 max-w-2xl mx-auto">
            The all-in-one platform for sports enthusiasts to form teams, book
            venues, and connect with fellow players.
          </p>
          <div className="flex justify-center space-x-4 mb-8">
            <Button
              size="lg"
              className="bg-[#FF3B30] hover:bg-red-700 text-white transform transition duration-300 ease-in-out hover:scale-105"
              onClick={() => navigate('/signup')}
            >
              Join as Player <ArrowRight className="ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#000000] text-[#000000] hover:bg-[#000000] hover:text-white transform transition duration-300 ease-in-out hover:scale-105"
              onClick={() => navigate('/signup')}
            >
              List a Venue <MapPin className="ml-2" />
            </Button>
          </div>
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-[#111827]">Find a Venue</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="flex space-x-2" onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  name="search"
                  placeholder="Enter location"
                  className="flex-1 px-3 py-2 border border-[#9CA3AF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF3B30] transition duration-300 text-[#111827] placeholder:text-[#9CA3AF] focus:bg-white"
                />
                <Button
                  type="submit"
                  className="bg-[#FF3B30] hover:bg-red-700 text-white transform transition duration-300 ease-in-out hover:scale-105"
                >
                  <Search className="mr-2" /> Search
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="transition-all duration-300 ease-in-out hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-[#111827]">
                <Users className="mr-2 text-[#FF3B30]" />
                Connect with Players
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#111827]">
                Find and join sports groups that match your interests and skill
                level.
              </p>
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 ease-in-out hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-[#111827]">
                <MapPin className="mr-2 text-[#FF3B30]" />
                Book Venues Easily
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#111827]">
                Discover and reserve top-notch sports facilities in your area
                with just a few clicks.
              </p>
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 ease-in-out hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-[#111827]">
                <Calendar className="mr-2 text-[#FF3B30]" />
                Organize Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#111827]">
                Create and manage sports events, from casual meetups to
                tournaments.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#111827] mb-4">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Sign Up",
                description: "Create your player or venue owner account",
              },
              {
                step: 2,
                title: "Find or List",
                description: "Search for venues or list your facility",
              },
              {
                step: 3,
                title: "Connect",
                description: "Join groups or accept bookings",
              },
              {
                step: 4,
                title: "Play",
                description: "Enjoy your game or host events",
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#FF3B30] text-white flex items-center justify-center text-xl font-bold mb-2">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-[#111827] mb-2">{item.title}</h3>
                <p className="text-[#111827]">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-lg p-8 text-center shadow-md">
          <h2 className="text-3xl font-bold text-[#111827] mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-[#111827] mb-8">
            Join Flash today and revolutionize your sports experience.
          </p>
          <Button
            size="lg"
            className="bg-[#FFD60A] text-[#111827] hover:bg-yellow-500 transform transition duration-300 ease-in-out hover:scale-105"
            onClick={() => navigate('/signup')}
          >
            Sign Up Now <ArrowRight className="ml-2" />
          </Button>
        </section>
      </main>

       
    </div>
  );
}