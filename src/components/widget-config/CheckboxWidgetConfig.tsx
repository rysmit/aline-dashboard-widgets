
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { WidgetConfig } from "@/types/widget";

interface CheckboxWidgetConfigProps {
  config: WidgetConfig;
  onUpdateConfig: (key: string, value: any) => void;
}

export const CheckboxWidgetConfig = ({ config, onUpdateConfig }: CheckboxWidgetConfigProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="checkboxLabel">Checkbox Label</Label>
        <Input
          id="checkboxLabel"
          value={config.checkboxLabel || ""}
          onChange={(e) => onUpdateConfig("checkboxLabel", e.target.value)}
          placeholder="Enter checkbox label"
        />
      </div>
      
      <div className="flex items-center space-x-3">
        <Checkbox
          id="checkboxChecked"
          checked={config.checkboxChecked || false}
          onCheckedChange={(checked) => onUpdateConfig("checkboxChecked", checked)}
        />
        <Label htmlFor="checkboxChecked">Default State (Checked)</Label>
      </div>
    </div>
  );
};
