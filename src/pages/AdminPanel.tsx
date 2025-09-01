import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TemplateList } from "@/components/admin/TemplateList";
import { TemplateEditor } from "@/components/admin/TemplateEditor";
import { CommunityAssignments } from "@/components/admin/CommunityAssignments";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { useTemplate } from "@/contexts/TemplateContext";
import { DashboardTemplate } from "@/types/template";
import { useParams } from "react-router-dom";

const AdminPanel = () => {
  const { templates, setTemplates, templateAssignments, setTemplateAssignments } = useTemplate();
  const { id } = useParams();
  
  // Determine view: dashboard (no route), list (/admin/templates), or editor (/admin/templates/:id)
  const isEditorView = !!id;
  const isListView = !id && window.location.pathname === '/admin/templates';
  const isDashboardView = !id && window.location.pathname === '/admin';
  
  const currentTemplate = id !== 'new' ? templates.find(t => t.id === id) : undefined;

  const handleSaveTemplate = (templateData: Omit<DashboardTemplate, 'id'>) => {
    const newTemplate: DashboardTemplate = {
      ...templateData,
      id: Date.now().toString(),
    };
    setTemplates([...templates, newTemplate]);
    
    // If template is published and has communityIds, create assignments
    if (templateData.isPublished && templateData.communityIds.length > 0) {
      const newAssignments = templateData.communityIds.map(communityId => ({
        communityId,
        templateId: newTemplate.id,
        isPrimary: true // New templates become primary for assigned communities
      }));
      setTemplateAssignments([...templateAssignments, ...newAssignments]);
    }
  };

  const handleUpdateTemplate = (templateId: string, templateData: Partial<DashboardTemplate>) => {
    setTemplates(templates.map(t => 
      t.id === templateId ? { ...t, ...templateData } : t
    ));
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
    // Also remove any assignments for this template
    setTemplateAssignments(templateAssignments.filter(a => a.templateId !== templateId));
  };

  const handleTogglePublish = (templateId: string) => {
    setTemplates(templates.map(t => 
      t.id === templateId 
        ? { 
            ...t, 
            status: t.status === 'published' ? 'draft' : 'published',
            isPublished: t.status !== 'published',
            updatedAt: new Date().toISOString()
          }
        : t
    ));
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center justify-between border-b bg-white px-4">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
              <h1 className="text-lg font-semibold text-gray-900">
                {isDashboardView ? 'Admin Dashboard' : isListView ? 'Template Management' : 'Template Editor'}
              </h1>
            </div>
            {isListView && (
              <CommunityAssignments
                templates={templates}
                assignments={templateAssignments}
                onUpdateAssignments={setTemplateAssignments}
              />
            )}
          </header>

          {isDashboardView ? (
            <div className="flex-1 p-6">
              <AdminDashboard />
            </div>
          ) : isListView ? (
            <div className="flex-1 p-6">
              <TemplateList
                templates={templates}
                onDeleteTemplate={handleDeleteTemplate}
                onTogglePublish={handleTogglePublish}
              />
            </div>
          ) : (
            <TemplateEditor
              template={currentTemplate}
              onSaveTemplate={handleSaveTemplate}
              onUpdateTemplate={handleUpdateTemplate}
              onPublishTemplate={(templateId, communityIds) => {
                const primaryAssignments = communityIds.map(communityId => ({
                  communityId,
                  templateId,
                  isPrimary: true
                }));
                setTemplateAssignments([...templateAssignments, ...primaryAssignments]);
              }}
            />
          )}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminPanel;