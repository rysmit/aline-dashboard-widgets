import { useState, useMemo } from "react";
import { Check, ChevronsUpDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Community, mockCommunities } from "@/types/community";
import { cn } from "@/lib/utils";

interface CommunitySelectorProps {
  selectedCommunities: string[];
  onCommunitiesChange: (communities: string[]) => void;
}

const careTypes = ['All', 'Independent Living', 'Assisted Living', 'Memory Care', 'Post Acute'];

export const CommunitySelector = ({ selectedCommunities, onCommunitiesChange }: CommunitySelectorProps) => {
  const [open, setOpen] = useState(false);
  const [careTypeFilter, setCareTypeFilter] = useState('All');

  const filteredCommunities = useMemo(() => {
    return mockCommunities.filter(community => 
      careTypeFilter === 'All' || community.careType === careTypeFilter
    );
  }, [careTypeFilter]);

  const toggleCommunity = (communityId: string) => {
    if (selectedCommunities.includes(communityId)) {
      onCommunitiesChange(selectedCommunities.filter(id => id !== communityId));
    } else {
      onCommunitiesChange([...selectedCommunities, communityId]);
    }
  };

  const getSelectedCommunityNames = () => {
    return mockCommunities
      .filter(community => selectedCommunities.includes(community.id))
      .map(community => community.name);
  };

  return (
    <div className="space-y-2">
      <Label>Communities</Label>
      
      {/* Care Type Filter */}
      <div className="flex items-center gap-2 mb-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <Select value={careTypeFilter} onValueChange={setCareTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {careTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Community Multi-Select */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedCommunities.length === 0 
              ? "Select communities..."
              : `${selectedCommunities.length} communities selected`
            }
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search communities..." />
            <CommandEmpty>No communities found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {filteredCommunities.map((community) => (
                <CommandItem
                  key={community.id}
                  value={community.name}
                  onSelect={() => toggleCommunity(community.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCommunities.includes(community.id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{community.name}</div>
                    <div className="text-sm text-gray-500">
                      {community.careType} • {community.location}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Communities Display */}
      {selectedCommunities.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {getSelectedCommunityNames().map((name) => (
            <Badge key={name} variant="secondary" className="text-xs">
              {name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};