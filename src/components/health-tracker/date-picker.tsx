"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { getAvailableDateKeys } from "@/app/actions/health-actions";

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  userId?: string;
}

export function DatePicker({ selectedDate, onDateChange, userId }: DatePickerProps) {
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Load available dates from database
  useEffect(() => {
    setIsClient(true);
    async function fetchAvailableDates() {
      try {
        if (!userId) return;
        const dateKeys = await getAvailableDateKeys(userId);
        // Ensure dates are created with time set to noon to avoid timezone issues
        const parsedDates = dateKeys.map((dateKey: string) => {
          const date = new Date(dateKey);
          // Set the time to noon to avoid timezone issues
          date.setHours(12, 0, 0, 0);
          return date;
        });
        setAvailableDates(parsedDates);
      } catch (error) {
        console.error("Failed to fetch available dates:", error);
        setAvailableDates([]);
      }
    }

    fetchAvailableDates();
  }, [userId]);

  // Handle navigation to previous day
  const handlePreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    // Set the time to noon to avoid timezone issues
    prevDay.setHours(12, 0, 0, 0);
    onDateChange(prevDay);
    // Close the calendar if it's open
    setIsCalendarOpen(false);
  };

  // Handle navigation to next day
  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    // Set the time to noon to avoid timezone issues
    nextDay.setHours(12, 0, 0, 0);

    // Don't allow selecting future dates
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    
    if (nextDay <= today) {
      onDateChange(nextDay);
      // Close the calendar if it's open
      setIsCalendarOpen(false);
    }
  };

  // Handle navigation to today
  const handleToday = () => {
    const today = new Date();
    // Set the time to noon to avoid timezone issues
    today.setHours(12, 0, 0, 0);
    onDateChange(today);
    // Close the calendar
    setIsCalendarOpen(false);
  };

  // Determine if a date has data
  const hasDataForDate = (date: Date) => {
    return availableDates.some((d) => isSameDay(d, date));
  };

  // We'll use modifiers instead of a custom day renderer to highlight dates with data
  const modifiers = {
    hasData: availableDates,
  };

  const modifiersStyles = {
    hasData: {
      fontWeight: "bold",
    },
  };

  // Don't render anything on the server to avoid hydration issues
  if (!isClient) return null;

  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="icon" onClick={handlePreviousDay} className="h-9 w-9">
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="min-w-[240px] justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(selectedDate, "PPP")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                // Create a new date object and set time to noon to avoid timezone issues
                const selectedDate = new Date(date);
                selectedDate.setHours(12, 0, 0, 0);
                onDateChange(selectedDate);
                setIsCalendarOpen(false);
              }
            }}
            disabled={(date) => date > new Date()}
            showOutsideDays={true}
            fixedWeeks={true}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            className="rounded-md border shadow"
          />
          <div className="p-3 border-t">
            <Button variant="outline" className="w-full" onClick={handleToday}>
              Today
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Button variant="outline" size="icon" onClick={handleNextDay} disabled={isSameDay(selectedDate, new Date())} className="h-9 w-9">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
