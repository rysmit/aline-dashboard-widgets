import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { mockCommunities } from "@/types/community";

interface SavePublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, communityIds: string[]) => void;
  initialName?: string;
}

export const SavePublishModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialName = '' 
}: SavePublishModalProps) => {
  const [name, setName] = useState(initialName);
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>([]);

  const handleCommunityToggle = (communityId: string) => {
    setSelectedCommunities(prev => 
      prev.includes(communityId) 
        ? prev.filter(id => id !== communityId)
        : [...prev, communityId]
    );
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim(), selectedCommunities);
    onClose();
    setName('');
    setSelectedCommunities([]);
  };

  const handleClose = () => {
    onClose();
    setName(initialName);
    setSelectedCommunities([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Save & Publish Template</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="template-name">Template Name</Label>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter template name..."
              className="mt-1"
            />
          </div>

          <div>
            <Label>Publish to Communities</Label>
            <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
              {mockCommunities.map((community) => (
                <div key={community.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={community.id}
                    checked={selectedCommunities.includes(community.id)}
                    onCheckedChange={() => handleCommunityToggle(community.id)}
                  />
                  <Label 
                    htmlFor={community.id} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {community.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!name.trim()}>
              Save & Publish
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};