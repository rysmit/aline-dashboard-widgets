import { Widget } from "@/types/widget";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface CalendarWidgetConfigProps {
  widget: Widget;
  onUpdate: (updates: Partial<Widget>) => void;
}

export const CalendarWidgetConfig = ({ widget, onUpdate }: CalendarWidgetConfigProps) => {
  const handleActivityTypesChange = (activityTypes: string[]) => {
    onUpdate({
      config: {
        ...widget.config,
        calendarActivityTypes: activityTypes
      }
    });
  };

  const handleViewTypeChange = (viewType: string) => {
    onUpdate({
      config: {
        ...widget.config,
        calendarViewType: viewType as 'month' | 'week' | 'day'
      }
    });
  };

  const handleShowUpcomingChange = (showUpcoming: boolean) => {
    onUpdate({
      config: {
        ...widget.config,
        calendarShowUpcoming: showUpcoming
      }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="calendar-view">Calendar View</Label>
        <Select
          value={widget.config.calendarViewType || 'month'}
          onValueChange={handleViewTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select view type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Month View</SelectItem>
            <SelectItem value="week">Week View</SelectItem>
            <SelectItem value="day">Day View</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="activity-types">Activity Types</Label>
        <Select
          value={widget.config.calendarActivityTypes?.[0] || 'all'}
          onValueChange={(value) => handleActivityTypesChange(value === 'all' ? [] : [value])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select activity types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Activities</SelectItem>
            <SelectItem value="tours">Tours Only</SelectItem>
            <SelectItem value="outreach">Outreach Only</SelectItem>
            <SelectItem value="callouts">Call Outs Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="show-upcoming" className="text-sm font-medium">
          Show Upcoming Activities
        </Label>
        <Switch
          id="show-upcoming"
          checked={widget.config.calendarShowUpcoming ?? true}
          onCheckedChange={handleShowUpcomingChange}
        />
      </div>

      <div className="text-sm text-muted-foreground">
        <p>Configure how your calendar displays scheduled activities like tours, outreach appointments, and call outs.</p>
      </div>
    </div>
  );
};