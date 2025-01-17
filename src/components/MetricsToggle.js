import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { useDashboardStore } from "../store/dashboardStore";

export const MetricsToggle = () => {
  const { visibleMetrics, toggleMetric } = useDashboardStore();

  const metrics = [
    { id: "sales", label: "Sales Metrics" },
    { id: "users", label: "User Metrics" },
    { id: "traffic", label: "Traffic Metrics" },
  ];

  return (
    <div className="flex items-center space-x-4 mb-4">
      {metrics.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => toggleMetric(id)}
          className="flex items-center space-x-2 text-sm"
        >
          {visibleMetrics[id] ? (
            <Eye size={16} className="text-blue-600" />
          ) : (
            <EyeOff size={16} className="text-gray-400" />
          )}
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};
