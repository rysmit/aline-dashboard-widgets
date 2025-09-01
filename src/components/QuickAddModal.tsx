import { useState } from "react";
import { Search, Users, Activity, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Widget, WidgetConfig } from "@/types/widget";
import { useToast } from "@/hooks/use-toast";
import { WidgetConfigModal } from "./WidgetConfigModal";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWidgets: (widgets: Array<{ type: string; title: string; config: WidgetConfig; size: { width: number; height: number } }>) => void;
}

interface WidgetOption {
  id: string;
  type: 'people' | 'activity' | 'calendar';
  title: string;
  description: string;
  config: WidgetConfig;
}

const peopleOptions: WidgetOption[] = [
  {
    id: 'watchlist',
    type: 'people',
    title: 'Watchlist',
    description: 'People on your watchlist',
    config: { savedList: 'watchlist' }
  },
  {
    id: 'preleads',
    type: 'people',
    title: 'Preleads',
    description: 'Pre-qualified leads',
    config: { savedList: 'preleads' }
  },
  {
    id: 'cold-leads',
    type: 'people',
    title: 'Cold Leads',
    description: 'Cold prospect leads',
    config: { savedList: 'cold-leads' }
  },
  {
    id: 'alines-top-10',
    type: 'people',
    title: "Aline's Top 10 Opportunities",
    description: "Aline's curated top opportunities",
    config: { savedList: 'alines-top-10' }
  },
  {
    id: 'move-ins',
    type: 'people',
    title: 'Move-Ins',
    description: 'Recent move-ins within time period',
    config: { savedList: 'move-ins' }
  },
  {
    id: 'new-leads',
    type: 'people',
    title: 'New Leads',
    description: 'Leads created within time period',
    config: { savedList: 'new-leads' }
  },
  {
    id: 'new-referrals',
    type: 'people',
    title: 'New Referrals',
    description: 'Referrals created within time period',
    config: { savedList: 'new-referrals' }
  },
  {
    id: 'open-referrals',
    type: 'people',
    title: 'Open Referrals',
    description: 'Currently open referrals',
    config: { savedList: 'open-referrals' }
  }
];

const activityOptions: WidgetOption[] = [
  {
    id: 'past-due-activities',
    type: 'activity',
    title: 'Past Due Activities',
    description: 'Activities that are overdue',
    config: { 
      savedList: 'past-due-activities',
      displayType: 'count' as const
    }
  },
  {
    id: 'people-no-next-activity',
    type: 'activity',
    title: 'People with No Next Activity',
    description: 'People without scheduled activities',
    config: { 
      savedList: 'people-no-next-activity',
      displayType: 'count' as const
    }
  },
  {
    id: 'tours-mtd',
    type: 'activity',
    title: 'Tours (MTD)',
    description: 'Tours scheduled this month',
    config: { 
      savedList: 'tours-mtd',
      displayType: 'count' as const
    }
  },
  {
    id: 'upcoming-activities',
    type: 'activity',
    title: 'Upcoming Activities',
    description: 'Activities scheduled for the future',
    config: { 
      savedList: 'upcoming-activities',
      displayType: 'count' as const
    }
  },
  {
    id: 'call-ins',
    type: 'activity',
    title: 'Call Ins',
    description: 'Incoming call activities',
    config: { 
      savedList: 'call-ins',
      displayType: 'count' as const
    }
  }
];

const calendarOptions: WidgetOption[] = [
  {
    id: 'calendar-day',
    type: 'calendar',
    title: 'Calendar',
    description: 'Daily schedule view (8 AM - 8 PM)',
    config: { 
      calendarViewType: 'day',
      calendarSource: 'community',
      calendarShowUpcoming: true
    }
  }
];

