
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Activity, BarChart3, Target, FileText, Calendar, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { WidgetType, WidgetTemplate, WidgetConfig } from "@/types/widget";

interface WidgetGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWidget: (type: WidgetType, config?: Partial<WidgetConfig>) => void;
}

const widgetTemplates: WidgetTemplate[] = [
  {
    type: 'people',
    name: 'People Widget',
    description: 'Display and filter people data',
    icon: 'Users',
    defaultConfig: { 
      savedList: '',
      displayType: 'count',
      dateRange: 'month-to-date',
      watchlistOnly: false
    }
  },
  {
    type: 'activity',
    name: 'Activity Widget',
    description: 'Track recent activities and interactions',
    icon: 'Activity',
    defaultConfig: { dataSource: 'activities' }
  },
  {
    type: 'metric',
    name: 'Metric Widget',
    description: 'Show key performance indicators',
    icon: 'BarChart3',
    defaultConfig: { metric: 'revenue', timeframe: '30d' }
  },
  {
    type: 'goals',
    name: 'Goals Widget',
    description: 'Track progress towards goals',
    icon: 'Target',
    defaultConfig: { metric: 'quota', timeframe: 'month' }
  },
  {
    type: 'form',
    name: 'Form Widget',
    description: 'Display and collect form data',
    icon: 'FileText',
    defaultConfig: { dataSource: 'forms' }
  },
  {
    type: 'calendar',
    name: 'Calendar Widget',
    description: 'Show calendar events and schedules',
    icon: 'Calendar',
    defaultConfig: { dataSource: 'events' }
  }
];

const getIcon = (iconName: string) => {
  const icons = {
    Users: Users,
    Activity: Activity,
    BarChart3: BarChart3,
    Target: Target,
    FileText: FileText,
    Calendar: Calendar
  };
  return icons[iconName as keyof typeof icons] || Users;
};

export const WidgetGallery = ({ isOpen, onClose, onAddWidget }: WidgetGalleryProps) => {
  const [selectedQuickAdds, setSelectedQuickAdds] = useState<Record<string, { selected: boolean; displayType: 'count' | 'grid' }>>({});

  const getPeopleQuickAdds = () => [
    { id: 'watchlist', label: 'Watchlist', config: { savedList: 'watchlist' } },
    { id: 'move-in-mtd', label: 'Move IN MTD', config: { savedList: 'move-in-mtd', dateRange: 'month-to-date' as const } },
    { id: 'move-out-mtd', label: 'Move Out MTD', config: { savedList: 'move-out-mtd', dateRange: 'month-to-date' as const } }
  ];

  const getActivityQuickAdds = () => [
    { id: 'open-upcoming', label: 'Open/Upcoming Activities', config: { activityStatus: 'open' as const, activityTimeframe: 'upcoming' as const } },
    { id: 'past-due', label: 'Past Due Activities', config: { activityStatus: 'open' as const, activityTimeframe: 'past-due' as const } }
  ];

  const handleQuickAddToggle = (id: string, checked: boolean) => {
    setSelectedQuickAdds(prev => ({
      ...prev,
      [id]: { 
        selected: checked, 
        displayType: prev[id]?.displayType || 'count' 
      }
    }));
  };

  const handleDisplayTypeChange = (id: string, displayType: 'count' | 'grid') => {
    setSelectedQuickAdds(prev => ({
      ...prev,
      [id]: { 
        ...prev[id], 
        displayType 
      }
    }));
  };

  const handleAddSelectedQuickAdds = (type: WidgetType) => {
    const quickAdds = type === 'people' ? getPeopleQuickAdds() : getActivityQuickAdds();
    
    Object.entries(selectedQuickAdds).forEach(([id, selection]) => {
      if (selection.selected) {
        const quickAdd = quickAdds.find(qa => qa.id === id);
        if (quickAdd) {
          const config = {
            ...quickAdd.config,
            displayType: selection.displayType
          };
          // Call onAddWidget directly without opening configuration
          onAddWidget(type, config);
        }
      }
    });
    
    setSelectedQuickAdds({});
    onClose(); // Close the gallery after adding widgets
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Add Widget</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {widgetTemplates.map((template) => {
            const IconComponent = getIcon(template.icon);
            const hasQuickAdds = template.type === 'people' || template.type === 'activity';
            
            return (
              <Card 
                key={template.type}
                className="hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-200"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  <h3 className="font-medium text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  
                  <div className="space-y-2">
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => onAddWidget(template.type)}
                    >
                      Add Widget
                    </Button>
                    
                    {hasQuickAdds && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Quick Adds <ChevronDown className="w-4 h-4 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-80 p-4">
                          <div className="space-y-4">
                            <div className="font-medium text-sm">Select Quick Adds:</div>
                            {template.type === 'people' && 
                              getPeopleQuickAdds().map((item) => (
                                <div key={item.id} className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={item.id}
                                      checked={selectedQuickAdds[item.id]?.selected || false}
                                      onCheckedChange={(checked) => handleQuickAddToggle(item.id, checked as boolean)}
                                    />
                                    <label htmlFor={item.id} className="text-sm flex-1">
                                      {item.label}
                                    </label>
                                  </div>
                                  {selectedQuickAdds[item.id]?.selected && (
                                    <div className="ml-6">
                                      <Select 
                                        value={selectedQuickAdds[item.id]?.displayType || 'count'} 
                                        onValueChange={(value) => handleDisplayTypeChange(item.id, value as 'count' | 'grid')}
                                      >
                                        <SelectTrigger className="w-full">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="count">Count</SelectItem>
                                          <SelectItem value="grid">Grid</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  )}
                                </div>
                              ))
                            }
                            {template.type === 'activity' && 
                              getActivityQuickAdds().map((item) => (
                                <div key={item.id} className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={item.id}
                                      checked={selectedQuickAdds[item.id]?.selected || false}
                                      onCheckedChange={(checked) => handleQuickAddToggle(item.id, checked as boolean)}
                                    />
                                    <label htmlFor={item.id} className="text-sm flex-1">
                                      {item.label}
                                    </label>
                                  </div>
                                  {selectedQuickAdds[item.id]?.selected && (
                                    <div className="ml-6">
                                      <Select 
                                        value={selectedQuickAdds[item.id]?.displayType || 'count'} 
                                        onValueChange={(value) => handleDisplayTypeChange(item.id, value as 'count' | 'grid')}
                                      >
                                        <SelectTrigger className="w-full">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="count">Count</SelectItem>
                                          <SelectItem value="grid">Grid</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  )}
                                </div>
                              ))
                            }
                            <div className="pt-2 border-t">
                              <Button 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleAddSelectedQuickAdds(template.type)}
                                disabled={!Object.values(selectedQuickAdds).some(selection => selection.selected)}
                              >
                                Add Selected
                              </Button>
                            </div>
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
