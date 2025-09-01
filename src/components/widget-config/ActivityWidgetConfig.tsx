
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WidgetConfig } from "@/types/widget";

interface ActivityWidgetConfigProps {
  config: WidgetConfig;
  onUpdateConfig: (key: string, value: any) => void;
}

export const ActivityWidgetConfig = ({ config, onUpdateConfig }: ActivityWidgetConfigProps) => {
  return (
    <>
      <div>
        <Label htmlFor="displayType">Display Type</Label>
        <Select value={config.displayType || "count"} onValueChange={(value) => onUpdateConfig('displayType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select display type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="count">Count</SelectItem>
            <SelectItem value="grid">Grid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="dataSource">Data Source</Label>
        <Select value="activities" disabled>
          <SelectTrigger>
            <SelectValue placeholder="Activities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="activities">Activities</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="activityStatus">Activity Status</Label>
        <Select value={config.activityStatus || "open"} onValueChange={(value) => onUpdateConfig('activityStatus', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="savedList">Saved List</Label>
        <Select value={config.savedList || ""} onValueChange={(value) => onUpdateConfig('savedList', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a saved list" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="past-due-activities">Past Due Activities</SelectItem>
            <SelectItem value="people-no-next-activity">People with No Next Activity</SelectItem>
            <SelectItem value="tours-mtd">Tours (MTD)</SelectItem>
            <SelectItem value="upcoming-activities">Upcoming Activities</SelectItem>
            <SelectItem value="call-ins">Call Ins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="timeframe">Time Period</Label>
        <Select value={config.timeframe || ""} onValueChange={(value) => onUpdateConfig('timeframe', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
            <SelectItem value="none">No Filter</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
