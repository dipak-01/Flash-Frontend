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
import { toast } from 'react-toastify';

interface CustomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSlot: (slot: { date: string; startTime: string; endTime: string; slotSize: string; playgroundId: string }) => void;
  selectedPlaygroundId: string;
  timing: string;
}

export default function CustomDialog({ isOpen, onClose, onAddSlot, selectedPlaygroundId, timing }: CustomDialogProps) {
  const [newSlot, setNewSlot] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: "",
    endTime: "",
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
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();

    // Generate times in 30-minute increments
    const times = Array.from({ length: 48 }, (_, i) => {
      const hour = Math.floor(i / 2).toString().padStart(2, "0");
      const minute = i % 2 === 0 ? "00" : "30";
      return `${hour}:${minute}`;
    });

    // Filter times based on playground hours and current time if it's today
    const available = times.filter(time => {
      const [hour, minute] = time.split(":").map(Number);
      const isWithinPlaygroundHours = hour >= startHour && hour < endHour;
      
      if (newSlot.date === currentDate.toISOString().split('T')[0]) {
        // For today, only show future times
        if (hour < currentHour) return false;
        if (hour === currentHour && minute <= currentMinutes) return false;
      }
      
      return isWithinPlaygroundHours;
    });

    setAvailableTimes(available);
  }, [timing, newSlot.date]);

  useEffect(() => {
    setNewSlot((prevSlot) => ({
      ...prevSlot,
      playgroundId: selectedPlaygroundId,
    }));
  }, [selectedPlaygroundId]);

  const validateTimeSelection = (startTime: string, endTime: string): boolean => {
    if (!startTime || !endTime) return false;
    
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    // Ensure minimum 30 minutes duration
    return endMinutes - startMinutes >= 30;
  };

  const handleStartTimeChange = (value: string) => {
    setNewSlot(prev => ({ ...prev, startTime: value, endTime: "" }));
    setError(null);
  };

  const handleEndTimeChange = (value: string) => {
    if (!validateTimeSelection(newSlot.startTime, value)) {
      setError("Slot must be at least 30 minutes long");
      return;
    }
    setNewSlot(prev => ({ ...prev, endTime: value }));
    setError(null);
  };

  const handleAddSlot = async () => {
    console.log(newSlot);
    if (!selectedPlaygroundId) return;

    const currentDate = new Date();
    const slotDate = new Date(newSlot.date + "T" + newSlot.startTime);

    if (slotDate < currentDate) {
      toast.error("Cannot book slot for past date or time.");
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
      toast.success('Slot added successfully!');
      onAddSlot(newSlot);
      onClose();
    } catch (error) {
      toast.error('Failed to add slot. Please try again.');
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
              onSelect={(date) => {
                if (date) {
                  // Use the date as-is without timezone adjustment
                  const selectedDate = date.toLocaleDateString('en-CA'); // Format: YYYY-MM-DD
                  setNewSlot({
                    ...newSlot,
                    date: selectedDate,
                    startTime: "",
                    endTime: ""
                  });
                }
              }}
              className="rounded-md border"
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                const maxDate = new Date();
                maxDate.setDate(today.getDate() + 5); // Add 5 days
                maxDate.setHours(0, 0, 0, 0);
                
                return date < today || date > maxDate;
              }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Select onValueChange={handleStartTimeChange}>
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
              <Select onValueChange={handleEndTimeChange}>
                <SelectTrigger id="endTime" disabled={!newSlot.startTime}>
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimes
                    .filter(time => {
                      if (!newSlot.startTime) return false;
                      const [startHour, startMinute] = newSlot.startTime.split(":").map(Number);
                      const [endHour, endMinute] = time.split(":").map(Number);
                      const startMinutes = startHour * 60 + startMinute;
                      const endMinutes = endHour * 60 + endMinute;
                      return endMinutes > startMinutes;
                    })
                    .map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))
                  }
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
          <Button variant="outline" className="border-[#FF3B30] text-[#FF3B30] hover:bg-[#FFD60A] hover:text-[#111827] transition-all duration-300 ease-in-out hover:scale-105">Cancel</Button>
          <Button onClick={handleAddSlot} className="bg-[#FFD60A] text-[#111827] hover:bg-[#FFD60A]/90 transition-all duration-300 ease-in-out hover:scale-105">Add Slot</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
