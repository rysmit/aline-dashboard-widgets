import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Save, X } from "lucide-react";
import { Widget, WidgetConfig, WidgetType } from "@/types/widget";
import { useToast } from "@/hooks/use-toast";
import { WidgetBasicsStep } from "./widget-config/WidgetBasicsStep";
import { WidgetTypeSettingsStep } from "./widget-config/WidgetTypeSettingsStep";
import { WidgetDisplayStep } from "./widget-config/WidgetDisplayStep";

interface WidgetConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  widget?: Widget | null;
  onSave: (widget: Widget) => void;
}

type ConfigStep = 'basics' | 'settings' | 'display';

const stepNames = {
  basics: 'Basics',
  settings: 'Type Settings', 
  display: 'Display & Review'
};

export const WidgetConfigModal = ({ 
  isOpen, 
  onClose, 
  widget,
  onSave 
}: WidgetConfigModalProps) => {
  const [currentStep, setCurrentStep] = useState<ConfigStep>('basics');
  const [localWidget, setLocalWidget] = useState<Widget | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (widget) {
      setLocalWidget({ ...widget });
    } else if (isOpen) {
      // Create a new widget template
      const newWidget: Widget = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type: 'people',
        title: '',
        config: {
          displayType: 'count',
          displayOptions: {
            showLegend: false,
            showLabels: false,
            color: '#3b82f6'
          }
        },
        position: { x: 0, y: 0 },
        size: { width: 1, height: 1 }
      };
      setLocalWidget(newWidget);
    }
  }, [widget, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep('basics');
    }
  }, [isOpen]);

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
    if (!localWidget) return;

    // Validate required fields
    if (!localWidget.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Widget title is required.",
        variant: "destructive"
      });
      return;
    }

    if (localWidget.type === 'people' && !localWidget.config.savedList) {
      toast({
        title: "Validation Error", 
        description: "Please select a saved list for People widgets.",
        variant: "destructive"
      });
      return;
    }

    if (localWidget.type === 'activity' && !localWidget.config.savedList) {
      toast({
        title: "Validation Error",
        description: "Please select a saved list for Activity widgets.",
        variant: "destructive"
      });
      return;
    }

    if (localWidget.type === 'metric' && !localWidget.config.measure) {
      toast({
        title: "Validation Error",
        description: "Please select a metric for Metric widgets.",
        variant: "destructive"
      });
      return;
    }

    if (localWidget.type === 'goals' && !localWidget.config.goalId) {
      toast({
        title: "Validation Error",
        description: "Please select a goal for Goals widgets.",
        variant: "destructive"
      });
      return;
    }

    if (localWidget.type === 'form' && !localWidget.config.formId) {
      toast({
        title: "Validation Error",
        description: "Please select a form for Form widgets.",
        variant: "destructive"
      });
      return;
    }

    onSave(localWidget);
    toast({
      title: "Success",
      description: "Widget saved successfully."
    });
    onClose();
  };

  const updateWidget = (index: number, updates: Partial<Widget>) => {
    if (!localWidget) return;
    setLocalWidget({ ...localWidget, ...updates });
  };

  const updateConfig = (index: number, key: string, value: any) => {
    if (!localWidget) return;
    setLocalWidget({
      ...localWidget,
      config: {
        ...localWidget.config,
        [key]: value
      }
    });
  };

  const updateDisplayOption = (index: number, key: string, value: any) => {
    if (!localWidget) return;
    setLocalWidget({
      ...localWidget,
      config: {
        ...localWidget.config,
        displayOptions: {
          ...localWidget.config.displayOptions,
          [key]: value
        }
      }
    });
  };

  if (!localWidget) return null;

  const steps: ConfigStep[] = ['basics', 'settings', 'display'];
  const currentStepIndex = steps.indexOf(currentStep);
  const widgets = [localWidget];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[720px] w-full max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle>
              {widget ? localWidget.title || 'Configure Widget' : 'New Widget'}
            </DialogTitle>
            <Badge variant="secondary">
              Step {currentStepIndex + 1} of {steps.length}
            </Badge>
          </div>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 py-4 border-b">
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
              <span className="text-sm font-medium hidden sm:block">{stepNames[step]}</span>
              {index < steps.length - 1 && (
                <ChevronRight className="w-4 h-4 ml-2" />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto py-4">
          {currentStep === 'basics' && (
            <WidgetBasicsStep
              widgets={widgets}
              isBulkMode={false}
              applyToAll={true}
              onApplyToAllChange={() => {}}
              onUpdateWidget={updateWidget}
              onBulkUpdate={() => {}}
              expandedWidgetIndex={null}
              onToggleExpanded={() => {}}
            />
          )}

          {currentStep === 'settings' && (
            <WidgetTypeSettingsStep
              widgets={widgets}
              isBulkMode={false}
              applyToAll={true}
              onUpdateConfig={updateConfig}
              onBulkUpdate={() => {}}
              expandedWidgetIndex={null}
              onToggleExpanded={() => {}}
            />
          )}

          {currentStep === 'display' && (
            <WidgetDisplayStep
              widgets={widgets}
              isBulkMode={false}
              applyToAll={true}
              onUpdateDisplayOption={updateDisplayOption}
              onBulkUpdate={() => {}}
              expandedWidgetIndex={null}
              onToggleExpanded={() => {}}
            />
          )}
        </div>

        {/* Navigation & Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStepIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {currentStepIndex < steps.length - 1 ? (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Widget
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};