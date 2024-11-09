
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OwnerVenues() {
  const navigate = useNavigate();
  const [venues, setVenues] = useState<Venue[]>([]);

  useEffect(() => {
    async function fetchVenues() {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("No token found in session storage");
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/playground/owner`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch venues");
        }

const data = await response.json();
console.log(data);
        setVenues(data.result);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching venues:", error.message);
        }
      }
    }

    fetchVenues();
  }, []);

  interface Venue {
    _id: string;
    name: string;
    location: string;
    timings: string;
    sports: string;
    price: string;
    type: string;
    imgUrl: string;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <Card className="shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle>Your Venues</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {venues.map((venue) => (
              <div key={venue._id} className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{venue.name}</h3>
                  <p>{venue.timings}</p>
                  <p className="text-sm text-gray-600">{venue.location}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/update-venue/${venue._id}`)}
                >
                  Update
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}