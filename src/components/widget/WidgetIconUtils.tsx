
import { Users, Activity, BarChart3, Target, FileText, Calendar, ToggleLeft, CheckSquare } from "lucide-react";

export const getWidgetIcon = (type: string) => {
  const icons = {
    people: Users,
    activity: Activity,
    metric: BarChart3,
    goals: Target,
    form: FileText,
    calendar: Calendar,
    toggle: ToggleLeft,
    checkbox: CheckSquare
  };
  return icons[type as keyof typeof icons] || Users;
};

export const getColorClass = (color: string) => {
  const colorMap = {
    blue: 'text-primary-600',
    green: 'text-success-600',
    purple: 'text-purple-600',
    orange: 'text-warning-600',
    red: 'text-destructive-600'
  };
  return colorMap[color as keyof typeof colorMap] || 'text-primary-600';
};
