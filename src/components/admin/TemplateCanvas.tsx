import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Save } from "lucide-react";
import { DashboardCanvas } from "@/components/DashboardCanvas";
import { WidgetGallery } from "@/components/WidgetGallery";
import { SimpleWidgetConfigModal } from "@/components/SimpleWidgetConfigModal";
import { Widget, WidgetType, WidgetConfig } from "@/types/widget";

interface TemplateCanvasProps {
  widgets: Widget[];
  onWidgetsChange: (widgets: Widget[]) => void;
  onSave: () => void;
  onBack: () => void;
  templateName?: string;
}

export const TemplateCanvas = ({ 
  widgets, 
  onWidgetsChange, 
  onSave, 
  onBack, 
  templateName 
}: TemplateCanvasProps) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [configWidget, setConfigWidget] = useState<Widget | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const handleAddWidget = (type: WidgetType, presetConfig?: Partial<WidgetConfig>) => {
    // Determine title based on preset config
    let title = `New ${type} Widget`;
    if (presetConfig) {
      if (type === 'people') {
        switch (presetConfig.savedList) {
          case 'watchlist':
            title = 'Watchlist';
            break;
          case 'move-in-mtd':
            title = 'Move IN MTD';
            break;
          case 'move-out-mtd':
            title = 'Move Out MTD';
            break;
        }
      } else if (type === 'activity') {
        if (presetConfig.activityStatus === 'open' && presetConfig.activityTimeframe === 'upcoming') {
          title = 'Open/Upcoming Activities';
        } else if (presetConfig.activityStatus === 'open' && presetConfig.activityTimeframe === 'past-due') {
          title = 'Past Due Activities';
        }
      }
    }
    
    const newWidget: Widget = {
      id: Date.now().toString(),
      type,
      title,
      config: {
        ...(type === 'activity' && { 
          dataSource: '',
          timeframe: ''
        }),
        ...(type === 'metric' && {
          measure: '',
          timeframe: ''
        }),
        ...(type === 'people' && {
          savedList: '',
          displayType: 'count',
          dateRange: 'month-to-date'
        }),
        ...(type === 'toggle' && { 
          toggleLabel: 'Toggle Option',
          toggleEnabled: false 
        }),
        ...(type === 'checkbox' && { 
          checkboxLabel: 'Checkbox Option',
          checkboxChecked: false 
        }),
        displayOptions: {
          showLegend: false,
          showLabels: false,
          color: 'blue'
        },
        // Apply preset config last to override defaults
        ...presetConfig
      },
      position: { x: 0, y: 0 },
      size: { width: 6, height: 4 }
    };
    
    onWidgetsChange([...widgets, newWidget]);
    
    // Only open config modal if no preset config was provided
    if (!presetConfig) {
      setConfigWidget(newWidget);
      setIsConfigOpen(true);
    }
    setIsGalleryOpen(false);
  };

  const handleConfigureWidget = (widget: Widget) => {
    setConfigWidget(widget);
    setIsConfigOpen(true);
  };

  const handleWidgetUpdate = (widgetId: string, updates: Partial<Widget>) => {
    const updatedWidgets = widgets.map(widget => 
      widget.id === widgetId ? { ...widget, ...updates } : widget
    );
    onWidgetsChange(updatedWidgets);
  };

  const handleUpdateWidget = (updatedWidget: Widget) => {
    onWidgetsChange(widgets.map(w => w.id === updatedWidget.id ? updatedWidget : w));
    setIsConfigOpen(false);
    setConfigWidget(null);
  };

  const handleDeleteWidget = (widgetId: string) => {
    onWidgetsChange(widgets.filter(w => w.id !== widgetId));
  };

  const handleMoveWidget = (fromIndex: number, toIndex: number) => {
    const newWidgets = [...widgets];
    const [movedWidget] = newWidgets.splice(fromIndex, 1);
    newWidgets.splice(toIndex, 0, movedWidget);
    onWidgetsChange(newWidgets);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Templates
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {templateName || 'New Template'}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {widgets.length} widgets configured
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button onClick={() => setIsGalleryOpen(true)} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Widget
              </Button>
              
              <Button onClick={onSave} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save Template
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        <DashboardCanvas 
          widgets={widgets}
          onConfigureWidget={handleConfigureWidget}
          onDeleteWidget={handleDeleteWidget}
          onUpdateWidget={handleWidgetUpdate}
          onMoveWidget={handleMoveWidget}
        />
      </main>

      <WidgetGallery 
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onAddWidget={handleAddWidget}
      />

      <SimpleWidgetConfigModal
        widget={configWidget}
        isOpen={isConfigOpen}
        onClose={() => {
          setIsConfigOpen(false);
          setConfigWidget(null);
        }}
        onSave={handleUpdateWidget}
      />
    </>
  );
};