"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { getAvailableDateKeys, formatDateKey } from "@/lib/daily-tracking-store";

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Load available dates from storage
  useEffect(() => {
    setIsClient(true);
    const dateKeys = getAvailableDateKeys();
    setAvailableDates(dateKeys.map((key) => new Date(key)));
  }, []);

  // Handle navigation to previous day
  const handlePreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    onDateChange(prevDay);
  };

  // Handle navigation to next day
  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Don't allow selecting future dates
    if (nextDay <= new Date()) {
      onDateChange(nextDay);
    }
  };

  // Handle navigation to today
  const handleToday = () => {
    onDateChange(new Date());
  };

  // Determine if a date has data
  const hasDataForDate = (date: Date) => {
    const dateKey = formatDateKey(date);
    return availableDates.some((d) => formatDateKey(d) === dateKey);
  };

  // Custom day renderer for the calendar to highlight days with data
  const renderDay = (day: Date) => {
    const hasData = hasDataForDate(day);
    return (
      <div className={`relative flex h-8 w-8 items-center justify-center rounded-full ${hasData ? "font-bold" : ""}`}>
        {day.getDate()}
        {hasData && <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full" />}
      </div>
    );
  };

  // Don't render anything on the server to avoid hydration issues
  if (!isClient) return null;

  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="icon" onClick={handlePreviousDay} className="h-9 w-9">
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Popover>
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
            onSelect={(date) => date && onDateChange(date)}
            disabled={(date) => date > new Date()}
            initialFocus
            showOutsideDays={true}
            fixedWeeks={true}
            components={{
              Day: ({ day }) => renderDay(day.date),
            }}
            className="rounded-md border shadow"
          />
          <div className="p-3 border-t">
            <Button variant="outline" className="w-full" onClick={handleToday}>
              Today
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        size="icon"
        onClick={handleNextDay}
        disabled={format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")}
        className="h-9 w-9"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
