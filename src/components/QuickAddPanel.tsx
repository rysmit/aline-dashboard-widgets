import { QuickAddModal } from "./QuickAddModal";
import { WidgetConfig } from "@/types/widget";

interface QuickAddPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWidgets: (widgets: Array<{ type: string; title: string; config: WidgetConfig; size: { width: number; height: number } }>) => void;
}

export const QuickAddPanel = ({ isOpen, onClose, onAddWidgets }: QuickAddPanelProps) => {
  return (
    <QuickAddModal 
      isOpen={isOpen}
      onClose={onClose}
      onAddWidgets={onAddWidgets}
    />
  );
};