import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Widget, WidgetType } from "@/types/widget";

interface WidgetBasicsStepProps {
  widgets: Widget[];
  isBulkMode: boolean;
  applyToAll: boolean;
  onApplyToAllChange: (value: boolean) => void;
  onUpdateWidget: (index: number, updates: Partial<Widget>) => void;
  onBulkUpdate: (field: string, value: any, isConfig?: boolean) => void;
  expandedWidgetIndex: number | null;
  onToggleExpanded: (index: number | null) => void;
}

export const WidgetBasicsStep = ({
  widgets,
  isBulkMode,
  applyToAll,
  onApplyToAllChange,
  onUpdateWidget,
  onBulkUpdate,
  expandedWidgetIndex,
  onToggleExpanded
}: WidgetBasicsStepProps) => {
  const primaryWidget = widgets[0];

  const handleTitleChange = (value: string, index?: number) => {
    if (isBulkMode && applyToAll && index === undefined) {
      onBulkUpdate('title', value);
    } else if (index !== undefined) {
      onUpdateWidget(index, { title: value });
    } else {
      onUpdateWidget(0, { title: value });
    }
  };

  const handleTypeChange = (value: WidgetType, index?: number) => {
    if (isBulkMode && applyToAll && index === undefined) {
      onBulkUpdate('type', value);
    } else if (index !== undefined) {
      onUpdateWidget(index, { type: value });
    } else {
      onUpdateWidget(0, { type: value });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Basic Settings
            {isBulkMode && (
              <div className="flex items-center space-x-2">
                <Label htmlFor="applyToAll" className="text-sm font-normal">
                  Apply to all selected widgets
                </Label>
                <Switch
                  id="applyToAll"
                  checked={applyToAll}
                  onCheckedChange={onApplyToAllChange}
                />
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isBulkMode || applyToAll ? (
            // Single widget or bulk mode with apply to all
            <>
              <div>
                <Label htmlFor="title">Widget Title</Label>
                <Input
                  id="title"
                  value={primaryWidget.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter widget title"
                />
              </div>

              <div>
                <Label htmlFor="type">Widget Type</Label>
                <Select 
                  value={primaryWidget.type} 
                  onValueChange={(value: WidgetType) => handleTypeChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="people">People Widget</SelectItem>
                    <SelectItem value="activity">Activity Widget</SelectItem>
                    <SelectItem value="metric">Metric Widget</SelectItem>
                    <SelectItem value="goals">Goals Widget</SelectItem>
                    <SelectItem value="form">Form Widget</SelectItem>
                    <SelectItem value="calendar">Calendar Widget</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            // Bulk mode with individual overrides
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
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-4">
                        <div>
                          <Label htmlFor={`title-${index}`}>Widget Title</Label>
                          <Input
                            id={`title-${index}`}
                            value={widget.title}
                            onChange={(e) => handleTitleChange(e.target.value, index)}
                            placeholder="Enter widget title"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`type-${index}`}>Widget Type</Label>
                          <Select 
                            value={widget.type} 
                            onValueChange={(value: WidgetType) => handleTypeChange(value, index)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="people">People Widget</SelectItem>
                              <SelectItem value="activity">Activity Widget</SelectItem>
                              <SelectItem value="metric">Metric Widget</SelectItem>
                              <SelectItem value="goals">Goals Widget</SelectItem>
                              <SelectItem value="form">Form Widget</SelectItem>
                              <SelectItem value="calendar">Calendar Widget</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};