import { useState, useEffect, useCallback } from "react";
import { format, startOfDay } from "date-fns";

interface CalendarEvent {
  id: string;
  title: string;
  type: 'tour' | 'outreach' | 'call_out' | string;
  start: string;
  end: string;
  assignedTo?: string;
  location?: string;
  link?: string;
}

// Mock data for demonstration
const generateMockEvents = (date: Date): CalendarEvent[] => {
  const dateStr = format(date, 'yyyy-MM-dd');
  const events: CalendarEvent[] = [];

  // Generate some sample events based on the date
  const baseEvents = [
    {
      title: "Community Tour - Johnson Family",
      type: 'tour' as const,
      time: { start: 10, end: 10.5 }, // 10:00 - 10:30 AM
      assignedTo: "Sarah Miller",
      location: "Main Lobby"
    },
    {
      title: "Outreach Call - Mrs. Anderson",
      type: 'outreach' as const,
      time: { start: 14, end: 14.5 }, // 2:00 - 2:30 PM
      assignedTo: "John Smith"
    },
    {
      title: "Emergency Maintenance - Apt 204",
      type: 'call_out' as const,
      time: { start: 16, end: 17 }, // 4:00 - 5:00 PM
      assignedTo: "Mike Wilson",
      location: "Building A, Apt 204"
    }
  ];

  // Only show events for certain days to make it more realistic
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) return []; // No events on weekends

  // Show different events based on day
  const eventsToShow = baseEvents.slice(0, Math.floor(Math.random() * 3) + 1);

  eventsToShow.forEach((eventTemplate, index) => {
    events.push({
      id: `${dateStr}-${index}`,
      title: eventTemplate.title,
      type: eventTemplate.type,
      start: `${dateStr}T${Math.floor(eventTemplate.time.start)}:${String((eventTemplate.time.start % 1) * 60).padStart(2, '0')}:00`,
      end: `${dateStr}T${Math.floor(eventTemplate.time.end)}:${String((eventTemplate.time.end % 1) * 60).padStart(2, '0')}:00`,
      assignedTo: eventTemplate.assignedTo,
      location: eventTemplate.location,
      link: `/activities/${dateStr}-${index}` // Mock link
    });
  });

  return events;
};

interface UseCalendarDataReturn {
  events: CalendarEvent[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useCalendarData = (date: Date): UseCalendarDataReturn => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async (targetDate: Date) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockEvents = generateMockEvents(targetDate);
      setEvents(mockEvents);
    } catch (err) {
      setError('Failed to fetch calendar events');
      console.error('Calendar data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    fetchEvents(date);
  }, [date, fetchEvents]);

  useEffect(() => {
    fetchEvents(date);
  }, [date, fetchEvents]);

  // Refetch on window focus (optional enhancement)
  useEffect(() => {
    const handleFocus = () => {
      refetch();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetch]);

  return {
    events,
    isLoading,
    error,
    refetch
  };
};