import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Save, Zap } from "lucide-react";
import { DashboardTemplate } from "@/types/template";
import { Widget, WidgetType, WidgetConfig } from "@/types/widget";
import { DashboardCanvas } from "@/components/DashboardCanvas";
import { WidgetGallery } from "@/components/WidgetGallery";
import { QuickAddPanel } from "@/components/QuickAddPanel";
import { WidgetConfigModal } from "@/components/WidgetConfigModal";
import { SavePublishModal } from "@/components/admin/SavePublishModal";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface TemplateEditorProps {
  template?: DashboardTemplate;
  onSaveTemplate: (template: Omit<DashboardTemplate, 'id'>) => void;
  onUpdateTemplate: (id: string, template: Partial<DashboardTemplate>) => void;
  onPublishTemplate: (templateId: string, communityIds: string[]) => void;
}

export const TemplateEditor = ({ template, onSaveTemplate, onUpdateTemplate, onPublishTemplate }: TemplateEditorProps) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNewTemplate = id === 'new';
  
  const [name, setName] = useState(template?.name || '');
  const [widgets, setWidgets] = useState<Widget[]>(template?.widgets || []);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [configWidget, setConfigWidget] = useState<Widget | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isSavePublishOpen, setIsSavePublishOpen] = useState(false);

  useEffect(() => {
    if (template) {
      setName(template.name);
      setWidgets(template.widgets);
    }
  }, [template]);

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
        displayOptions: {
          showLegend: false,
          showLabels: false,
          color: 'blue'
        },
        // Apply preset config last to override defaults
        ...presetConfig
      },
      position: { x: 0, y: 0 },
      size: { width: 6, height: 4 },
      sortOrder: widgets.length + 1
    };
    
    setWidgets([...widgets, newWidget]);
    
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
    setWidgets(updatedWidgets);
  };

  const handleUpdateWidget = (updatedWidget: Widget) => {
    setWidgets(widgets.map(w => w.id === updatedWidget.id ? updatedWidget : w));
    setIsConfigOpen(false);
    setConfigWidget(null);
  };

  const handleDeleteWidget = (widgetId: string) => {
    setWidgets(widgets.filter(w => w.id !== widgetId));
  };

  const handleMoveWidget = (fromIndex: number, toIndex: number) => {
    const newWidgets = [...widgets];
    const [movedWidget] = newWidgets.splice(fromIndex, 1);
    newWidgets.splice(toIndex, 0, movedWidget);
    
    // Update sort orders
    const updatedWidgets = newWidgets.map((widget, index) => ({
      ...widget,
      sortOrder: index + 1
    }));
    
    setWidgets(updatedWidgets);
  };

  const handleSave = () => {
    if (isNewTemplate) {
      setIsSavePublishOpen(true);
    } else {
      // For existing templates, just save
      if (!name.trim()) return;

      const templateData = {
        name: name.trim(),
        status: template?.status || 'draft' as const,
        widgets: widgets.map((widget, index) => ({
          ...widget,
          sortOrder: index + 1
        })),
        updatedAt: new Date().toISOString(),
        createdAt: template?.createdAt || new Date().toISOString(),
        careType: template?.careType || '',
        communityIds: template?.communityIds || [],
        isPublished: template?.isPublished || false,
      };

      if (template) {
        onUpdateTemplate(template.id, templateData);
      }
      
      navigate('/admin/templates');
    }
  };

  const handleSaveAndPublish = (templateName: string, communityIds: string[]) => {
    const templateData = {
      name: templateName,
      status: 'published' as const,
      widgets: widgets.map((widget, index) => ({
        ...widget,
        sortOrder: index + 1
      })),
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      careType: 'General',
      communityIds,
      isPublished: true,
    };

    onSaveTemplate(templateData);
    navigate('/admin/templates');
  };

  const handleBack = () => {
    navigate('/admin/templates');
  };

  const handleBulkAddWidgets = (widgetConfigs: Array<{ type: string; title: string; config: WidgetConfig; size: { width: number; height: number } }>) => {
    console.log('Adding bulk widgets to template:', widgetConfigs);
    
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
        size,
        sortOrder: widgets.length + index + 1
      };
    });

    setWidgets([...widgets, ...newWidgets]);
    console.log('Bulk widgets added to template successfully');
  };

  return (
    <div className="flex-1 flex flex-col">
      <header className="h-16 flex items-center justify-between border-b bg-white px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Templates
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {isNewTemplate ? 'Create Template' : 'Edit Template'}
            </h1>
            {template && (
              <Badge variant={template.status === 'published' ? 'default' : 'secondary'}>
                {template.status}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="default" onClick={() => setIsQuickAddOpen(true)}>
            <Zap className="w-4 h-4 mr-2" />
            Add Widgets
          </Button>
          <Button variant="outline" onClick={() => setIsGalleryOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Single Widget
          </Button>
          <Button onClick={handleSave} disabled={isNewTemplate ? widgets.length === 0 : false}>
            <Save className="w-4 h-4 mr-2" />
            {isNewTemplate ? 'Save & Publish' : 'Update Template'}
          </Button>
        </div>
      </header>
      
      <div className="flex-1 p-6">
        <DashboardCanvas 
          widgets={widgets}
          onConfigureWidget={handleConfigureWidget}
          onDeleteWidget={handleDeleteWidget}
          onUpdateWidget={handleWidgetUpdate}
          onMoveWidget={handleMoveWidget}
          showDeleteButton={() => true}
        />
      </div>

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

      <SavePublishModal
        isOpen={isSavePublishOpen}
        onClose={() => setIsSavePublishOpen(false)}
        onSave={handleSaveAndPublish}
        initialName={name}
      />
    </div>
  );
};