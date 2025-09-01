import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Widget } from "@/types/widget";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface WidgetTypeSettingsStepProps {
  widgets: Widget[];
  isBulkMode: boolean;
  applyToAll: boolean;
  onUpdateConfig: (index: number, key: string, value: any) => void;
  onBulkUpdate: (field: string, value: any, isConfig?: boolean) => void;
  expandedWidgetIndex: number | null;
  onToggleExpanded: (index: number | null) => void;
}

export const WidgetTypeSettingsStep = ({
  widgets,
  isBulkMode,
  applyToAll,
  onUpdateConfig,
  onBulkUpdate,
  expandedWidgetIndex,
  onToggleExpanded
}: WidgetTypeSettingsStepProps) => {
  const primaryWidget = widgets[0];

  const handleConfigChange = (key: string, value: any, index?: number) => {
    if (isBulkMode && applyToAll && index === undefined) {
      onBulkUpdate(key, value, true);
    } else if (index !== undefined) {
      onUpdateConfig(index, key, value);
    } else {
      onUpdateConfig(0, key, value);
    }
  };

  const renderPeopleAndActivitySettings = (widget: Widget, index?: number) => (
    <div className="space-y-4">
      {/* Saved List */}
      <div>
        <Label>Saved List *</Label>
        <Select 
          value={widget.config.savedList || ""} 
          onValueChange={(value) => handleConfigChange('savedList', value, index)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose a saved list" />
          </SelectTrigger>
          <SelectContent>
            {widget.type === 'people' ? (
              <>
                <SelectItem value="watchlist">Watchlist</SelectItem>
                <SelectItem value="preleads">Preleads</SelectItem>
                <SelectItem value="cold-leads">Cold Leads</SelectItem>
                <SelectItem value="alines-top-10">Aline's Top 10 Opportunities</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="past-due-activities">Past Due Activities</SelectItem>
                <SelectItem value="people-no-next-activity">People With No Next Activity</SelectItem>
                <SelectItem value="tours-mtd">Tours (MTD)</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Time Period */}
      <div>
        <Label>Time Period</Label>
        <RadioGroup 
          value={widget.config.dateRange || "no-filter"} 
          onValueChange={(value) => handleConfigChange('dateRange', value, index)}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="last-7-days" id={`7d-${index || 0}`} />
            <Label htmlFor={`7d-${index || 0}`}>Last 7 Days</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="month-to-date" id={`mtd-${index || 0}`} />
            <Label htmlFor={`mtd-${index || 0}`}>Month to Date</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="custom" id={`custom-${index || 0}`} />
            <Label htmlFor={`custom-${index || 0}`}>Custom Range</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no-filter" id={`none-${index || 0}`} />
            <Label htmlFor={`none-${index || 0}`}>No Filter</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Custom Date Range */}
      {widget.config.dateRange === 'custom' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !widget.config.customDateStart && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {widget.config.customDateStart 
                    ? format(new Date(widget.config.customDateStart), "PPP")
                    : "Pick a date"
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={widget.config.customDateStart ? new Date(widget.config.customDateStart) : undefined}
                  onSelect={(date) => handleConfigChange('customDateStart', date?.toISOString().split('T')[0], index)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !widget.config.customDateEnd && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {widget.config.customDateEnd 
                    ? format(new Date(widget.config.customDateEnd), "PPP")
                    : "Pick a date"
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={widget.config.customDateEnd ? new Date(widget.config.customDateEnd) : undefined}
                  onSelect={(date) => handleConfigChange('customDateEnd', date?.toISOString().split('T')[0], index)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      {/* Associated Goal */}
      <div>
        <Label>Associated Goal (Optional)</Label>
        <Select 
          value={widget.config.goals || "none"} 
          onValueChange={(value) => handleConfigChange('goals', value === "none" ? "" : value, index)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="occupancy">Occupancy Goal</SelectItem>
            <SelectItem value="tours">Tours Goal</SelectItem>
            <SelectItem value="move-ins">Move-ins Goal</SelectItem>
            <SelectItem value="leads">Lead Generation Goal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Display Mode */}
      <div>
        <Label>Display Mode</Label>
        <Select 
          value={widget.config.displayType || "count"} 
          onValueChange={(value) => handleConfigChange('displayType', value, index)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="count">Count</SelectItem>
            <SelectItem value="grid">Grid</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderMetricSettings = (widget: Widget, index?: number) => (
    <div className="space-y-4">
      <div>
        <Label>Metric Source *</Label>
        <Select 
          value={widget.config.measure || ""} 
          onValueChange={(value) => handleConfigChange('measure', value, index)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="occupancy-rate">Occupancy Rate</SelectItem>
            <SelectItem value="tour-conversion">Tour to Move-in Rate</SelectItem>
            <SelectItem value="lead-conversion">Lead Conversion Rate</SelectItem>
            <SelectItem value="response-time">Average Response Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Aggregation</Label>
        <Select 
          value={widget.config.aggregation || "sum"} 
          onValueChange={(value) => handleConfigChange('aggregation', value, index)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sum">Sum</SelectItem>
            <SelectItem value="count">Count</SelectItem>
            <SelectItem value="average">Average</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Time Period</Label>
        <RadioGroup 
          value={widget.config.timeframe || "30d"} 
          onValueChange={(value) => handleConfigChange('timeframe', value, index)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="7d" id={`metric-7d-${index || 0}`} />
            <Label htmlFor={`metric-7d-${index || 0}`}>Last 7 Days</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="30d" id={`metric-30d-${index || 0}`} />
            <Label htmlFor={`metric-30d-${index || 0}`}>Last 30 Days</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="custom" id={`metric-custom-${index || 0}`} />
            <Label htmlFor={`metric-custom-${index || 0}`}>Custom Range</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label>Display Mode</Label>
        <Select 
          value={widget.config.displayType || "count"} 
          onValueChange={(value) => handleConfigChange('displayType', value, index)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="count">Count</SelectItem>
            <SelectItem value="grid">Grid</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderGoalsSettings = (widget: Widget, index?: number) => (
    <div className="space-y-4">
      <div>
        <Label>Goal *</Label>
        <Select 
          value={widget.config.goalId || ""} 
          onValueChange={(value) => handleConfigChange('goalId', value, index)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="occupancy">Occupancy Goal</SelectItem>
            <SelectItem value="tours">Tours Goal</SelectItem>
            <SelectItem value="move-ins">Move-ins Goal</SelectItem>
            <SelectItem value="leads">Lead Generation Goal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Progress Mode</Label>
        <Select 
          value={widget.config.progressMode || "count"} 
          onValueChange={(value) => handleConfigChange('progressMode', value, index)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="count">Count (Shows current vs target)</SelectItem>
            <SelectItem value="grid">Grid (Shows progress bar)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderFormSettings = (widget: Widget, index?: number) => (
    <div className="space-y-4">
      <div>
        <Label>Form *</Label>
        <Select 
          value={widget.config.formId || ""} 
          onValueChange={(value) => handleConfigChange('formId', value, index)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a form" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="contact-form">Contact Form</SelectItem>
            <SelectItem value="tour-request">Tour Request Form</SelectItem>
            <SelectItem value="application">Application Form</SelectItem>
            <SelectItem value="feedback">Feedback Form</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Open Behavior</Label>
        <Select 
          value={widget.config.openBehavior || "modal"} 
          onValueChange={(value) => handleConfigChange('openBehavior', value, index)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="inline">Inline Embed</SelectItem>
            <SelectItem value="modal">Open Modal</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderCalendarSettings = (widget: Widget, index?: number) => (
    <div className="space-y-4">
      <div>
        <Label>Source</Label>
        <Select 
          value={widget.config.calendarSource || "community"} 
          onValueChange={(value) => handleConfigChange('calendarSource', value, index)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="community">Community</SelectItem>
            <SelectItem value="lead">Lead</SelectItem>
            <SelectItem value="team">Team</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>View</Label>
        <Select 
          value={widget.config.calendarViewType || "month"} 
          onValueChange={(value) => handleConfigChange('calendarViewType', value, index)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="agenda">Agenda</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Filters</Label>
        <Select 
          value={widget.config.calendarActivityTypes?.[0] || "all"} 
          onValueChange={(value) => handleConfigChange('calendarActivityTypes', value === 'all' ? [] : [value], index)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Activity Types</SelectItem>
            <SelectItem value="tours">Tours</SelectItem>
            <SelectItem value="calls">Calls</SelectItem>
            <SelectItem value="meetings">Meetings</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderSettingsForWidget = (widget: Widget, index?: number) => {
    switch (widget.type) {
      case 'people':
      case 'activity':
        return renderPeopleAndActivitySettings(widget, index);
      case 'metric':
        return renderMetricSettings(widget, index);
      case 'goals':
        return renderGoalsSettings(widget, index);
      case 'form':
        return renderFormSettings(widget, index);
      case 'calendar':
        return renderCalendarSettings(widget, index);
      default:
        return <p className="text-muted-foreground">No specific configuration needed for this widget type.</p>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{primaryWidget.type.charAt(0).toUpperCase() + primaryWidget.type.slice(1)} Widget Settings</CardTitle>
        </CardHeader>
        <CardContent>
          {!isBulkMode || applyToAll ? (
            renderSettingsForWidget(primaryWidget)
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
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-4">
                        {renderSettingsForWidget(widget, index)}
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