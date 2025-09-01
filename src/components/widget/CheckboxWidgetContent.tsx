
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Widget } from "@/types/widget";

interface CheckboxWidgetContentProps {
  widget: Widget;
}

export const CheckboxWidgetContent = ({ widget }: CheckboxWidgetContentProps) => {
  const [isChecked, setIsChecked] = useState(widget.config.checkboxChecked || false);

  useEffect(() => {
    setIsChecked(widget.config.checkboxChecked || false);
  }, [widget.config.checkboxChecked]);

  return (
    <div className="flex items-center justify-center space-x-3 p-4">
      <Checkbox
        id={`checkbox-${widget.id}`}
        checked={isChecked}
        onCheckedChange={(checked) => setIsChecked(checked as boolean)}
      />
      <Label htmlFor={`checkbox-${widget.id}`} className="text-sm font-medium">
        {widget.config.checkboxLabel || "Checkbox Option"}
      </Label>
    </div>
  );
};
