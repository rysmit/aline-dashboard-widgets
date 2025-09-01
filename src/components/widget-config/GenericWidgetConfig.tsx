
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WidgetConfig } from "@/types/widget";

interface GenericWidgetConfigProps {
  config: WidgetConfig;
  onUpdateConfig: (key: string, value: any) => void;
}

export const GenericWidgetConfig = ({ config, onUpdateConfig }: GenericWidgetConfigProps) => {
  return (
    <>
      <div>
        <Label htmlFor="dataSource">Data Source</Label>
        <Select value={config.dataSource || ""} onValueChange={(value) => onUpdateConfig('dataSource', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select data source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sales">Sales Data</SelectItem>
            <SelectItem value="leads">Lead Generation</SelectItem>
            <SelectItem value="pipeline">Sales Pipeline</SelectItem>
            <SelectItem value="activities">Activities</SelectItem>
            <SelectItem value="customers">Customer Data</SelectItem>
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
    </>
  );
};
