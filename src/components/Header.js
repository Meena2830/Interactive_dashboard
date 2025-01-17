import React from "react";
import { Calendar } from "lucide-react";
import { useDashboardStore } from "../store/dashboardStore";

export const Header = () => {
  const { dateRange, setDateRange } = useDashboardStore();

  return (
    <div className="bg-white border-b p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>

      <div className="flex items-center space-x-4">
        <Calendar className="text-gray-500" size={20} />
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="border rounded-md px-3 py-1.5 text-sm"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="year">Last Year</option>
        </select>
      </div>
    </div>
  );
};
