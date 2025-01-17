import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement, // Added for clickable functionality
} from "chart.js";
import { api } from "../services/api"; // Update this path

// Import the chartjs-plugin-zoom
import zoomPlugin from "chartjs-plugin-zoom";

// Register plugins and scales
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement, // Ensure ArcElement is registered for clickable charts
  zoomPlugin
);

export const TrafficChart = ({ dateRange }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("highest");
  const [modalData, setModalData] = useState(null); // To store data for the modal

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await api.fetchDashboardData(dateRange);
        setData(result);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const sortedData = [...data].sort((a, b) => {
    switch (sortOption) {
      case "highest":
        return b.pageViews - a.pageViews;
      case "lowest":
        return a.pageViews - b.pageViews;
      case "alphabetical":
        return a.date.localeCompare(b.date);
      default:
        return 0;
    }
  });

  const chartData = {
    labels: sortedData.map((item) => item.date),
    datasets: [
      {
        fill: true,
        label: "Page Views",
        data: sortedData.map((item) => item.pageViews),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
      },
      {
        fill: true,
        label: "Unique Visitors",
        data: sortedData.map((item) => item.users),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 750,
      easing: "easeInOutQuart",
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Traffic Overview",
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "xy",
        },
        zoom: {
          enabled: true,
          mode: "xy",
        },
      },
    },
    onClick: (e) => {
      const activePoints = e.chart.getElementsAtEventForMode(
        e.native,
        "nearest",
        { intersect: true },
        false
      );
      if (activePoints.length) {
        const index = activePoints[0].index;
        const selectedData = sortedData[index];
        // Set modal data to display detailed information
        setModalData(selectedData);
      }
    },
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  return (
    <div>
      {/* Sorting options */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => handleSortChange("highest")}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300"
        >
          Sort by Highest Page Views
        </button>
        <button
          onClick={() => handleSortChange("lowest")}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-300"
        >
          Sort by Lowest Page Views
        </button>
        <button
          onClick={() => handleSortChange("alphabetical")}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-300"
        >
          Sort Alphabetically by Date
        </button>
      </div>

      <div style={{ height: "400px", width: "100%" }}>
        <Line data={chartData} options={options} />
      </div>

      {/* Modal to show detailed data when a segment/bar is clicked */}
      {modalData && (
        <div className="modal">
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-xl font-semibold mb-4">
                Details for {modalData.date}
              </h2>
              <p className="text-gray-700 mb-2">
                Page Views: {modalData.pageViews}
              </p>
              <p className="text-gray-700 mb-4">
                Unique Visitors: {modalData.users}
              </p>
              <button
                onClick={() => setModalData(null)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
