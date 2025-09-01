
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, GripVertical } from "lucide-react";

interface ColumnSelectorProps {
  selectedColumns: string[];
  onColumnsChange: (columns: string[]) => void;
}

const availableColumns = [
  { id: 'name', label: 'NAME' },
  { id: 'community', label: 'COMMUNITY' },
  { id: 'casenumber', label: 'CASENUMBER' },
  { id: 'assignedUser', label: 'ASSIGNED USER' },
  { id: 'leadStatus', label: 'LEAD STATUS' },
  { id: 'market', label: 'MARKET' },
  { id: 'actions', label: 'ACTIONS' }
];

export const ColumnSelector = ({ selectedColumns = ['name', 'community', 'casenumber'], onColumnsChange }: ColumnSelectorProps) => {
  const [columnToAdd, setColumnToAdd] = useState<string>("");

  const handleAddColumn = () => {
    if (columnToAdd && !selectedColumns.includes(columnToAdd)) {
      onColumnsChange([...selectedColumns, columnToAdd]);
      setColumnToAdd("");
    }
  };

  const handleRemoveColumn = (columnId: string) => {
    onColumnsChange(selectedColumns.filter(col => col !== columnId));
  };

  const handleMoveColumn = (fromIndex: number, toIndex: number) => {
    const newColumns = [...selectedColumns];
    const [movedColumn] = newColumns.splice(fromIndex, 1);
    newColumns.splice(toIndex, 0, movedColumn);
    onColumnsChange(newColumns);
  };

  const getColumnLabel = (columnId: string) => {
    return availableColumns.find(col => col.id === columnId)?.label || columnId;
  };

  const unselectedColumns = availableColumns.filter(col => !selectedColumns.includes(col.id));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Grid Columns</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-xs text-gray-500 mb-2">
          Drag and drop to change order of columns
        </div>
        
        {/* Selected Columns */}
        <div className="space-y-2">
          {selectedColumns.map((columnId, index) => (
            <div key={columnId} className="flex items-center justify-between bg-gray-50 rounded-md p-2">
              <div className="flex items-center space-x-2">
                <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                <Badge variant="secondary" className="text-xs">
                  {getColumnLabel(columnId)}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveColumn(columnId)}
                className="h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>

        {/* Add Column */}
        {unselectedColumns.length > 0 && (
          <div className="flex space-x-2">
            <Select value={columnToAdd} onValueChange={setColumnToAdd}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Add column" />
              </SelectTrigger>
              <SelectContent>
                {unselectedColumns.map((column) => (
                  <SelectItem key={column.id} value={column.id}>
                    {column.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              size="sm" 
              onClick={handleAddColumn}
              disabled={!columnToAdd}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
