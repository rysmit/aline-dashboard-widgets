
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";
import { Widget } from "@/types/widget";
import { getColorClass } from "./WidgetIconUtils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ActivityWidgetContentProps {
  widget: Widget;
}

export const ActivityWidgetContent = ({ widget }: ActivityWidgetContentProps) => {
  const { config } = widget;
  const savedList = config.savedList;
  const timeframe = config.timeframe;
  const goals = config.goals;
  const displayType = config.displayType || 'count';
  const primaryColor = config.displayOptions?.color || 'blue';
  
  if (!savedList) {
    return (
      <div className="text-center text-gray-500">
        <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Activity Widget Preview</p>
        <p className="text-xs text-gray-400 mt-1">Click settings to configure</p>
      </div>
    );
  }

  const getMockCount = (list: string) => {
    switch(list) {
      case 'past-due-activities': return 23;
      case 'people-no-next-activity': return 8; 
      case 'tours-mtd': return 15;
      case 'upcoming-activities': return 34;
      case 'call-ins': return 12;
      default: return 0;
    }
  };

  const getListLabel = (list: string) => {
    switch(list) {
      case 'past-due-activities': return 'Past Due Activities';
      case 'people-no-next-activity': return 'People with No Next Activity';
      case 'tours-mtd': return 'Tours (MTD)';
      case 'upcoming-activities': return 'Upcoming Activities';
      case 'call-ins': return 'Call Ins';
      default: return list;
    }
  };

  const getGoalsLabel = (goalsType: string) => {
    const labels = {
      'tours': 'Tours',
      'call-ins': 'Call Ins',
      'call-outs': 'Call Outs',
      'in-person-tours': 'In Person Tours',
      'home-visits': 'Home Visits',
      'virtual-tours': 'Virtual Tours'
    };
    return labels[goalsType as keyof typeof labels] || goalsType;
  };

  const getMockGoalCount = (goalsType: string) => {
    const goalCounts = {
      'tours': 15,
      'call-ins': 25,
      'call-outs': 30,
      'in-person-tours': 20,
      'home-visits': 10,
      'virtual-tours': 12
    };
    return goalCounts[goalsType as keyof typeof goalCounts] || 20;
  };

  const mockCount = getMockCount(savedList || '');
  const listLabel = getListLabel(savedList || '');

  if (displayType === 'count') {
    return (
      <div className="text-center">
        <div className={`text-3xl font-bold mb-2 ${getColorClass(primaryColor)}`}>{mockCount}</div>
        <div className="text-sm text-gray-600 mb-1">
          {listLabel}
        </div>
        {goals && (
          <div className="text-xs text-blue-600 font-medium mb-1">
            Goal: {getMockGoalCount(goals)} {getGoalsLabel(goals)}
          </div>
        )}
        <div className="text-xs text-gray-500">
          {timeframe ? timeframe.replace(/\d+/, (match) => `Last ${match}`).toUpperCase() : 'ALL TIME'}
        </div>
      </div>
    );
  } else if (displayType === 'grid') {
    const mockData = [
      { 
        activity: 'Tour Scheduled', 
        prospect: 'John Smith', 
        community: 'Downtown', 
        dueDate: '2024-01-15', 
        assignedTo: 'Sarah K.', 
        type: 'Tour'
      },
      { 
        activity: 'Follow Up Call', 
        prospect: 'Mary Johnson', 
        community: 'Westside', 
        dueDate: '2024-01-16', 
        assignedTo: 'Mike R.', 
        type: 'Call Out'
      },
      { 
        activity: 'Outreach Appointment', 
        prospect: 'Robert Brown', 
        community: 'Eastview', 
        dueDate: '2024-01-17', 
        assignedTo: 'Laura V.', 
        type: 'Outreach'
      }
    ];

    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3 px-1">
          <span>{listLabel} • {timeframe ? timeframe.replace(/\d+/, (match) => `Last ${match}`).toUpperCase() : 'ALL TIME'}</span>
          <Badge variant="secondary" className="text-xs">{mockCount} total</Badge>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="w-full h-full overflow-auto border rounded-lg bg-white shadow-sm">
            <Table>
              <TableHeader className="sticky top-0 bg-gray-50 z-10">
                <TableRow>
                  <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2 border-b">ACTIVITY</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2 border-b">PROSPECT</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2 border-b">COMMUNITY</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2 border-b">DUE DATE</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2 border-b">ASSIGNED TO</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2 border-b">TYPE</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.map((activity, index) => (
                  <TableRow key={index} className="hover:bg-gray-50 border-b">
                    <TableCell className="text-xs px-3 py-3 border-r">{activity.activity}</TableCell>
                    <TableCell className="text-xs px-3 py-3 border-r">{activity.prospect}</TableCell>
                    <TableCell className="text-xs px-3 py-3 border-r">{activity.community}</TableCell>
                    <TableCell className="text-xs px-3 py-3 border-r">{activity.dueDate}</TableCell>
                    <TableCell className="text-xs px-3 py-3 border-r">{activity.assignedTo}</TableCell>
                    <TableCell className="text-xs px-3 py-3">{activity.type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="text-xs text-center text-gray-500 mt-3 px-1">
          +{mockCount - 3} more activities
        </div>
      </div>
    );
  }

  return null;
};
