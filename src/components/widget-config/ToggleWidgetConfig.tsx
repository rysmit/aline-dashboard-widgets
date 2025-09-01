
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { WidgetConfig } from "@/types/widget";

interface ToggleWidgetConfigProps {
  config: WidgetConfig;
  onUpdateConfig: (key: string, value: any) => void;
}

export const ToggleWidgetConfig = ({ config, onUpdateConfig }: ToggleWidgetConfigProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="toggleLabel">Toggle Label</Label>
        <Input
          id="toggleLabel"
          value={config.toggleLabel || ""}
          onChange={(e) => onUpdateConfig("toggleLabel", e.target.value)}
          placeholder="Enter toggle label"
        />
      </div>
      
      <div className="flex items-center space-x-3">
        <Switch
          id="toggleEnabled"
          checked={config.toggleEnabled || false}
          onCheckedChange={(checked) => onUpdateConfig("toggleEnabled", checked)}
        />
        <Label htmlFor="toggleEnabled">Default State (Enabled)</Label>
      </div>
    </div>
  );
};
