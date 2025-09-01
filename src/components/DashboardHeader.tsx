
import { Button } from "@/components/ui/button";
import { Plus, Settings, Save, Zap } from "lucide-react";

interface DashboardHeaderProps {
  onAddWidget: () => void;
  onQuickAdd: () => void;
  widgetCount: number;
}

export const DashboardHeader = ({ onAddWidget, onQuickAdd, widgetCount }: DashboardHeaderProps) => {
  return (
    <header className="bg-white border-b border-secondary-200 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-secondary-900">CRM Dashboard</h1>
            <p className="text-sm text-secondary-600 mt-1">
              {widgetCount} widgets configured
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="h-8">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            
            <Button variant="outline" size="sm" className="h-8">
              <Save className="w-4 h-4 mr-2" />
              Save Layout
            </Button>
            
            <Button onClick={onQuickAdd} variant="default" size="sm" className="h-8">
              <Zap className="w-4 h-4 mr-2" />
              Add Widgets
            </Button>
            
            <Button onClick={onAddWidget} variant="outline" size="sm" className="h-8">
              <Plus className="w-4 h-4 mr-2" />
              Single Widget
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
