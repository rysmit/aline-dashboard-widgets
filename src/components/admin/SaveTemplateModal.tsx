import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CommunitySelector } from "@/components/admin/CommunitySelector";

interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, careType: string, communities: string[]) => void;
  initialName?: string;
  initialCareType?: string;
  initialCommunities?: string[];
}

const careTypes = [
  'Independent Living',
  'Assisted Living', 
  'Memory Care',
  'Post Acute'
];

export const SaveTemplateModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialName = '', 
  initialCareType = '',
  initialCommunities = []
}: SaveTemplateModalProps) => {
  const [name, setName] = useState(initialName);
  const [careType, setCareType] = useState(initialCareType);
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>(initialCommunities);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setCareType(initialCareType);
      setSelectedCommunities(initialCommunities);
    }
  }, [isOpen, initialName, initialCareType, initialCommunities]);

  const handleSave = () => {
    if (name.trim() && careType && selectedCommunities.length > 0) {
      onSave(name.trim(), careType, selectedCommunities);
      setName('');
      setCareType('');
      setSelectedCommunities([]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Dashboard Template</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="templateName">Template Name</Label>
            <Input
              id="templateName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter template name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="careType">Care Type</Label>
            <Select value={careType} onValueChange={setCareType}>
              <SelectTrigger>
                <SelectValue placeholder="Select care type" />
              </SelectTrigger>
              <SelectContent>
                {careTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <CommunitySelector
            selectedCommunities={selectedCommunities}
            onCommunitiesChange={setSelectedCommunities}
          />
        </div>
        
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!name.trim() || !careType || selectedCommunities.length === 0}
          >
            Save Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};