
import { Widget } from "@/types/widget";
import { PeopleWidgetContent } from "./PeopleWidgetContent";
import { MetricWidgetContent } from "./MetricWidgetContent";
import { ActivityWidgetContent } from "./ActivityWidgetContent";
import { ToggleWidgetContent } from "./ToggleWidgetContent";
import { CheckboxWidgetContent } from "./CheckboxWidgetContent";
import { CalendarWidgetContent } from "./CalendarWidgetContent";
import { getWidgetIcon } from "./WidgetIconUtils";

interface WidgetContentRendererProps {
  widget: Widget;
}

export const WidgetContentRenderer = ({ widget }: WidgetContentRendererProps) => {
  const { type } = widget;
  
  if (type === 'people') {
    return <PeopleWidgetContent widget={widget} />;
  }

  if (type === 'metric') {
    return <MetricWidgetContent widget={widget} />;
  }

  if (type === 'activity') {
    return <ActivityWidgetContent widget={widget} />;
  }

  if (type === 'toggle') {
    return <ToggleWidgetContent widget={widget} />;
  }

  if (type === 'checkbox') {
    return <CheckboxWidgetContent widget={widget} />;
  }

  if (type === 'calendar') {
    return <CalendarWidgetContent widget={widget} />;
  }
  
  // Default preview for other widget types
  const IconComponent = getWidgetIcon(type);
  return (
    <div className="text-center text-gray-500">
      <IconComponent className="w-8 h-8 mx-auto mb-2 opacity-50" />
      <p className="text-sm">Widget Preview</p>
      <p className="text-xs text-gray-400 mt-1">Click settings to configure</p>
    </div>
  );
};
