import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardTemplate } from "@/types/template";
import { mockCommunities } from "@/types/community";

interface TemplateSelectorProps {
  templates: DashboardTemplate[];
  selectedTemplate: DashboardTemplate | null;
  onTemplateSelect: (template: DashboardTemplate) => void;
}

export const TemplateSelector = ({ templates, selectedTemplate, onTemplateSelect }: TemplateSelectorProps) => {
  const [expandedTemplates, setExpandedTemplates] = useState<string[]>([]);

  const publishedTemplates = templates.filter(t => t.isPublished);
  const primaryTemplate = publishedTemplates[0];
  const secondaryTemplates = publishedTemplates.slice(1);

  const toggleExpanded = (templateId: string) => {
    setExpandedTemplates(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const getCommunityNames = (communityIds: string[]) => {
    return mockCommunities
      .filter(c => communityIds.includes(c.id))
      .map(c => c.name);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Dashboard Templates</h3>
        <p className="text-sm text-gray-600">Select a template to view its widgets</p>
      </div>

      <div className="p-4 space-y-2">
        {/* Primary Template */}
        {primaryTemplate && (
          <div className="space-y-2">
            <Button
              variant={selectedTemplate?.id === primaryTemplate.id ? "default" : "ghost"}
              className="w-full justify-start p-3 h-auto"
              onClick={() => onTemplateSelect(primaryTemplate)}
            >
              <div className="text-left">
                <div className="font-medium">{primaryTemplate.name}</div>
                <div className="text-sm text-gray-500">
                  {primaryTemplate.careType} • {primaryTemplate.communityIds.length} communities
                </div>
              </div>
            </Button>
          </div>
        )}

        {/* Secondary Templates */}
        {secondaryTemplates.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700 mt-4 mb-2">Additional Templates</div>
            {secondaryTemplates.map((template) => (
              <div key={template.id} className="space-y-1">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(template.id)}
                    className="p-1 h-6 w-6 mr-2"
                  >
                    {expandedTemplates.includes(template.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant={selectedTemplate?.id === template.id ? "default" : "ghost"}
                    className="flex-1 justify-start p-2 h-auto"
                    onClick={() => onTemplateSelect(template)}
                  >
                    <div className="text-left">
                      <div className="font-medium text-sm">{template.name}</div>
                      <div className="text-xs text-gray-500">
                        {template.careType} • {template.communityIds.length} communities
                      </div>
                    </div>
                  </Button>
                </div>

                {/* Expanded Community List */}
                {expandedTemplates.includes(template.id) && (
                  <div className="ml-8 p-2 bg-gray-50 rounded text-xs text-gray-600">
                    <div className="font-medium mb-1">Communities:</div>
                    <div className="space-y-1">
                      {getCommunityNames(template.communityIds).map((name) => (
                        <div key={name}>• {name}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};