import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import { DashboardTemplate } from "@/types/template";
import { useNavigate } from "react-router-dom";

interface TemplateListProps {
  templates: DashboardTemplate[];
  onDeleteTemplate: (id: string) => void;
  onTogglePublish: (id: string) => void;
}

export const TemplateList = ({ templates, onDeleteTemplate, onTogglePublish }: TemplateListProps) => {
  const navigate = useNavigate();

  const handleCreateTemplate = () => {
    navigate('/admin/templates/new');
  };

  const handleEditTemplate = (id: string) => {
    navigate(`/admin/templates/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Dashboard Templates</h2>
          <p className="text-sm text-gray-600 mt-1">
            Create and manage widget dashboard templates
          </p>
        </div>
        <Button onClick={handleCreateTemplate}>
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={template.status === 'published' ? 'default' : 'secondary'}>
                      {template.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {template.widgets.length} widgets
                    </span>
                    <span className="text-sm text-gray-500">
                      Updated {new Date(template.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTogglePublish(template.id)}
                  >
                    {template.status === 'published' ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-2" />
                        Unpublish
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        Publish
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditTemplate(template.id)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteTemplate(template.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                Assigned to {template.communityIds.length} communities
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};