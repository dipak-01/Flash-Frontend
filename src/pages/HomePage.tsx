import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calendar, MapPin, Users, Search } from "lucide-react";
 
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
     

      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Connect, Play, and Book with Flash
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The all-in-one platform for sports enthusiasts to form teams, book
            venues, and connect with fellow players.
          </p>
          <div className="flex justify-center space-x-4 mb-8">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Join as Player <ArrowRight className="ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              List a Venue <MapPin className="ml-2" />
            </Button>
          </div>
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Find a Venue</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter location or sport"
                  className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Search className="mr-2" /> Search
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 text-blue-600" />
                Connect with Players
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Find and join sports groups that match your interests and skill
                level.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 text-blue-600" />
                Book Venues Easily
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Discover and reserve top-notch sports facilities in your area
                with just a few clicks.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 text-blue-600" />
                Organize Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Create and manage sports events, from casual meetups to
                tournaments.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
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
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mb-2">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gray-100 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join Flash today and revolutionize your sports experience.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Sign Up Now <ArrowRight className="ml-2" />
          </Button>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Flash</h3>
              <p className="text-gray-400">
                Connecting sports enthusiasts and venues.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick as</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/about" className="text-gray-400 hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/venues" className="text-gray-400 hover:text-white">
                    Find Venues
                  </a>
                </li>
                <li>
                  <a href="/groups" className="text-gray-400 hover:text-white">
                    Join Groups
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-gray-400 hover:text-white">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/terms" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                {/* Add social media icons here */}
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Flash Sports Platform. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
