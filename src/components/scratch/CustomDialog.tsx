import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSlot: (slot: { date: string; startTime: string; endTime: string; slotSize: string; playgroundId: string }) => void;
  selectedPlaygroundId: string;
  timing: string;
}

export default function CustomDialog({ isOpen, onClose, onAddSlot, selectedPlaygroundId, timing }: CustomDialogProps) {
  const [newSlot, setNewSlot] = useState({
    date: "2024-11-07",
    startTime: "11:00",
    endTime: "12:00",
    slotSize: "10",
    playgroundId: selectedPlaygroundId,
  });
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!timing) {
      console.error("Timing prop is undefined");
      return;
    }

    const timings = timing.split(" - ");
    if (timings.length !== 2) {
      console.error("Invalid timing format");
      return;
    }

    const startHour = parseInt(timings[0].split(":")[0], 10);
    const endHour = parseInt(timings[1].split(":")[0], 10);

    // Generate all possible times in a day in increments of 30 minutes
    const times = Array.from({ length: 24 }, (_, i) => {
      const hour = i.toString().padStart(2, "0");
      return [`${hour}:00`, `${hour}:30`];
    }).flat();

    // Filter available times based on playground timings
    const available = times.filter(time => {
      const [hour] = time.split(":").map(Number);
      return hour >= startHour && hour < endHour;
    });

    setAvailableTimes(available);
  }, [timing]);

  useEffect(() => {
    setNewSlot((prevSlot) => ({
      ...prevSlot,
      playgroundId: selectedPlaygroundId,
    }));
  }, [selectedPlaygroundId]);

  const handleAddSlot = async () => {
    console.log(newSlot);
    if (!selectedPlaygroundId) return;

    const currentDate = new Date();
    const slotDate = new Date(newSlot.date + "T" + newSlot.startTime);

    if (slotDate < currentDate) {
      setError("Cannot book slot for past date or time.");
      alert("Cannot book slot for past date or time.");
      return;
    }
    const formattedSlot = {
      time: `${newSlot.startTime} - ${newSlot.endTime}`,
      date: newSlot.date, // Use ISO format date
      slotSize: newSlot.slotSize,
    };
    try {
      console.log(formattedSlot);
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/slot/new?playgroundId=${selectedPlaygroundId}`,
        {
          method: "POST",
          headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(formattedSlot),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add slot");
      }

      const data = await response.json();
      console.log(data);
      onAddSlot(newSlot);
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error adding slot:", error.message);
        setError("Failed to add slot. Please try again.");
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Slot</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Calendar
              mode="single"
              selected={new Date(newSlot.date)}
              onSelect={(date) => setNewSlot({ ...newSlot, date: date?.toISOString().split("T")[0] || new Date().toISOString().split("T")[0] })}
              className="rounded-md border"
              disabled={(date) => date < new Date()}  // Disable past dates
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Select onValueChange={(value) => setNewSlot({ ...newSlot, startTime: value })}>
                <SelectTrigger id="startTime">
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimes.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Select onValueChange={(value) => setNewSlot({ ...newSlot, endTime: value })}>
                <SelectTrigger id="endTime">
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimes.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slotSize">Slot Size</Label>
            <Select onValueChange={(value) => setNewSlot({ ...newSlot, slotSize: value })}>
              <SelectTrigger id="slotSize">
                <SelectValue placeholder="Select slot size" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size} {size === 1 ? 'person' : 'people'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleAddSlot}>Add Slot</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
