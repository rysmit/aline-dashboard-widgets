import { Widget } from "@/types/widget";
import { CalendarDayView } from "./CalendarDayView";

interface CalendarWidgetContentProps {
  widget: Widget;
}

export const CalendarWidgetContent = ({ widget }: CalendarWidgetContentProps) => {
  return (
    <div className="h-full flex flex-col">
      <CalendarDayView className="flex-1" />
    </div>
  );
};