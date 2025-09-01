
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Widget } from "@/types/widget";
import { PeopleWidgetConfig } from "./PeopleWidgetConfig";
import { ActivityWidgetConfig } from "./ActivityWidgetConfig";
import { MetricWidgetConfig } from "./MetricWidgetConfig";
import { ToggleWidgetConfig } from "./ToggleWidgetConfig";
import { CheckboxWidgetConfig } from "./CheckboxWidgetConfig";
import { GenericWidgetConfig } from "./GenericWidgetConfig";

interface DataTabProps {
  widget: Widget;
  onUpdateConfig: (key: string, value: any) => void;
}

export const DataTab = ({ widget, onUpdateConfig }: DataTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Data Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {widget.type === 'people' ? (
          <PeopleWidgetConfig 
            config={widget.config} 
            onUpdateConfig={onUpdateConfig} 
          />
        ) : widget.type === 'activity' ? (
          <ActivityWidgetConfig 
            config={widget.config} 
            onUpdateConfig={onUpdateConfig} 
          />
        ) : widget.type === 'metric' ? (
          <MetricWidgetConfig 
            config={widget.config} 
            onUpdateConfig={onUpdateConfig} 
          />
        ) : widget.type === 'toggle' ? (
          <ToggleWidgetConfig 
            config={widget.config} 
            onUpdateConfig={onUpdateConfig} 
          />
        ) : widget.type === 'checkbox' ? (
          <CheckboxWidgetConfig 
            config={widget.config} 
            onUpdateConfig={onUpdateConfig} 
          />
        ) : (
          <GenericWidgetConfig 
            config={widget.config} 
            onUpdateConfig={onUpdateConfig} 
          />
        )}
      </CardContent>
    </Card>
  );
};
