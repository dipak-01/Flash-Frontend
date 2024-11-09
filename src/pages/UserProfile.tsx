"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Star, Trophy, Activity, Edit } from "lucide-react";

export default function UserProfilePage() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    location: "",
    bio: "",
    sports: [],
    userhandle: "", // Added userhandle property
    dob: "", // Added dob property
    phone: "",
    achievements: [
      {
        id: 1,
        title: "Tournament Winner",
        description: "First place in local soccer tournament",
        date: "2023-05-15",
      },
      {
        id: 2,
        title: "MVP",
        description: "Most Valuable Player in basketball league",
        date: "2023-03-20",
      },
    ],
    upcomingEvents: [
      {
        id: 1,
        title: "Soccer Match",
        date: "2023-07-20",
        location: "Central Park",
      },
      {
        id: 2,
        title: "Basketball Practice",
        date: "2023-07-22",
        location: "Community Center",
      },
    ],
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    fetch(`${import.meta.env.VITE_BACKEND_URL}/player/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Log the fetched data
        const userData = data[0]; // Assuming the data is an array and we need the first element
        setUser((prevUser) => ({
          ...prevUser,
          name: userData.name,
          email: userData.email,
          location: "Unknown", // No location provided in the data
          bio: "", // No bio provided in the data
          sports: [], // No sports provided in the data
          phone: userData.phone,
          userhandle: userData.ownerHandle,
          dob: userData.DOB,
        }));
      });
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically send the updated user data to your backend
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg" alt={user.name} />
                <AvatarFallback>{user.name}</AvatarFallback>
              </Avatar>
              {isEditing ? (
                <Input
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="text-2xl font-bold text-center"
                />
              ) : (
                <h1 className="text-2xl font-bold">{user.name}</h1>
              )}
              <div className="flex space-x-2">
                {user.sports.map((sport) => (
                  <Badge key={sport} variant="secondary">
                    {sport}
                  </Badge>
                ))}
              </div>
              {isEditing ? (
                <Textarea
                  value={user.bio}
                  onChange={(e) => setUser({ ...user, bio: e.target.value })}
                  className="mt-2 text-center"
                />
              ) : (
                <p className="text-center text-gray-600 mt-2">{user.bio}</p>
              )}
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                {isEditing ? (
                  <Input
                    value={user.location}
                    onChange={(e) =>
                      setUser({ ...user, location: e.target.value })
                    }
                    className="w-40"
                  />
                ) : (
                  <span>{user.location}</span>
                )}
              </div>
              <div className="flex items-center text-gray-600">
                <span className="mr-2">Username:</span>
                {isEditing ? (
                  <Input
                    value={user.userhandle}
                    onChange={(e) =>
                      setUser({ ...user, userhandle: e.target.value })
                    }
                    className="w-40"
                  />
                ) : (
                  <span>{user.userhandle}</span>
                )}
              </div>
              <div className="flex items-center text-gray-600">
                <span className="mr-2">Phone:</span>
                {isEditing ? (
                  <Input
                    value={user.phone}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    className="w-40"
                  />
                ) : (
                  <span>{user.phone}</span>
                )}
              </div>
              <div className="flex items-center text-gray-600">
                <span className="mr-2">DOB:</span>
                {isEditing ? (
                  <Input
                    value={user.dob}
                    onChange={(e) => setUser({ ...user, dob: e.target.value })}
                    className="w-40"
                  />
                ) : (
                  <span>{user.dob}</span>
                )}
              </div>
              <div className="flex items-center text-gray-600">
                <span className="mr-2">Email:</span>
                {isEditing ? (
                  <Input
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="w-40"
                  />
                ) : (
                  <span>{user.email}</span>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            {isEditing ? (
              <Button onClick={handleSave}>Save Profile</Button>
            ) : (
              <Button onClick={handleEdit} variant="outline">
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            )}
          </CardFooter>
        </Card>

        <Tabs defaultValue="achievements">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>
          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>
                  Your sports milestones and awards
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="mb-4 pb-4 border-b last:border-b-0"
                  >
                    <div className="flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                      <h3 className="font-semibold">{achievement.title}</h3>
                    </div>
                    <p className="text-gray-600 mt-1">
                      {achievement.description}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {achievement.date}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>
                  Your scheduled games and practices
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user.upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="mb-4 pb-4 border-b last:border-b-0"
                  >
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                      <h3 className="font-semibold">{event.title}</h3>
                    </div>
                    <p className="text-gray-600 mt-1">{event.date}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {event.location}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Player Stats</CardTitle>
                <CardDescription>Your performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                    <Activity className="h-8 w-8 text-green-500 mb-2" />
                    <span className="text-2xl font-bold">87%</span>
                    <span className="text-sm text-gray-600">Win Rate</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                    <Star className="h-8 w-8 text-yellow-500 mb-2" />
                    <span className="text-2xl font-bold">4.8</span>
                    <span className="text-sm text-gray-600">
                      Average Rating
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                    <Trophy className="h-8 w-8 text-purple-500 mb-2" />
                    <span className="text-2xl font-bold">12</span>
                    <span className="text-sm text-gray-600">Trophies</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                    <Calendar className="h-8 w-8 text-blue-500 mb-2" />
                    <span className="text-2xl font-bold">5</span>
                    <span className="text-sm text-gray-600">
                      Upcoming Matches
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
