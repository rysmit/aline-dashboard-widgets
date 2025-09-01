
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WidgetConfig } from "@/types/widget";

interface DisplayTabProps {
  config: WidgetConfig;
  onUpdateDisplayOption: (key: string, value: any) => void;
}

export const DisplayTab = ({ config, onUpdateDisplayOption }: DisplayTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Display Options</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="showLegend">Show Legend</Label>
          <Switch
            id="showLegend"
            checked={config.displayOptions?.showLegend || false}
            onCheckedChange={(checked) => onUpdateDisplayOption('showLegend', checked)}
          />
        </div>

        <div>
          <Label htmlFor="color">Primary Color</Label>
          <Select value={config.displayOptions?.color || ""} onValueChange={(value) => onUpdateDisplayOption('color', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select color theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blue">Blue</SelectItem>
              <SelectItem value="green">Green</SelectItem>
              <SelectItem value="purple">Purple</SelectItem>
              <SelectItem value="orange">Orange</SelectItem>
              <SelectItem value="red">Red</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
