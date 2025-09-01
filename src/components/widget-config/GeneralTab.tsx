
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Widget } from "@/types/widget";

interface GeneralTabProps {
  widget: Widget;
  onUpdateWidget: (updates: Partial<Widget>) => void;
}

export const GeneralTab = ({ widget, onUpdateWidget }: GeneralTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Basic Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">Widget Title</Label>
          <Input
            id="title"
            value={widget.title}
            onChange={(e) => onUpdateWidget({ title: e.target.value })}
            placeholder="Enter widget title"
          />
        </div>

        <div>
          <Label htmlFor="type">Widget Type</Label>
          <Select value={widget.type} onValueChange={(value) => onUpdateWidget({ type: value as any })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="people">People Widget</SelectItem>
              <SelectItem value="activity">Activity Widget</SelectItem>
              <SelectItem value="metric">Metric Widget</SelectItem>
              <SelectItem value="goals">Goals Widget</SelectItem>
              <SelectItem value="form">Form Widget</SelectItem>
              <SelectItem value="calendar">Calendar Widget</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
