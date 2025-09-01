import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Users, FileText, Plus, Eye } from "lucide-react";
import { useTemplate } from "@/contexts/TemplateContext";
import { mockCommunities } from "@/types/community";
import { useNavigate } from "react-router-dom";

export const AdminDashboard = () => {
  const { templates, templateAssignments } = useTemplate();
  const navigate = useNavigate();
  
  const publishedTemplates = templates.filter(t => t.status === 'published');
  const draftTemplates = templates.filter(t => t.status === 'draft');
  const assignedCommunities = new Set(templateAssignments.map(a => a.communityId)).size;
  const unassignedCommunities = mockCommunities.length - assignedCommunities;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-600 mt-1">
          Manage dashboard templates and community assignments
        </p>
      </div>


      {/* Templates Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Templates</CardTitle>
          <Button onClick={() => navigate('/admin/templates/new')} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {templates.slice(0, 5).map((template) => (
              <div key={template.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant={template.status === 'published' ? 'default' : 'secondary'}>
                    {template.status}
                  </Badge>
                  <div>
                    <p className="text-sm text-gray-600">
                      {template.widgets.length} widgets • Updated {new Date(template.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/admin/templates/${template.id}`)}
                >
                  Edit
                </Button>
              </div>
            ))}
            {templates.length === 0 && (
              <p className="text-gray-500 text-center py-4">No templates created yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};