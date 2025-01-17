import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useDashboardStore = create(
  persist(
    (set) => ({
      dateRange: "month",
      activeSection: "sales",
      chartPreferences: {
        sales: "bar",
        users: "line",
        traffic: "area",
      },
      visibleMetrics: {
        sales: true,
        users: true,
        traffic: true,
      },
      setDateRange: (range) => set({ dateRange: range }),
      setActiveSection: (section) => set({ activeSection: section }),
      setChartType: (section, type) =>
        set((state) => ({
          chartPreferences: { ...state.chartPreferences, [section]: type },
        })),
      toggleMetric: (metric) =>
        set((state) => ({
          visibleMetrics: {
            ...state.visibleMetrics,
            [metric]: !state.visibleMetrics[metric],
          },
        })),
    }),
    {
      name: "dashboard-preferences",
    }
  )
);
