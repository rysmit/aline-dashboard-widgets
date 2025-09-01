
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { WidgetGallery } from "@/components/WidgetGallery";
import { DashboardCanvas } from "@/components/DashboardCanvas";
import { WidgetConfigModal } from "@/components/WidgetConfigModal";
import { QuickAddPanel } from "@/components/QuickAddPanel";
import { Widget, WidgetType, WidgetConfig } from "@/types/widget";
import { useAuth } from "@/contexts/AuthContext";
import { useTemplate } from "@/contexts/TemplateContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const { templateId } = useParams();
  const { user, isAdmin } = useAuth();
  const { getPublishedTemplatesForCommunity, getPrimaryTemplateForCommunity, personalWidgets, setPersonalWidgets, addPersonalWidget, templates } = useTemplate();
  const { toast } = useToast();
  
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [configWidget, setConfigWidget] = useState<Widget | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<any>(null);

  // Get published templates and primary template for current community
  const publishedTemplates = user?.communityId ? getPublishedTemplatesForCommunity(user.communityId) : [];
  const primaryTemplate = user?.communityId ? getPrimaryTemplateForCommunity(user.communityId) : null;
  
  // Load widgets based on route and user
  useEffect(() => {
    if (templateId) {
      // Load specific template (template-only view)
      let template;
      
      if (isAdmin) {
        // Admin can view any template
        template = templates.find(t => t.id === templateId);
      } else {
        // Community users can only view published templates for their community
        template = user?.communityId ? publishedTemplates.find(t => t.id === templateId) : null;
      }
      
      if (template) {
        setCurrentTemplate(template);
        // Show only template widgets, sorted by sortOrder
        const sortedWidgets = [...template.widgets].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        setWidgets(sortedWidgets);
      } else {
        setCurrentTemplate(null);
        setWidgets([]);
      }
      return;
    }

    // Default dashboard view (no templateId)
    if (!user?.communityId && !isAdmin) {
      // No community user - show only personal widgets
      setWidgets(personalWidgets);
      setCurrentTemplate(null);
      return;
    }

    if (isAdmin) {
      // Admin default view - show personal widgets only
      setWidgets(personalWidgets);
      setCurrentTemplate(null);
      return;
    }

    // Community user default dashboard view
    setCurrentTemplate(null);
    
    if (primaryTemplate) {
      // Show primary template widgets + personal widgets
      const sortedTemplateWidgets = [...primaryTemplate.widgets].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      setWidgets([...sortedTemplateWidgets, ...personalWidgets]);
    } else {
      // No primary template - show only personal widgets
      setWidgets(personalWidgets);
    }
  }, [templateId, user, publishedTemplates, personalWidgets, primaryTemplate, isAdmin, templates]);

  const getDisplayTitle = () => {
    if (currentTemplate) {
      return isAdmin ? `${currentTemplate.name} (Admin View)` : `${currentTemplate.name} (Template View)`;
    }
    if (templateId) {
      return 'Template Not Found';
    }
    if (isAdmin) {
      return 'Admin Dashboard';
    }
    return user?.community?.name ? `${user.community.name} Dashboard` : 'Dashboard';
  };

  const isTemplateOnlyView = !!templateId && !!currentTemplate;
  const hasEmptyDashboard = (!user?.communityId && !isAdmin) || (!isAdmin && !primaryTemplate && personalWidgets.length === 0);

  const handleAddWidget = (type: WidgetType, presetConfig?: Partial<WidgetConfig>) => {
    console.log('Adding widget of type:', type);
    
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
    } else if (type === 'calendar') {
      title = 'Calendar';
    }
    
    // Determine widget config first
    const finalConfig: WidgetConfig = {
      // Set default configs based on widget type
      ...(type === 'activity' && { 
        dataSource: '',
        timeframe: '',
        displayType: 'count' as const
      }),
      ...(type === 'metric' && {
        measure: '',
        timeframe: ''
      }),
      ...(type === 'people' && {
        savedList: '',
        displayType: 'count' as const,
        dateRange: 'month-to-date' as const
      }),
      ...(type === 'toggle' && { 
        toggleLabel: 'Toggle Option',
        toggleEnabled: false 
      }),
      ...(type === 'checkbox' && { 
        checkboxLabel: 'Checkbox Option',
        checkboxChecked: false 
      }),
      ...(type === 'calendar' && {
        calendarViewType: 'month' as const,
        calendarActivityTypes: [],
        calendarShowUpcoming: true
      }),
      displayOptions: {
        showLegend: false,
        showLabels: false,
        color: 'blue'
      },
      // Apply preset config last to override defaults
      ...presetConfig
    };

    // Set widget size based on display type - grid widgets need more space
    const isGridWidget = finalConfig.displayType === 'grid' || type === 'calendar';
    const widgetSize = isGridWidget ? { width: 8, height: 6 } : { width: 6, height: 4 };

    const newWidget: Widget = {
      id: Date.now().toString(),
      type,
      title,
      config: finalConfig,
      position: { x: 0, y: 0 },
      size: widgetSize
    };
    
    // Add as personal widget
    addPersonalWidget(newWidget);
    
    // Only open config modal if no preset config was provided
    if (!presetConfig) {
      setConfigWidget(newWidget);
      setIsConfigOpen(true);
    }
    setIsGalleryOpen(false);
    console.log('Personal widget added, opening config modal');
  };

  const handleConfigureWidget = (widget: Widget) => {
    console.log('Configuring widget:', widget);
    setConfigWidget(widget);
    setIsConfigOpen(true);
  };

  const handleWidgetUpdate = (widgetId: string, updates: Partial<Widget>) => {
    const updatedWidgets = widgets.map(widget => 
      widget.id === widgetId ? { ...widget, ...updates } : widget
    );
    setWidgets(updatedWidgets);

    // Also update personalWidgets if it's a personal widget
    if (personalWidgets.some(w => w.id === widgetId)) {
      const updatedPersonalWidgets = personalWidgets.map(widget =>
        widget.id === widgetId ? { ...widget, ...updates } : widget
      );
      setPersonalWidgets(updatedPersonalWidgets);
    }
  };

  const handleUpdateWidget = (updatedWidget: Widget) => {
    console.log('Updating widget:', updatedWidget);
    
    // Check if display type changed and adjust size accordingly
    const existingWidget = widgets.find(w => w.id === updatedWidget.id);
    if (existingWidget) {
      const isNewGridWidget = updatedWidget.config.displayType === 'grid' || updatedWidget.type === 'calendar';
      const wasGridWidget = existingWidget.config.displayType === 'grid' || existingWidget.type === 'calendar';
      
      // If display type changed, update size
      if (isNewGridWidget !== wasGridWidget) {
        updatedWidget.size = isNewGridWidget ? { width: 8, height: 6 } : { width: 6, height: 4 };
      }
    }
    
    // Update personal widgets if it's a personal widget
    const isPersonalWidget = personalWidgets.some(w => w.id === updatedWidget.id);
    if (isPersonalWidget) {
      setPersonalWidgets(personalWidgets.map(w => w.id === updatedWidget.id ? updatedWidget : w));
    }
    
    setWidgets(widgets.map(w => w.id === updatedWidget.id ? updatedWidget : w));
    setIsConfigOpen(false);
    setConfigWidget(null);
    console.log('Widget updated successfully');
  };

  const handleDeleteWidget = (widgetId: string) => {
    console.log('Deleting widget:', widgetId);
    
    // Only allow deletion of personal widgets (not in template-only view)
    if (!isTemplateOnlyView) {
      const isPersonalWidget = personalWidgets.some(w => w.id === widgetId);
      if (isPersonalWidget) {
        setPersonalWidgets(personalWidgets.filter(w => w.id !== widgetId));
        setWidgets(widgets.filter(w => w.id !== widgetId));
      }
    }
  };

  const handleMoveWidget = (fromIndex: number, toIndex: number) => {
    const newWidgets = [...widgets];
    const [movedWidget] = newWidgets.splice(fromIndex, 1);
    newWidgets.splice(toIndex, 0, movedWidget);
    setWidgets(newWidgets);
  };

  const handleBulkAddWidgets = (widgetConfigs: Array<{ type: string; title: string; config: WidgetConfig; size: { width: number; height: number } }>) => {
    console.log('Adding bulk widgets:', widgetConfigs);
    
    const existingTitles = new Set(widgets.map(w => w.title));
    let duplicateCount = 0;
    
    const newWidgets = widgetConfigs.map(({ type, title, config, size }, index) => {
      let finalTitle = title;
      
      // Handle duplicates by adding suffix
      if (existingTitles.has(finalTitle)) {
        let counter = 2;
        while (existingTitles.has(`${title} (${counter})`)) {
          counter++;
        }
        finalTitle = `${title} (${counter})`;
        duplicateCount++;
      }
      
      existingTitles.add(finalTitle);
      
      return {
        id: (Date.now() + index).toString(),
        type: type as WidgetType,
        title: finalTitle,
        config,
        position: { x: 0, y: 0 },
        size
      };
    });

    // Add all widgets to personal widgets
    newWidgets.forEach(widget => addPersonalWidget(widget));
    
    if (duplicateCount > 0) {
      toast({
        title: "Widgets Added",
        description: `Added ${newWidgets.length} widgets. Renamed ${duplicateCount} duplicate${duplicateCount === 1 ? '' : 's'}.`
      });
    }
    
    console.log('Bulk widgets added successfully');
  };

  console.log('Current widgets:', widgets);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center justify-between border-b bg-white px-4">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
              <h1 className="text-lg font-semibold text-gray-900">
                {getDisplayTitle()}
              </h1>
            </div>
            {user?.community && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{user.community.careType}</Badge>
                <span className="text-sm text-muted-foreground">{user.community.location}</span>
              </div>
            )}
          </header>

          {!isTemplateOnlyView && (
            <DashboardHeader 
              onAddWidget={() => setIsGalleryOpen(true)}
              onQuickAdd={() => setIsQuickAddOpen(true)}
              widgetCount={widgets.length}
            />
          )}

          <main className="flex-1 p-6">
            {hasEmptyDashboard && !isTemplateOnlyView ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Welcome to your Dashboard
                </h3>
                <p className="text-gray-600 mb-6">
                  {!user?.communityId 
                    ? "Get started by adding your first widget"
                    : "No template has been assigned to your community yet. You can still add personal widgets."
                  }
                </p>
                <button
                  onClick={() => setIsGalleryOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Widget
                </button>
              </div>
            ) : (
              <DashboardCanvas 
                widgets={widgets}
                onConfigureWidget={handleConfigureWidget}
                onDeleteWidget={handleDeleteWidget}
                onUpdateWidget={handleWidgetUpdate}
                onMoveWidget={handleMoveWidget}
                showDeleteButton={(widget) => 
                  !isTemplateOnlyView && personalWidgets.some(w => w.id === widget.id)
                }
              />
            )}
          </main>
        </div>

        {!isTemplateOnlyView && (
          <>
            <WidgetGallery 
              isOpen={isGalleryOpen}
              onClose={() => setIsGalleryOpen(false)}
              onAddWidget={handleAddWidget}
            />

            <QuickAddPanel
              isOpen={isQuickAddOpen}
              onClose={() => setIsQuickAddOpen(false)}
              onAddWidgets={handleBulkAddWidgets}
            />

      <WidgetConfigModal
        isOpen={isConfigOpen}
        onClose={() => {
          setIsConfigOpen(false);
          setConfigWidget(null);
        }}
        widget={configWidget}
        onSave={(widget) => {
          handleUpdateWidget(widget);
        }}
      />
          </>
        )}
      </div>
    </SidebarProvider>
  );
};

export default Index;
