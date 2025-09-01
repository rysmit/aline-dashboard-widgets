import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";
import { Community, mockCommunities } from "@/types/community";
import { DashboardTemplate, TemplateAssignment } from "@/types/template";

interface CommunityAssignmentsProps {
  templates: DashboardTemplate[];
  assignments: TemplateAssignment[];
  onUpdateAssignments: (assignments: TemplateAssignment[]) => void;
}

export const CommunityAssignments = ({ templates, assignments, onUpdateAssignments }: CommunityAssignmentsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const publishedTemplates = templates.filter(t => t.status === 'published');

  const handleAssignmentChange = (communityId: string, templateId: string | null) => {
    const newAssignments = assignments.filter(a => a.communityId !== communityId);
    
    if (templateId) {
      newAssignments.push({
        communityId,
        templateId,
        isPrimary: true
      });
    }
    
    onUpdateAssignments(newAssignments);
  };

  const getAssignedTemplate = (communityId: string) => {
    const assignment = assignments.find(a => a.communityId === communityId && a.isPrimary);
    return assignment ? templates.find(t => t.id === assignment.templateId) : null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Community Assignments
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Templates to Communities</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Assign one primary published template per community. This template will be the default dashboard for users in that community.
          </p>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Community</TableHead>
                <TableHead>Care Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Assigned Template</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCommunities.map((community) => {
                const assignedTemplate = getAssignedTemplate(community.id);
                return (
                  <TableRow key={community.id}>
                    <TableCell className="font-medium">{community.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{community.careType}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{community.location}</TableCell>
                    <TableCell>
                      {assignedTemplate ? (
                        <Badge>{assignedTemplate.name}</Badge>
                      ) : (
                        <span className="text-sm text-gray-400">No template assigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={assignedTemplate?.id || ""}
                        onValueChange={(value) => handleAssignmentChange(community.id, value || null)}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select template..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No template</SelectItem>
                          {publishedTemplates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};