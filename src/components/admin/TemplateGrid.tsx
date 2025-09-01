import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Calendar } from "lucide-react";
import { DashboardTemplate } from "@/types/template";
import { mockCommunities } from "@/types/community";

interface TemplateGridProps {
  templates: DashboardTemplate[];
  onEditTemplate: (template: DashboardTemplate) => void;
  onDeleteTemplate: (id: string) => void;
}

export const TemplateGrid = ({ templates, onEditTemplate, onDeleteTemplate }: TemplateGridProps) => {
  const getCareTypeBadgeColor = (careType: string) => {
    const colors = {
      'Independent Living': 'bg-blue-100 text-blue-800',
      'Assisted Living': 'bg-green-100 text-green-800', 
      'Memory Care': 'bg-purple-100 text-purple-800',
      'Post Acute': 'bg-orange-100 text-orange-800'
    };
    return colors[careType as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <Card key={template.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditTemplate(template)}
                  className="h-8 px-2"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteTemplate(template.id)}
                  className="h-8 px-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Care Type</span>
              <Badge className={getCareTypeBadgeColor(template.careType)}>
                {template.careType}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Communities</span>
              <span className="text-sm font-semibold">{template.communityIds.length}</span>
            </div>
            
            <div className="text-xs text-gray-500">
              {mockCommunities
                .filter(c => template.communityIds.includes(c.id))
                .slice(0, 2)
                .map(c => c.name)
                .join(', ')}
              {template.communityIds.length > 2 && ` +${template.communityIds.length - 2} more`}
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Widgets</span>
              <span className="text-sm font-semibold">{template.widgets.length}</span>
            </div>
            
            <div className="flex items-center text-xs text-gray-500 pt-2 border-t">
              <Calendar className="w-3 h-3 mr-1" />
              Created {new Date(template.createdAt).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};