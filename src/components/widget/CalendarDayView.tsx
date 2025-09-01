import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, User } from "lucide-react";
import { format, addDays, subDays, isToday, startOfDay } from "date-fns";
import { useCalendarData } from "@/hooks/useCalendarData";

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

interface CalendarDayViewProps {
  className?: string;
}

const getEventTypeColor = (type: string) => {
  switch (type) {
    case 'tour':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'outreach':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'call_out':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getEventTypeIcon = (type: string) => {
  switch (type) {
    case 'tour':
      return CalendarIcon;
    case 'outreach':
      return User;
    case 'call_out':
      return MapPin;
    default:
      return CalendarIcon;
  }
};

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

export const CalendarDayView = ({ className }: CalendarDayViewProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { events, isLoading } = useCalendarData(selectedDate);
  
  const goToPreviousDay = () => {
    setSelectedDate(prev => subDays(prev, 1));
  };

  const goToNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const getCurrentTimePosition = () => {
    const now = new Date();
    if (!isToday(selectedDate)) return null;
    
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    if (hours < 8 || hours > 20) return null;
    
    const totalMinutes = (hours - 8) * 60 + minutes;
    const percentage = (totalMinutes / (12 * 60)) * 100;
    
    return `${percentage}%`;
  };

  const getEventPosition = (event: CalendarEvent) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    
    const startHour = start.getHours();
    const startMinutes = start.getMinutes();
    const endHour = end.getHours();
    const endMinutes = end.getMinutes();
    
    // Calculate position within the 8AM-8PM range
    const startTotalMinutes = (startHour - 8) * 60 + startMinutes;
    const endTotalMinutes = (endHour - 8) * 60 + endMinutes;
    
    const top = (startTotalMinutes / (12 * 60)) * 100;
    const height = ((endTotalMinutes - startTotalMinutes) / (12 * 60)) * 100;
    
    return {
      top: `${Math.max(0, top)}%`,
      height: `${Math.max(height, 2)}%` // Minimum 2% height for visibility
    };
  };

  const currentTimePosition = getCurrentTimePosition();

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Fixed Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-2 border-b bg-background">
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={goToPreviousDay} className="h-6 w-6 p-0">
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday} className="text-xs px-2 h-6">
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextDay} className="h-6 w-6 p-0">
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
        <div className="text-center">
          <h3 className="text-xs font-semibold">{format(selectedDate, 'EEE, MMM d')}</h3>
        </div>
      </div>

      {/* Scrollable Calendar Grid */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-xs text-muted-foreground">Loading events...</div>
          </div>
        ) : (
          <div className="relative" style={{ height: `${24 * 20}px` }}>
            {/* Time Grid */}
            <div className="absolute inset-0">
              {HOURS.map((hour, index) => (
                <div
                  key={hour}
                  className="border-b border-border/50 relative"
                  style={{ height: '40px' }}
                >
                  <div className="absolute left-0 top-0 w-12 text-xs text-muted-foreground p-1">
                    {format(new Date().setHours(hour, 0, 0, 0), 'h a')}
                  </div>
                  {/* 30-minute line */}
                  <div className="absolute left-12 right-0 top-1/2 border-t border-border/25" />
                </div>
              ))}
            </div>

            {/* Current Time Line */}
            {currentTimePosition && (
              <div
                className="absolute left-12 right-0 border-t-2 border-red-500 z-20"
                style={{ top: `calc(${currentTimePosition} * ${24 * 20}px / 100)` }}
              >
                <div className="absolute -left-1 -top-1 w-2 h-2 bg-red-500 rounded-full" />
              </div>
            )}

            {/* Events */}
            <div className="absolute left-12 right-0 top-0 bottom-0">
              {events.map((event) => {
                const position = getEventPosition(event);
                const IconComponent = getEventTypeIcon(event.type);
                
                return (
                  <div
                    key={event.id}
                    className={`absolute left-1 right-1 rounded border p-1 cursor-pointer hover:shadow-sm transition-shadow z-10 text-xs ${getEventTypeColor(event.type)}`}
                    style={{
                      top: `calc(${position.top} * ${24 * 20}px / 100)`,
                      height: `calc(${position.height} * ${24 * 20}px / 100)`
                    }}
                    onClick={() => event.link && window.open(event.link, '_blank')}
                    title={`${event.title}\n${format(new Date(event.start), 'h:mm a')} - ${format(new Date(event.end), 'h:mm a')}${event.location ? `\n${event.location}` : ''}${event.assignedTo ? `\n${event.assignedTo}` : ''}`}
                  >
                    <div className="flex items-start gap-1 min-h-0">
                      <IconComponent className="h-2 w-2 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">
                          {format(new Date(event.start), 'h:mm a')} {event.title}
                        </div>
                        {event.location && (
                          <div className="opacity-75 truncate">{event.location}</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {events.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <CalendarIcon className="h-6 w-6 mx-auto mb-1 opacity-50" />
                  <p className="text-xs">No events scheduled</p>
                  <p className="text-xs">for {format(selectedDate, 'MMM d, yyyy')}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};