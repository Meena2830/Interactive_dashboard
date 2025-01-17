import React from "react";
import { useDashboardStore } from "../store/dashboardStore";
import { SalesChart } from "./charts/SalesChart";
import { UserChart } from "./charts/UserChart";
import { TrafficChart } from "./charts/TrafficChart";
import { useMockData } from "../hooks/useMockData";
import { ChartTypeSelector } from "./ChartTypeSelector";
import { MetricsToggle } from "./MetricsToggle";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

export const DashboardContent = () => {
  const { activeSection, dateRange, visibleMetrics, chartPreferences } =
    useDashboardStore();
  const { data, loading, error, refetch } = useMockData(dateRange);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <RefreshCw size={18} />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  const renderMetrics = () => {
    if (!visibleMetrics[activeSection] || !data) return null;

    const latestData = data[data.length - 1];

    switch (activeSection) {
      case "sales":
        return (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Total Sales</h3>
              <p className="text-3xl font-bold text-blue-600">
                ${latestData.sales.toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Average Order</h3>
              <p className="text-3xl font-bold text-green-600">
                ${Math.floor(latestData.sales / 100).toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Conversion Rate</h3>
              <p className="text-3xl font-bold text-purple-600">
                {((latestData.sales / latestData.pageViews) * 100).toFixed(1)}%
              </p>
            </div>
          </>
        );
      case "users":
        return (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Active Users</h3>
              <p className="text-3xl font-bold text-blue-600">
                {latestData.users.toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">New Signups</h3>
              <p className="text-3xl font-bold text-green-600">
                {Math.floor(latestData.users * 0.15).toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Retention Rate</h3>
              <p className="text-3xl font-bold text-purple-600">
                {(Math.random() * 20 + 60).toFixed(1)}%
              </p>
            </div>
          </>
        );
      case "traffic":
        return (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Page Views</h3>
              <p className="text-3xl font-bold text-blue-600">
                {latestData.pageViews.toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Unique Visitors</h3>
              <p className="text-3xl font-bold text-green-600">
                {Math.floor(latestData.pageViews * 0.4).toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Bounce Rate</h3>
              <p className="text-3xl font-bold text-purple-600">
                {(Math.random() * 15 + 35).toFixed(1)}%
              </p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const renderChart = () => {
    if (!visibleMetrics[activeSection] || !data) return null;

    const chartType = chartPreferences[activeSection];

    switch (activeSection) {
      case "sales":
        return <SalesChart data={data} type={chartType} />;
      case "users":
        return <UserChart data={data} type={chartType} />;
      case "traffic":
        return <TrafficChart data={data} type={chartType} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-50 flex-1 overflow-auto">
      <div className="mb-6">
        <MetricsToggle />
        <ChartTypeSelector />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {renderMetrics()}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">{renderChart()}</div>
    </div>
  );
};
