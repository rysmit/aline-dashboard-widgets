import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";
import { Widget } from "@/types/widget";
import { ColumnSelector } from "./ColumnSelector";

interface SimpleWidgetConfigModalProps {
  widget: Widget | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (widget: Widget) => void;
}

export const SimpleWidgetConfigModal = ({ widget, isOpen, onClose, onSave }: SimpleWidgetConfigModalProps) => {
  const [localWidget, setLocalWidget] = useState<Widget | null>(null);

  useEffect(() => {
    if (widget) {
      setLocalWidget({ ...widget });
    }
  }, [widget]);

  if (!localWidget) return null;

  const handleSave = () => {
    console.log('Saving widget:', localWidget);
    onSave(localWidget);
    onClose();
  };

  const updateConfig = (key: string, value: any) => {
    console.log('Updating config:', key, value);
    setLocalWidget({
      ...localWidget,
      config: {
        ...localWidget.config,
        [key]: value
      }
    });
  };

  const updateDisplayOption = (key: string, value: any) => {
    setLocalWidget({
      ...localWidget,
      config: {
        ...localWidget.config,
        displayOptions: {
          ...localWidget.config.displayOptions,
          [key]: value
        }
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Configure Widget</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Basic Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Settings</h3>
            
            <div>
              <Label htmlFor="title">Widget Title</Label>
              <Input
                id="title"
                value={localWidget.title}
                onChange={(e) => setLocalWidget({ ...localWidget, title: e.target.value })}
                placeholder="Enter widget title"
              />
            </div>

            <div>
              <Label htmlFor="type">Widget Type</Label>
              <Select value={localWidget.type} onValueChange={(value) => setLocalWidget({ ...localWidget, type: value as any })}>
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

          {/* Widget-specific Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Configuration</h3>
            
            {localWidget.type === 'people' && (
              <>
                <div>
                  <Label htmlFor="savedList">Select Saved List</Label>
                  <Select value={localWidget.config.savedList || ""} onValueChange={(value) => updateConfig('savedList', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a saved list" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-contacts">All Contacts</SelectItem>
                      <SelectItem value="hot-leads">Hot Leads</SelectItem>
                      <SelectItem value="cold-leads">Cold Leads</SelectItem>
                      <SelectItem value="customers">Customers</SelectItem>
                      <SelectItem value="prospects">Prospects</SelectItem>
                      <SelectItem value="watch-list">Watch list</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="displayType">Display Type</Label>
                  <Select value={localWidget.config.displayType || ""} onValueChange={(value) => updateConfig('displayType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select display type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="count">Show as Count</SelectItem>
                      <SelectItem value="grid">Show as Grid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dateRange">Date Range</Label>
                  <Select value={localWidget.config.dateRange || ""} onValueChange={(value) => updateConfig('dateRange', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month-to-date">Month to Date</SelectItem>
                      <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                      <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                      <SelectItem value="custom">Custom Date Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {localWidget.config.dateRange === 'custom' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customDateStart">Start Date</Label>
                      <Input
                        id="customDateStart"
                        type="date"
                        value={localWidget.config.customDateStart || ""}
                        onChange={(e) => updateConfig('customDateStart', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="customDateEnd">End Date</Label>
                      <Input
                        id="customDateEnd"
                        type="date"
                        value={localWidget.config.customDateEnd || ""}
                        onChange={(e) => updateConfig('customDateEnd', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {localWidget.config.displayType === 'grid' && (
                  <ColumnSelector
                    selectedColumns={localWidget.config.selectedColumns || ['name', 'community', 'casenumber']}
                    onColumnsChange={(columns) => updateConfig('selectedColumns', columns)}
                  />
                )}
              </>
            )}

            {localWidget.type === 'metric' && (
              <>
                <div>
                  <Label htmlFor="measure">Select Measure</Label>
                  <Select value={localWidget.config.measure || ""} onValueChange={(value) => updateConfig('measure', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a measure" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tour-to-move-in">Tour to Move In</SelectItem>
                      <SelectItem value="average-response-time">Average Response Time</SelectItem>
                      <SelectItem value="inquiry-to-move-in">Inquiry to Move In</SelectItem>
                      <SelectItem value="occupancy-rate">Occupancy Rate</SelectItem>
                      <SelectItem value="lead-conversion">Lead Conversion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timeframe">Time Period</Label>
                  <Select value={localWidget.config.timeframe || ""} onValueChange={(value) => updateConfig('timeframe', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                      <SelectItem value="1y">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="goals">Goals</Label>
                  <Select value={localWidget.config.goals || ""} onValueChange={(value) => updateConfig('goals', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="occupancy">Occupancy</SelectItem>
                      <SelectItem value="average-response-time">Average Response Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {localWidget.type === 'activity' && (
              <>
                <div>
                  <Label htmlFor="savedList">Saved List</Label>
                  <Select value={localWidget.config.dataSource || ""} onValueChange={(value) => updateConfig('dataSource', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select saved list" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming-tours">Upcoming Tours</SelectItem>
                      <SelectItem value="prospects-no-activity">Prospects w/o Next activity</SelectItem>
                      <SelectItem value="open-activities">Open Activities</SelectItem>
                      <SelectItem value="in-person-tours">In Person Tours</SelectItem>
                      <SelectItem value="home-visits">Home Visits</SelectItem>
                      <SelectItem value="virtual-tours">Virtual Tours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timeframe">Time Period</Label>
                  <Select value={localWidget.config.timeframe || ""} onValueChange={(value) => updateConfig('timeframe', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                      <SelectItem value="1y">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="goals">Goals</Label>
                  <Select value={localWidget.config.goals || ""} onValueChange={(value) => updateConfig('goals', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tours">Tours</SelectItem>
                      <SelectItem value="call-ins">Call Ins</SelectItem>
                      <SelectItem value="call-outs">Call Outs</SelectItem>
                      <SelectItem value="in-person-tours">In Person Tours</SelectItem>
                      <SelectItem value="home-visits">Home Visits</SelectItem>
                      <SelectItem value="virtual-tours">Virtual Tours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {(localWidget.type === 'goals' || localWidget.type === 'form') && (
              <>
                <div>
                  <Label htmlFor="dataSource">Data Source</Label>
                  <Select value={localWidget.config.dataSource || ""} onValueChange={(value) => updateConfig('dataSource', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select data source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Sales Data</SelectItem>
                      <SelectItem value="leads">Lead Generation</SelectItem>
                      <SelectItem value="pipeline">Sales Pipeline</SelectItem>
                      <SelectItem value="activities">Activities</SelectItem>
                      <SelectItem value="customers">Customer Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timeframe">Time Period</Label>
                  <Select value={localWidget.config.timeframe || ""} onValueChange={(value) => updateConfig('timeframe', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                      <SelectItem value="1y">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {localWidget.type === 'calendar' && (
              <>
                <div>
                  <Label htmlFor="calendarView">Calendar View</Label>
                  <Select value={localWidget.config.calendarViewType || "month"} onValueChange={(value) => updateConfig('calendarViewType', value as 'month' | 'week' | 'day')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select view type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Month View</SelectItem>
                      <SelectItem value="week">Week View</SelectItem>
                      <SelectItem value="day">Day View</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="activityTypes">Activity Types</Label>
                  <Select value={localWidget.config.calendarActivityTypes?.[0] || "all"} onValueChange={(value) => updateConfig('calendarActivityTypes', value === 'all' ? [] : [value])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Activities</SelectItem>
                      <SelectItem value="tours">Tours Only</SelectItem>
                      <SelectItem value="outreach">Outreach Only</SelectItem>
                      <SelectItem value="callouts">Call Outs Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showUpcoming">Show Upcoming Activities</Label>
                  <Switch
                    id="showUpcoming"
                    checked={localWidget.config.calendarShowUpcoming ?? true}
                    onCheckedChange={(checked) => updateConfig('calendarShowUpcoming', checked)}
                  />
                </div>
              </>
            )}
          </div>

          {/* Display Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Display Options</h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="showLegend">Show Legend</Label>
              <Switch
                id="showLegend"
                checked={localWidget.config.displayOptions?.showLegend || false}
                onCheckedChange={(checked) => updateDisplayOption('showLegend', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="showLabels">Show Data Labels</Label>
              <Switch
                id="showLabels"
                checked={localWidget.config.displayOptions?.showLabels || false}
                onCheckedChange={(checked) => updateDisplayOption('showLabels', checked)}
              />
            </div>

            <div>
              <Label htmlFor="color">Primary Color</Label>
              <Select value={localWidget.config.displayOptions?.color || ""} onValueChange={(value) => updateDisplayOption('color', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select color theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Widget
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