export const QuickAddModal = ({ isOpen, onClose, onAddWidgets }: QuickAddModalProps) => {
  const [selectedLayout, setSelectedLayout] = useState<'count' | 'grid'>('count');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeople, setSelectedPeople] = useState<Set<string>>(new Set());
  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(new Set());
  const [selectedCalendar, setSelectedCalendar] = useState<Set<string>>(new Set());
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [pendingWidget, setPendingWidget] = useState<Widget | null>(null);
  const { toast } = useToast();

  const filteredPeople = peopleOptions.filter(option =>
    option.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredActivities = activityOptions.filter(option =>
    option.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCalendar = calendarOptions.filter(option =>
    option.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSelected = selectedPeople.size + selectedActivities.size + selectedCalendar.size;

  const handlePersonToggle = (optionId: string) => {
    const newSelected = new Set(selectedPeople);
    if (newSelected.has(optionId)) {
      newSelected.delete(optionId);
    } else {
      newSelected.add(optionId);
    }
    setSelectedPeople(newSelected);
  };

  const handleActivityToggle = (optionId: string) => {
    const newSelected = new Set(selectedActivities);
    if (newSelected.has(optionId)) {
      newSelected.delete(optionId);
    } else {
      newSelected.add(optionId);
    }
    setSelectedActivities(newSelected);
  };

  const handleCalendarToggle = (optionId: string) => {
    // Calendar only allows single selection
    if (selectedCalendar.has(optionId)) {
      setSelectedCalendar(new Set());
    } else {
      setSelectedCalendar(new Set([optionId]));
    }
  };

  const handleSelectAllPeople = () => {
    if (selectedPeople.size === filteredPeople.length) {
      setSelectedPeople(new Set());
    } else {
      setSelectedPeople(new Set(filteredPeople.map(p => p.id)));
    }
  };

  const handleSelectAllActivities = () => {
    if (selectedActivities.size === filteredActivities.length) {
      setSelectedActivities(new Set());
    } else {
      setSelectedActivities(new Set(filteredActivities.map(a => a.id)));
    }
  };

  const handleAddSelected = () => {
    if (totalSelected === 1) {
      const selectedWidget = getSelectedWidget();
      if (selectedWidget) {
        // Calendar widget - add immediately without config
        if (selectedWidget.type === 'calendar') {
          const widgetData = {
            type: selectedWidget.type,
            title: selectedWidget.title,
            config: selectedWidget.config,
            size: selectedWidget.size
          };

          onAddWidgets([widgetData]);
          
          toast({
            title: "Success",
            description: "Calendar widget added successfully."
          });
          
          // Reset selections and close
          resetAndClose();
        } else {
          // Other widgets - open configuration modal
          setPendingWidget(selectedWidget);
          setShowConfigModal(true);
        }
      }
    } else if (totalSelected > 1) {
      // Multi-select - quick add with defaults (People/Activity only)
      const selectedWidgets = getSelectedWidgets();
      if (selectedWidgets.length > 0) {
        const widgetData = selectedWidgets.map(widget => ({
          type: widget.type,
          title: widget.title,
          config: widget.config,
          size: widget.size
        }));

        onAddWidgets(widgetData);
        
        toast({
          title: "Success",
          description: `Added ${selectedWidgets.length} widget${selectedWidgets.length === 1 ? '' : 's'}.`
        });
        
        resetAndClose();
      }
    }
  };

  const getSelectedWidget = (): Widget | null => {
    // Check people first
    if (selectedPeople.size === 1) {
      const id = Array.from(selectedPeople)[0];
      const option = peopleOptions.find(p => p.id === id);
      if (option) {
        return createWidgetFromOption(option);
      }
    }
    
    // Check activities
    if (selectedActivities.size === 1) {
      const id = Array.from(selectedActivities)[0];
      const option = activityOptions.find(a => a.id === id);
      if (option) {
        return createWidgetFromOption(option);
      }
    }

    // Check calendar
    if (selectedCalendar.size === 1) {
      const id = Array.from(selectedCalendar)[0];
      const option = calendarOptions.find(c => c.id === id);
      if (option) {
        return createWidgetFromOption(option);
      }
    }
    
    return null;
  };

  const getSelectedWidgets = (): Widget[] => {
    const selectedWidgets: Widget[] = [];
    
    // Get selected people widgets
    selectedPeople.forEach(id => {
      const option = peopleOptions.find(p => p.id === id);
      if (option) {
        selectedWidgets.push(createWidgetFromOption(option));
      }
    });

    // Get selected activity widgets
    selectedActivities.forEach(id => {
      const option = activityOptions.find(a => a.id === id);
      if (option) {
        selectedWidgets.push(createWidgetFromOption(option));
      }
    });

    // Calendar widgets are handled separately (single select, immediate add)
    return selectedWidgets;
  };

  const createWidgetFromOption = (option: WidgetOption): Widget => {
    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type: option.type,
      title: option.title,
      config: {
        ...option.config,
        displayType: selectedLayout,
        displayOptions: {
          showLegend: false,
          showLabels: false,
          color: '#3b82f6'
        }
      },
      position: { x: 0, y: 0 },
      size: option.type === 'calendar' ? { width: 2, height: 2 } : (selectedLayout === 'count' ? { width: 1, height: 1 } : { width: 2, height: 2 }),
      sortOrder: 1
    };
  };

  const handleSaveWidget = (configuredWidget: Widget) => {
    const widgetData = {
      type: configuredWidget.type,
      title: configuredWidget.title,
      config: configuredWidget.config,
      size: configuredWidget.size
    };

    onAddWidgets([widgetData]);
    
    // Reset selections and close
    setShowConfigModal(false);
    setPendingWidget(null);
    resetAndClose();
  };

  const resetAndClose = () => {
    setSelectedPeople(new Set());
    setSelectedActivities(new Set());
    setSelectedCalendar(new Set());
    setSearchTerm('');
    onClose();
  };

  const handleClose = () => {
    setShowConfigModal(false);
    setPendingWidget(null);
    resetAndClose();
  };

  const getButtonLabel = () => {
    if (totalSelected === 0) return "Select a widget";
    if (totalSelected === 1) {
      if (selectedCalendar.size === 1) return "Add Calendar";
      return "Add & Configure";
    }
    return `Add ${totalSelected} Widgets`;
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl w-full max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Quick Add Widgets</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col space-y-6">
            <Tabs value={selectedLayout} onValueChange={(value) => setSelectedLayout(value as 'count' | 'grid')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="count">Count Layout</TabsTrigger>
                <TabsTrigger value="grid">Grid Layout</TabsTrigger>
              </TabsList>

              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search widgets..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto mt-6 space-y-6">
                <TabsContent value="count" className="mt-0 space-y-6">
                  <WidgetSection
                    title="People Widgets"
                    icon={Users}
                    options={filteredPeople}
                    selectedOptions={selectedPeople}
                    onToggleOption={handlePersonToggle}
                    onSelectAll={handleSelectAllPeople}
                    layout="count"
                  />
                  
                  <WidgetSection
                    title="Activity Widgets"
                    icon={Activity}
                    options={filteredActivities}
                    selectedOptions={selectedActivities}
                    onToggleOption={handleActivityToggle}
                    onSelectAll={handleSelectAllActivities}
                    layout="count"
                  />

                  <WidgetSection
                    title="Calendar Widgets"
                    icon={Calendar}
                    options={filteredCalendar}
                    selectedOptions={selectedCalendar}
                    onToggleOption={handleCalendarToggle}
                    onSelectAll={() => {}} // No select all for calendar
                    layout="calendar"
                  />
                </TabsContent>

                <TabsContent value="grid" className="mt-0 space-y-6">
                  <WidgetSection
                    title="People Widgets"
                    icon={Users}
                    options={filteredPeople}
                    selectedOptions={selectedPeople}
                    onToggleOption={handlePersonToggle}
                    onSelectAll={handleSelectAllPeople}
                    layout="grid"
                  />
                  
                  <WidgetSection
                    title="Activity Widgets"
                    icon={Activity}
                    options={filteredActivities}
                    selectedOptions={selectedActivities}
                    onToggleOption={handleActivityToggle}
                    onSelectAll={handleSelectAllActivities}
                    layout="grid"
                  />

                  <WidgetSection
                    title="Calendar Widgets"
                    icon={Calendar}
                    options={filteredCalendar}
                    selectedOptions={selectedCalendar}
                    onToggleOption={handleCalendarToggle}
                    onSelectAll={() => {}} // No select all for calendar
                    layout="calendar"
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Sticky Footer */}
          <div className="flex items-center justify-between pt-4 border-t bg-background">
            <div className="text-sm text-muted-foreground">
              {totalSelected > 0 && (
                <Badge variant="secondary">{totalSelected} selected</Badge>
              )}
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddSelected}
                disabled={totalSelected === 0}
              >
                {getButtonLabel()}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <WidgetConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        widget={pendingWidget}
        onSave={handleSaveWidget}
      />
    </>
  );
};

interface WidgetSectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  options: WidgetOption[];
  selectedOptions: Set<string>;
  onToggleOption: (id: string) => void;
  onSelectAll: () => void;
  layout: 'count' | 'grid' | 'calendar';
}

const WidgetSection = ({
  title,
  icon: Icon,
  options,
  selectedOptions,
  onToggleOption,
  onSelectAll,
  layout
}: WidgetSectionProps) => {
  const allSelected = options.length > 0 && selectedOptions.size === options.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <h3 className="font-medium">{title}</h3>
        </div>
        {options.length > 0 && layout !== 'calendar' && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onSelectAll}
            className="text-xs"
          >
            {allSelected ? 'Deselect All' : 'Select All'}
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        {options.map((option) => (
          <div
            key={option.id}
            className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
            onClick={() => onToggleOption(option.id)}
          >
            <Checkbox
              checked={selectedOptions.has(option.id)}
              onChange={() => onToggleOption(option.id)}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">{option.title}</h4>
                <Badge variant="outline" className="text-xs">
                  {layout === 'calendar' ? '2x2' : (layout === 'count' ? '1x1' : '2x2')}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      {options.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No widgets found matching your search.
        </p>
      )}
    </div>
  );
};
