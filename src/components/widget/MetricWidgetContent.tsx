
import { BarChart3 } from "lucide-react";
import { Widget } from "@/types/widget";
import { getColorClass } from "./WidgetIconUtils";

interface MetricWidgetContentProps {
  widget: Widget;
}

export const MetricWidgetContent = ({ widget }: MetricWidgetContentProps) => {
  const { config } = widget;
  const measure = config.measure;
  const timeframe = config.timeframe;
  const goals = config.goals;
  const primaryColor = config.displayOptions?.color || 'green';
  
  if (!measure) {
    return (
      <div className="text-center text-gray-500">
        <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Metric Widget Preview</p>
        <p className="text-xs text-gray-400 mt-1">Click settings to configure</p>
      </div>
    );
  }

  const getMockValue = (measureType: string) => {
    const values = {
      'tour-to-move-in': '24%',
      'average-response-time': '2.3 hrs',
      'inquiry-to-move-in': '12%',
      'occupancy-rate': '94%',
      'lead-conversion': '18%'
    };
    return values[measureType as keyof typeof values] || '0';
  };

  const getMeasureLabel = (measureType: string) => {
    const labels = {
      'tour-to-move-in': 'Tour to Move In',
      'average-response-time': 'Average Response Time',
      'inquiry-to-move-in': 'Inquiry to Move In',
      'occupancy-rate': 'Occupancy Rate',
      'lead-conversion': 'Lead Conversion'
    };
    return labels[measureType as keyof typeof labels] || measureType;
  };

  const getGoalsLabel = (goalsType: string) => {
    const labels = {
      'occupancy': 'Occupancy',
      'average-response-time': 'Average Response Time'
    };
    return labels[goalsType as keyof typeof labels] || goalsType;
  };

  const getMockGoalValue = (goalsType: string) => {
    const goalValues = {
      'occupancy': '95%',
      'average-response-time': '< 1.5 hrs'
    };
    return goalValues[goalsType as keyof typeof goalValues] || '90%';
  };

  return (
    <div className="text-center">
      <div className={`text-3xl font-bold mb-2 ${getColorClass(primaryColor)}`}>{getMockValue(measure)}</div>
      <div className="text-sm text-gray-600 mb-1">
        {getMeasureLabel(measure)}
      </div>
      {goals && (
        <div className="text-xs text-green-600 font-medium mb-1">
          Goal: {getMockGoalValue(goals)} {getGoalsLabel(goals)}
        </div>
      )}
      <div className="text-xs text-gray-500">
        {timeframe ? timeframe.replace(/\d+/, (match) => `Last ${match}`).toUpperCase() : 'ALL TIME'}
      </div>
    </div>
  );
};
