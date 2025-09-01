import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Widget } from "@/types/widget";
import { WidgetCard } from "../widget/WidgetCard";

interface WidgetDisplayStepProps {
  widgets: Widget[];
  isBulkMode: boolean;
  applyToAll: boolean;
  onUpdateDisplayOption: (index: number, key: string, value: any) => void;
  onBulkUpdate: (field: string, value: any, isConfig?: boolean, isDisplayOption?: boolean) => void;
  expandedWidgetIndex: number | null;
  onToggleExpanded: (index: number | null) => void;
}

const colorOptions = [
  { value: "blue", label: "Blue", class: "bg-blue-500" },
  { value: "green", label: "Green", class: "bg-green-500" },
  { value: "purple", label: "Purple", class: "bg-purple-500" },
  { value: "orange", label: "Orange", class: "bg-orange-500" },
  { value: "red", label: "Red", class: "bg-red-500" },
  { value: "teal", label: "Teal", class: "bg-teal-500" },
  { value: "pink", label: "Pink", class: "bg-pink-500" },
  { value: "indigo", label: "Indigo", class: "bg-indigo-500" },
];

export const WidgetDisplayStep = ({
  widgets,
  isBulkMode,
  applyToAll,
  onUpdateDisplayOption,
  onBulkUpdate,
  expandedWidgetIndex,
  onToggleExpanded
}: WidgetDisplayStepProps) => {
  const primaryWidget = widgets[0];

  const handleColorChange = (value: string, index?: number) => {
    if (isBulkMode && applyToAll && index === undefined) {
      onBulkUpdate('color', value, false, true);
    } else if (index !== undefined) {
      onUpdateDisplayOption(index, 'color', value);
    } else {
      onUpdateDisplayOption(0, 'color', value);
    }
  };

  const renderColorPicker = (widget: Widget, index?: number) => {
    const currentColor = widget.config.displayOptions?.color || 'blue';
    
    return (
      <div className="space-y-3">
        <Label>Color</Label>
        <div className="grid grid-cols-4 gap-3">
          {colorOptions.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => handleColorChange(color.value, index)}
              className={`
                relative h-12 rounded-lg border-2 transition-all hover:scale-105
                ${currentColor === color.value ? 'border-primary ring-2 ring-primary/20' : 'border-muted'}
                ${color.class}
              `}
              title={color.label}
            >
              {currentColor === color.value && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-white border border-gray-300" />
                </div>
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Selected: {colorOptions.find(c => c.value === currentColor)?.label || 'Blue'}
        </p>
      </div>
    );
  };

  const renderWidgetPreview = (widget: Widget) => {
    return (
      <div className="border rounded-lg p-4 bg-muted/20">
        <div className="text-sm font-medium mb-2">Preview</div>
        <div className="scale-75 origin-top-left transform w-[133%]">
          <WidgetCard
            widget={widget}
            onConfigureWidget={() => {}}
            onDeleteWidget={() => {}}
            onUpdateWidget={() => {}}
            showDeleteButton={false}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Display Options</CardTitle>
        </CardHeader>
        <CardContent>
          {!isBulkMode || applyToAll ? (
            <div className="space-y-6">
              {renderColorPicker(primaryWidget)}
              {renderWidgetPreview(primaryWidget)}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Configure each widget individually:
              </p>
              
              <Accordion type="single" collapsible className="w-full">
                {widgets.map((widget, index) => (
                  <AccordionItem key={widget.id} value={`item-${index}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium">{widget.title || `Widget ${index + 1}`}</span>
                          <Badge variant="outline">{widget.type}</Badge>
                          <div 
                            className={`w-4 h-4 rounded-full ${
                              colorOptions.find(c => c.value === (widget.config.displayOptions?.color || 'blue'))?.class
                            }`}
                          />
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-6 pt-4">
                        {renderColorPicker(widget, index)}
                        {renderWidgetPreview(widget)}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Widgets to create:</span>
                <span className="ml-2">{widgets.length}</span>
              </div>
              <div>
                <span className="font-medium">Types:</span>
                <span className="ml-2">
                  {[...new Set(widgets.map(w => w.type))].join(', ')}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              {widgets.map((widget, index) => (
                <div key={widget.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">{widget.type}</Badge>
                    <span className="font-medium">{widget.title}</span>
                    {widget.config.dateRange && (
                      <Badge variant="secondary" className="text-xs">
                        {widget.config.dateRange}
                      </Badge>
                    )}
                    {widget.config.goals && (
                      <Badge variant="secondary" className="text-xs">
                        Goal: {widget.config.goals}
                      </Badge>
                    )}
                  </div>
                  <div 
                    className={`w-4 h-4 rounded-full ${
                      colorOptions.find(c => c.value === (widget.config.displayOptions?.color || 'blue'))?.class
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};