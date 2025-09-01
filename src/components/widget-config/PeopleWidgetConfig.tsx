
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WidgetConfig } from "@/types/widget";
import { ColumnSelector } from "@/components/ColumnSelector";
import { useEffect } from "react";

interface PeopleWidgetConfigProps {
  config: WidgetConfig;
  onUpdateConfig: (key: string, value: any) => void;
}

export const PeopleWidgetConfig = ({ config, onUpdateConfig }: PeopleWidgetConfigProps) => {
  // Set default displayType if not set
  useEffect(() => {
    if (!config.displayType) {
      onUpdateConfig('displayType', 'count');
    }
  }, [config.displayType, onUpdateConfig]);

  // Auto-match goal to saved list title when saved list changes
  useEffect(() => {
    if (config.savedList && !config.goals) {
      // Map saved list values to goal titles
      const goalMappings: Record<string, string> = {
        'move-ins': 'Move-Ins',
        'new-leads': 'New Leads', 
        'new-referrals': 'New Referrals',
        'open-referrals': 'Open Referrals',
        'watchlist': 'Watchlist',
        'preleads': 'Preleads',
        'cold-leads': 'Cold Leads',
        'alines-top-10': "Aline's Top 10 Opportunities"
      };
      
      const matchedGoal = goalMappings[config.savedList];
      if (matchedGoal) {
        onUpdateConfig('goals', matchedGoal);
      }
    }
  }, [config.savedList, config.goals, onUpdateConfig]);

  return (
    <>
      <div>
        <Label htmlFor="savedList">Select Saved List</Label>
        <Select value={config.savedList || ""} onValueChange={(value) => onUpdateConfig('savedList', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a saved list" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="watchlist">Watchlist</SelectItem>
            <SelectItem value="preleads">Preleads</SelectItem>
            <SelectItem value="cold-leads">Cold Leads</SelectItem>
            <SelectItem value="alines-top-10">Aline's Top 10 Opportunities</SelectItem>
            <SelectItem value="move-ins">Move-Ins</SelectItem>
            <SelectItem value="new-leads">New Leads</SelectItem>
            <SelectItem value="new-referrals">New Referrals</SelectItem>
            <SelectItem value="open-referrals">Open Referrals</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="displayType">Display Type</Label>
        <Select value={config.displayType || ""} onValueChange={(value) => onUpdateConfig('displayType', value)}>
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
        <Select value={config.dateRange || ""} onValueChange={(value) => onUpdateConfig('dateRange', value)}>
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

      {config.dateRange === 'custom' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customDateStart">Start Date</Label>
            <Input
              id="customDateStart"
              type="date"
              value={config.customDateStart || ""}
              onChange={(e) => onUpdateConfig('customDateStart', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="customDateEnd">End Date</Label>
            <Input
              id="customDateEnd"
              type="date"
              value={config.customDateEnd || ""}
              onChange={(e) => onUpdateConfig('customDateEnd', e.target.value)}
            />
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="goals">Associated Goal (Optional)</Label>
        <Select value={config.goals || ""} onValueChange={(value) => onUpdateConfig('goals', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No Goal</SelectItem>
            <SelectItem value="Move-Ins">Move-Ins</SelectItem>
            <SelectItem value="New Leads">New Leads</SelectItem>
            <SelectItem value="New Referrals">New Referrals</SelectItem>
            <SelectItem value="Open Referrals">Open Referrals</SelectItem>
            <SelectItem value="Watchlist">Watchlist</SelectItem>
            <SelectItem value="Preleads">Preleads</SelectItem>
            <SelectItem value="Cold Leads">Cold Leads</SelectItem>
            <SelectItem value="Aline's Top 10 Opportunities">Aline's Top 10 Opportunities</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {config.displayType === 'grid' && (
        <ColumnSelector
          selectedColumns={config.selectedColumns || ['name', 'community', 'casenumber']}
          onColumnsChange={(columns) => onUpdateConfig('selectedColumns', columns)}
        />
      )}
    </>
  );
};
