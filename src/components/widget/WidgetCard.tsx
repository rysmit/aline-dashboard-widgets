
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, X, Edit2, Check } from "lucide-react";
import { Widget } from "@/types/widget";
import { WidgetContentRenderer } from "./WidgetContentRenderer";
import { useState } from "react";

interface WidgetCardProps {
  widget: Widget;
  onConfigureWidget: (widget: Widget) => void;
  onDeleteWidget: (widgetId: string) => void;
  onUpdateWidget: (widgetId: string, updates: Partial<Widget>) => void;
  showDeleteButton?: boolean;
}

export const WidgetCard = ({ widget, onConfigureWidget, onDeleteWidget, onUpdateWidget, showDeleteButton = true }: WidgetCardProps) => {
  const isGridWidget = widget.type === 'people' && widget.config.displayType === 'grid';
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(widget.title);
  
  const handleSaveTitle = () => {
    if (editTitle.trim() !== widget.title) {
      onUpdateWidget(widget.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(widget.title);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };
  
  return (
    <div className={`bg-white rounded-lg border border-secondary-200 shadow-card hover:shadow-card-hover transition-all duration-200 group ${isGridWidget ? 'col-span-2 row-span-2' : ''}`}>
      <div className="flex flex-col space-y-1.5 p-6 pb-3">
        <div className="flex items-center justify-between">
          {isEditing ? (
            <div className="flex items-center space-x-2 flex-1">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={handleSaveTitle}
                className="text-sm font-semibold h-6 px-2"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleSaveTitle}
                className="h-6 w-6"
              >
                <Check className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 flex-1">
              <h3 className="text-sm font-semibold text-secondary-900 leading-none tracking-tight">{widget.title}</h3>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsEditing(true)}
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <Edit2 className="w-3 h-3" />
              </Button>
            </div>
          )}
          
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button 
              variant="ghost" 
              size="icon-sm" 
              onClick={() => onConfigureWidget(widget)}
              className="h-7 w-7"
            >
              <Settings className="w-3 h-3" />
            </Button>
            {showDeleteButton && (
              <Button 
                variant="ghost" 
                size="icon-sm" 
                onClick={() => onDeleteWidget(widget.id)}
                className="h-7 w-7 hover:bg-destructive-50 hover:text-destructive-600"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-6 pt-0 h-full">
        <div className={`bg-secondary-50 rounded-lg flex items-center justify-center border border-secondary-100 ${isGridWidget ? 'h-[calc(100%-4rem)] p-4' : 'p-6 min-h-[120px]'}`}>
          <WidgetContentRenderer widget={widget} />
        </div>
      </div>
    </div>
  );
};
