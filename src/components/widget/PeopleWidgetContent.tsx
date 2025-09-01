
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { Widget } from "@/types/widget";
import { getColorClass } from "./WidgetIconUtils";

interface PeopleWidgetContentProps {
  widget: Widget;
}

export const PeopleWidgetContent = ({ widget }: PeopleWidgetContentProps) => {
  const { config } = widget;
  const savedList = config.savedList;
  const displayType = config.displayType || 'count'; // Default to count if not set
  const dateRange = config.dateRange;
  const selectedColumns = config.selectedColumns || ['name', 'community', 'casenumber'];
  const primaryColor = config.displayOptions?.color || 'blue';
  
  if (!savedList) {
    return (
      <div className="text-center text-gray-500">
        <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Widget Preview</p>
        <p className="text-xs text-gray-400 mt-1">Click settings to configure</p>
      </div>
    );
  }
  
  const getMockCount = (list: string) => {
    switch(list) {
      case 'watchlist': return 28;
      case 'preleads': return 152;
      case 'cold-leads': return 89;
      case 'alines-top-10': return 10;
      case 'move-ins': return 47;
      case 'new-leads': return 73;
      case 'new-referrals': return 34;
      case 'open-referrals': return 56;
      case 'hot-leads': return 47;
      case 'customers': return 123;
      default: return 89;
    }
  };
  const mockCount = getMockCount(savedList || '');
  
  if (displayType === 'count') {
    return (
      <div className="text-center">
        <div className={`text-3xl font-bold mb-2 ${getColorClass(primaryColor)}`}>{mockCount}</div>
        <div className="text-sm text-gray-600 mb-1">
          {savedList ? savedList.replace('-', ' ').toUpperCase() : 'CONTACTS'}
        </div>
        <div className="text-xs text-gray-500">
          {dateRange ? dateRange.replace('-', ' ').toUpperCase() : 'ALL TIME'}
        </div>
      </div>
    );
  } else if (displayType === 'grid') {
    const mockData = [
      { name: 'John Doe', community: 'Downtown', casenumber: 'CS-001', assignedUser: 'Laura V.', leadStatus: 'Hot Lead', market: 'Senior Housing', actions: 'View' },
      { name: 'Jane Smith', community: 'Westside', casenumber: 'CS-002', assignedUser: 'Mike R.', leadStatus: 'Prospect', market: 'Assisted Living', actions: 'Edit' },
      { name: 'Bob Johnson', community: 'Eastview', casenumber: 'CS-003', assignedUser: 'Sarah K.', leadStatus: 'Customer', market: 'Memory Care', actions: 'Contact' }
    ];

    const getColumnLabel = (columnId: string) => {
      const labels: Record<string, string> = {
        name: 'NAME',
        community: 'COMMUNITY',
        casenumber: 'CASENUMBER',
        assignedUser: 'ASSIGNED USER',
        leadStatus: 'LEAD STATUS',
        market: 'MARKET',
        actions: 'ACTIONS'
      };
      return labels[columnId] || columnId;
    };

    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3 px-1">
          <span>{savedList ? savedList.replace('-', ' ').toUpperCase() : 'CONTACTS'} • {dateRange ? dateRange.replace('-', ' ').toUpperCase() : 'ALL TIME'}</span>
          <Badge variant="secondary" className="text-xs">{mockCount} total</Badge>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="w-full h-full overflow-auto border rounded-lg bg-white shadow-sm">
            <Table>
              <TableHeader className="sticky top-0 bg-gray-50 z-10">
                <TableRow>
                  {selectedColumns.map((columnId) => (
                    <TableHead key={columnId} className="text-xs font-semibold text-gray-700 px-3 py-2 border-b">
                      {getColumnLabel(columnId)}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.map((person, index) => (
                  <TableRow key={index} className="hover:bg-gray-50 border-b">
                    {selectedColumns.map((columnId) => (
                      <TableCell key={columnId} className="text-xs px-3 py-3 border-r last:border-r-0">
                        {person[columnId as keyof typeof person] || '-'}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="text-xs text-center text-gray-500 mt-3 px-1">
          +{mockCount - 3} more rows
        </div>
      </div>
    );
  }

  return null;
};
