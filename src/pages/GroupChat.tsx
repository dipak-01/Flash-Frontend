"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { CalendarDays, Send, Users, Settings, PlusCircle } from "lucide-react";

export default function GroupChatPage({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "John Doe",
      message: "Hey everyone! Whos up for a game this weekend?",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      user: "Jane Smith",
      message: "Im in! What time were you thinking?",
      timestamp: "10:32 AM",
    },
    {
      id: 3,
      user: "Mike Johnson",
      message: "Saturday afternoon works best for me.",
      timestamp: "10:35 AM",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          user: "You",
          message: newMessage,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setNewMessage("");
    }
  };

  const groupInfo = {
    name: "Soccer Enthusiasts",
    members: 28,
    sport: "Soccer",
    nextEvent: "Saturday, 2:00 PM at City Park",
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">
              {groupInfo.name}
            </CardTitle>
            <Badge variant="secondary">{groupInfo.sport}</Badge>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="chat">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
              </TabsList>
              <TabsContent value="chat" className="space-y-4">
                <div className="h-[calc(70vh-100px)] overflow-y-auto space-y-4 p-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.user === "You" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex ${
                          msg.user === "You" ? "flex-row-reverse" : "flex-row"
                        } items-start space-x-2`}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg" alt={msg.user} />
                          <AvatarFallback>{msg.user[0]}</AvatarFallback>
                        </Avatar>
                        <div
                          className={`rounded-lg p-3 ${
                            msg.user === "You"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200"
                          }`}
                        >
                          <p className="font-semibold">{msg.user}</p>
                          <p>{msg.message}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="events">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Event</CardTitle>
                    <CardDescription>{groupInfo.nextEvent}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Join us for a friendly match at City Park. All skill
                      levels welcome!
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">RSVP</Button>
                  </CardFooter>
                </Card>
                <Button className="w-full mt-4">
                  <PlusCircle className="mr-2 h-4 w-4" /> Create New Event
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Group Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  <span>{groupInfo.members} members</span>
                </div>
                <div className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  <span>Next event: {groupInfo.nextEvent}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Settings className="mr-2 h-4 w-4" /> Group Settings
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {["John Doe", "Jane Smith", "Mike Johnson", "Emily Brown"].map(
                  (member, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarFallback>{member[0]}</AvatarFallback>
                      </Avatar>
                      <span>{member}</span>
                    </div>
                  )
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="w-full">
                View All Members
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
