
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Widget } from "@/types/widget";

interface ToggleWidgetContentProps {
  widget: Widget;
}

export const ToggleWidgetContent = ({ widget }: ToggleWidgetContentProps) => {
  const [isToggled, setIsToggled] = useState(widget.config.toggleEnabled || false);

  useEffect(() => {
    setIsToggled(widget.config.toggleEnabled || false);
  }, [widget.config.toggleEnabled]);

  return (
    <div className="flex items-center justify-center space-x-3 p-4">
      <Switch
        id={`toggle-${widget.id}`}
        checked={isToggled}
        onCheckedChange={setIsToggled}
      />
      <Label htmlFor={`toggle-${widget.id}`} className="text-sm font-medium">
        {widget.config.toggleLabel || "Toggle Option"}
      </Label>
    </div>
  );
};
