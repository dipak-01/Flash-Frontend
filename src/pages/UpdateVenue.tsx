import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function UpdateVenue() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [venue, setVenue] = useState({
    name: "",
    location: "",
    timings: "",
    sports: "",
    price: "",
    type: "",
    imgUrl: ""
  });

  useEffect(() => {
    async function fetchVenueDetails() {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("No token found in session storage");
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/playground/details?id=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch venue details");
        }

        const data = await response.json();
        setVenue(data);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching venue details:", error.message);
        }
      }
    }

    if (id) {
      fetchVenueDetails();
    }
  }, [id]);

  const handleUpdateVenue = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("No token found in session storage");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/playground/update?id=${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(venue),
      });

      if (!response.ok) {
        throw new Error("Failed to update venue");
      }

      const data = await response.json();
      console.log(data);
      navigate('/view-all-venues');
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error updating venue:", error.message);
      }
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => navigate('/view-all-venues')}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Venue</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={venue.name} onChange={(e) => setVenue({ ...venue, name: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={venue.location} onChange={(e) => setVenue({ ...venue, location: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="timings">Timings</Label>
            <Input id="timings" value={venue.timings} onChange={(e) => setVenue({ ...venue, timings: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="sports">Sports</Label>
            <Input id="sports" value={venue.sports} onChange={(e) => setVenue({ ...venue, sports: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input id="price" value={venue.price} onChange={(e) => setVenue({ ...venue, price: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Input id="type" value={venue.type} onChange={(e) => setVenue({ ...venue, type: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="imgUrl">Image URL</Label>
            <Input id="imgUrl" value={venue.imgUrl} onChange={(e) => setVenue({ ...venue, imgUrl: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleUpdateVenue}>Update Venue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
