import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Save, Settings } from "lucide-react";
import { Widget, WidgetConfig, WidgetType } from "@/types/widget";
import { useToast } from "@/hooks/use-toast";
import { WidgetBasicsStep } from "./widget-config/WidgetBasicsStep";
import { WidgetTypeSettingsStep } from "./widget-config/WidgetTypeSettingsStep";
import { WidgetDisplayStep } from "./widget-config/WidgetDisplayStep";

interface WidgetConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  widgets: Widget[];
  isBulkMode?: boolean;
  onSave: (widgets: Widget[]) => void;
}

type ConfigStep = 'basics' | 'settings' | 'display';

const stepNames = {
  basics: 'Basics',
  settings: 'Type Settings', 
  display: 'Display & Review'
};

export const WidgetConfigDrawer = ({ 
  isOpen, 
  onClose, 
  widgets, 
  isBulkMode = false,
  onSave 
}: WidgetConfigDrawerProps) => {
  const [currentStep, setCurrentStep] = useState<ConfigStep>('basics');
  const [localWidgets, setLocalWidgets] = useState<Widget[]>([]);
  const [applyToAll, setApplyToAll] = useState(true);
  const [expandedWidgetIndex, setExpandedWidgetIndex] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (widgets.length > 0) {
      setLocalWidgets([...widgets]);
    }
  }, [widgets]);

  const handleNext = () => {
    const steps: ConfigStep[] = ['basics', 'settings', 'display'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: ConfigStep[] = ['basics', 'settings', 'display'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleSave = () => {
    // Validate required fields
    const hasValidation = localWidgets.every(widget => {
      if (!widget.title.trim()) return false;
      if (widget.type === 'people' && !widget.config.savedList) return false;
      if (widget.type === 'activity' && !widget.config.dataSource) return false;
      if (widget.type === 'metric' && !widget.config.measure) return false;
      return true;
    });

    if (!hasValidation) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    onSave(localWidgets);
    toast({
      title: "Success",
      description: `${isBulkMode ? 'Bulk configuration' : 'Widget'} saved successfully.`
    });
    onClose();
  };

  const updateWidget = (index: number, updates: Partial<Widget>) => {
    const newWidgets = [...localWidgets];
    newWidgets[index] = { ...newWidgets[index], ...updates };
    setLocalWidgets(newWidgets);
  };

  const updateConfig = (index: number, key: string, value: any) => {
    const newWidgets = [...localWidgets];
    newWidgets[index] = {
      ...newWidgets[index],
      config: {
        ...newWidgets[index].config,
        [key]: value
      }
    };
    setLocalWidgets(newWidgets);
  };

  const updateDisplayOption = (index: number, key: string, value: any) => {
    const newWidgets = [...localWidgets];
    newWidgets[index] = {
      ...newWidgets[index],
      config: {
        ...newWidgets[index].config,
        displayOptions: {
          ...newWidgets[index].config.displayOptions,
          [key]: value
        }
      }
    };
    setLocalWidgets(newWidgets);
  };

  const applyBulkUpdate = (field: string, value: any, isConfig = false, isDisplayOption = false) => {
    if (!applyToAll || !isBulkMode) return;

    const newWidgets = localWidgets.map(widget => {
      if (isDisplayOption) {
        return {
          ...widget,
          config: {
            ...widget.config,
            displayOptions: {
              ...widget.config.displayOptions,
              [field]: value
            }
          }
        };
      } else if (isConfig) {
        return {
          ...widget,
          config: {
            ...widget.config,
            [field]: value
          }
        };
      } else {
        return {
          ...widget,
          [field]: value
        };
      }
    });
    setLocalWidgets(newWidgets);
  };

  if (localWidgets.length === 0) return null;

  const primaryWidget = localWidgets[0];
  const steps: ConfigStep[] = ['basics', 'settings', 'display'];
  const currentStepIndex = steps.indexOf(currentStep);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:w-[700px] overflow-hidden">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>
              {isBulkMode 
                ? `Configure ${localWidgets.length} Widgets`
                : `Configure Widget: ${primaryWidget.title}`
              }
            </SheetTitle>
            <Badge variant="secondary">
              Step {currentStepIndex + 1} of {steps.length}
            </Badge>
          </div>
        </SheetHeader>

        <div className="flex flex-col h-full mt-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4 pb-6 border-b">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`flex items-center space-x-2 ${
                  index <= currentStepIndex ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index < currentStepIndex
                      ? 'bg-primary text-primary-foreground'
                      : index === currentStepIndex
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-sm font-medium">{stepNames[step]}</span>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4 ml-2" />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="flex-1 overflow-y-auto py-6">
            {currentStep === 'basics' && (
              <WidgetBasicsStep
                widgets={localWidgets}
                isBulkMode={isBulkMode}
                applyToAll={applyToAll}
                onApplyToAllChange={setApplyToAll}
                onUpdateWidget={updateWidget}
                onBulkUpdate={applyBulkUpdate}
                expandedWidgetIndex={expandedWidgetIndex}
                onToggleExpanded={setExpandedWidgetIndex}
              />
            )}

            {currentStep === 'settings' && (
              <WidgetTypeSettingsStep
                widgets={localWidgets}
                isBulkMode={isBulkMode}
                applyToAll={applyToAll}
                onUpdateConfig={updateConfig}
                onBulkUpdate={applyBulkUpdate}
                expandedWidgetIndex={expandedWidgetIndex}
                onToggleExpanded={setExpandedWidgetIndex}
              />
            )}

            {currentStep === 'display' && (
              <WidgetDisplayStep
                widgets={localWidgets}
                isBulkMode={isBulkMode}
                applyToAll={applyToAll}
                onUpdateDisplayOption={updateDisplayOption}
                onBulkUpdate={applyBulkUpdate}
                expandedWidgetIndex={expandedWidgetIndex}
                onToggleExpanded={setExpandedWidgetIndex}
              />
            )}
          </div>

          {/* Navigation & Actions */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStepIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center space-x-3">
              {currentStepIndex < steps.length - 1 ? (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  {isBulkMode ? `Save All (${localWidgets.length})` : 'Save Widget'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};