import React from "react";
import { BarChart, LineChart, AreaChart } from "lucide-react";
import { useDashboardStore } from "../store/dashboardStore";

export const ChartTypeSelector = () => {
  const { activeSection, chartPreferences, setChartType } = useDashboardStore();

  const chartTypes = [
    { id: "bar", icon: BarChart, label: "Bar Chart" },
    { id: "line", icon: LineChart, label: "Line Chart" },
    { id: "area", icon: AreaChart, label: "Area Chart" },
  ];

  return (
    <div className="flex items-center space-x-2 mb-4">
      {chartTypes.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => setChartType(activeSection, id)}
          className={`p-2 rounded-lg flex items-center space-x-2 ${
            chartPreferences[activeSection] === id
              ? "bg-blue-100 text-blue-600"
              : "hover:bg-gray-100"
          }`}
          title={label}
        >
          <Icon size={20} />
        </button>
      ))}
    </div>
  );
};
