
export type WidgetType = 
  | 'people' 
  | 'activity' 
  | 'metric' 
  | 'goals' 
  | 'form' 
  | 'calendar'
  | 'toggle'
  | 'checkbox';

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  config: WidgetConfig;
  position: { x: number; y: number };
  size: { width: number; height: number };
  sortOrder?: number;
}

export interface WidgetConfig {
  // People Widget specific
  savedList?: string;
  displayType?: 'count' | 'grid';
  dateRange?: 'month-to-date' | 'last-30-days' | 'last-7-days' | 'custom';
  customDateStart?: string;
  customDateEnd?: string;
  watchlistOnly?: boolean;
  selectedColumns?: string[];
  
  // Activity Widget specific
  activityStatus?: 'open' | 'closed' | 'in-progress' | 'cancelled';
  activityTimeframe?: 'upcoming' | 'past-due' | 'next-scheduled';
  
  // Metric Widget specific
  measure?: string;
  aggregation?: 'sum' | 'count' | 'average';
  
  // Goals Widget specific
  goalId?: string;
  progressMode?: 'count' | 'grid';
  
  // Form Widget specific
  formId?: string;
  openBehavior?: 'inline' | 'modal';
  
  // Calendar Widget specific
  calendarViewType?: 'month' | 'week' | 'day' | 'agenda';
  calendarActivityTypes?: string[];
  calendarShowUpcoming?: boolean;
  calendarSource?: 'community' | 'lead' | 'team';
  
  // Toggle Widget specific
  toggleLabel?: string;
  toggleEnabled?: boolean;
  
  // Checkbox Widget specific
  checkboxLabel?: string;
  checkboxChecked?: boolean;
  
  // Goals field for Activity and Metric widgets
  goals?: string;
  
  // General config
  dataSource?: string;
  chartType?: 'bar' | 'line' | 'pie' | 'doughnut';
  metric?: string;
  timeframe?: string;
  filters?: Record<string, any>;
  displayOptions?: {
    showLegend?: boolean;
    showLabels?: boolean;
    color?: string;
  };
}

export interface WidgetTemplate {
  type: WidgetType;
  name: string;
  description: string;
  icon: string;
  defaultConfig: WidgetConfig;
}
