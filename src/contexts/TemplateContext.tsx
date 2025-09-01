import { createContext, useContext, useState, ReactNode } from 'react';
import { Template, TemplateAssignment } from '@/types/template';
import { Widget } from '@/types/widget';

export interface DashboardTemplate extends Template {
  careType: string;
  communityIds: string[];
  isPublished: boolean;
}

interface TemplateContextType {
  templates: DashboardTemplate[];
  setTemplates: (templates: DashboardTemplate[]) => void;
  templateAssignments: TemplateAssignment[];
  setTemplateAssignments: (assignments: TemplateAssignment[]) => void;
  getPublishedTemplatesForCommunity: (communityId: string) => DashboardTemplate[];
  getPrimaryTemplateForCommunity: (communityId: string) => DashboardTemplate | null;
  addPersonalWidget: (widget: Widget) => void;
  personalWidgets: Widget[];
  setPersonalWidgets: (widgets: Widget[]) => void;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

// Mock template assignments
const mockTemplateAssignments: TemplateAssignment[] = [
  { communityId: '1', templateId: '1', isPrimary: true },
];

const mockTemplates: DashboardTemplate[] = [
  {
    id: '1',
    name: 'Standard CRM Dashboard',
    careType: 'General',
    communityIds: ['1', '2'],
    widgets: [
      {
        id: 'template-1-widget-1',
        type: 'metric',
        title: 'Total Prospects',
        config: {
          measure: 'Total Count',
          timeframe: 'This Month',
          displayOptions: {
            showLegend: false,
            showLabels: true,
            color: 'blue'
          }
        },
        position: { x: 0, y: 0 },
        size: { width: 6, height: 4 },
        sortOrder: 1
      },
      {
        id: 'template-1-widget-2',
        type: 'activity',
        title: 'Recent Activities',
        config: {
          dataSource: 'Recent Interactions',
          timeframe: 'Last 7 Days',
          displayOptions: {
            showLegend: false,
            showLabels: true,
            color: 'green'
          }
        },
        position: { x: 6, y: 0 },
        size: { width: 6, height: 4 },
        sortOrder: 2
      }
    ],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    status: 'published',
    isPublished: true
  }
];

export const TemplateProvider = ({ children }: { children: ReactNode }) => {
  const [templates, setTemplates] = useState<DashboardTemplate[]>(mockTemplates);
  const [templateAssignments, setTemplateAssignments] = useState<TemplateAssignment[]>(mockTemplateAssignments);
  const [personalWidgets, setPersonalWidgets] = useState<Widget[]>([]);

  const getPublishedTemplatesForCommunity = (communityId: string) => {
    const assignedTemplateIds = templateAssignments
      .filter(assignment => assignment.communityId === communityId)
      .map(assignment => assignment.templateId);
    
    return templates.filter(template => 
      template.status === 'published' && assignedTemplateIds.includes(template.id)
    );
  };

  const getPrimaryTemplateForCommunity = (communityId: string) => {
    const primaryAssignment = templateAssignments.find(
      assignment => assignment.communityId === communityId && assignment.isPrimary
    );
    
    if (!primaryAssignment) return null;
    
    return templates.find(template => 
      template.id === primaryAssignment.templateId && template.status === 'published'
    ) || null;
  };

  const addPersonalWidget = (widget: Widget) => {
    setPersonalWidgets(prev => [...prev, widget]);
  };

  const value = {
    templates,
    setTemplates,
    templateAssignments,
    setTemplateAssignments,
    getPublishedTemplatesForCommunity,
    getPrimaryTemplateForCommunity,
    addPersonalWidget,
    personalWidgets,
    setPersonalWidgets,
  };

  return (
    <TemplateContext.Provider value={value}>
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplate = () => {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error('useTemplate must be used within a TemplateProvider');
  }
  return context;
};