
import { Widget } from "@/types/widget";
import { WidgetCard } from "./widget/WidgetCard";
import { EmptyDashboard } from "./widget/EmptyDashboard";

interface DashboardCanvasProps {
  widgets: Widget[];
  onConfigureWidget: (widget: Widget) => void;
  onDeleteWidget: (widgetId: string) => void;
  onUpdateWidget: (widgetId: string, updates: Partial<Widget>) => void;
  onMoveWidget: (fromIndex: number, toIndex: number) => void;
  showDeleteButton?: (widget: Widget) => boolean;
}

export const DashboardCanvas = ({ 
  widgets, 
  onConfigureWidget, 
  onDeleteWidget, 
  onUpdateWidget,
  onMoveWidget,
  showDeleteButton = () => true
}: DashboardCanvasProps) => {
  if (widgets.length === 0) {
    return <EmptyDashboard />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-min">
      {widgets.map((widget, index) => (
        <WidgetCard
          key={widget.id}
          widget={widget}
          onConfigureWidget={onConfigureWidget}
          onDeleteWidget={onDeleteWidget}
          onUpdateWidget={onUpdateWidget}
          showDeleteButton={showDeleteButton(widget)}
        />
      ))}
    </div>
  );
};
