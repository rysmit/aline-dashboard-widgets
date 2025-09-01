
import { Users } from "lucide-react";

export const EmptyDashboard = () => {
  return (
    <div className="bg-white rounded-lg border-2 border-dashed border-secondary-300 p-12 text-center shadow-card">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-secondary-400" />
        </div>
        <h3 className="text-lg font-semibold text-secondary-900 mb-2">No widgets configured</h3>
        <p className="text-secondary-600 mb-6">
          Get started by adding your first widget to the dashboard. Choose from people, activities, metrics, and more.
        </p>
      </div>
    </div>
  );
};
