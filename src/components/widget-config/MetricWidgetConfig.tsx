
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WidgetConfig } from "@/types/widget";

interface MetricWidgetConfigProps {
  config: WidgetConfig;
  onUpdateConfig: (key: string, value: any) => void;
}

export const MetricWidgetConfig = ({ config, onUpdateConfig }: MetricWidgetConfigProps) => {
  return (
    <>
      <div>
        <Label htmlFor="measure">Select Measure</Label>
        <Select value={config.measure || ""} onValueChange={(value) => onUpdateConfig('measure', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a measure" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tour-to-move-in">Tour to Move In</SelectItem>
            <SelectItem value="average-response-time">Average Response Time</SelectItem>
            <SelectItem value="inquiry-to-move-in">Inquiry to Move In</SelectItem>
            <SelectItem value="occupancy-rate">Occupancy Rate</SelectItem>
            <SelectItem value="lead-conversion">Lead Conversion</SelectItem>
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
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="goals">Goals</Label>
        <Select value={config.goals || ""} onValueChange={(value) => onUpdateConfig('goals', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="occupancy">Occupancy</SelectItem>
            <SelectItem value="average-response-time">Average Response Time</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
