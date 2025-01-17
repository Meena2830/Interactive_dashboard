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
} from "chart.js";

// Import the zoom plugin
import zoomPlugin from "chartjs-plugin-zoom";

// Import the API
import { api } from "../services/api"; // Update this path

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin // Register the zoom plugin
);

export const UserChart = ({ data }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("highest"); // Default sorting option
  const [modalData, setModalData] = useState(null); // State to hold clicked data for modal

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await api.fetchDashboardData("week");
        setChartData(result);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Sort data based on the selected sort option
  const sortedData = [...chartData].sort((a, b) => {
    switch (sortOption) {
      case "highest":
        return b.users - a.users;
      case "lowest":
        return a.users - b.users;
      case "alphabetical":
        return a.date.localeCompare(b.date);
      default:
        return 0;
    }
  });

  const chartDataFormatted = {
    labels: sortedData.map((item) => item.date),
    datasets: [
      {
        label: "Active Users",
        data: sortedData.map((item) => item.users),
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "User Analytics",
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "xy",
        },
        zoom: {
          enabled: true,
          mode: "xy",
          speed: 0.1,
        },
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const clickedIndex = elements[0].index;
        const clickedData = sortedData[clickedIndex];
        setModalData(clickedData); // Set the clicked data to show in the modal
      }
    },
  };

  // Handle sorting option change
  const handleSortChange = (option) => {
    setSortOption(option);
  };

  return (
    <div>
      {/* Sorting options */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => handleSortChange("highest")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
        >
          Sort by Highest Active Users
        </button>
        <button
          onClick={() => handleSortChange("lowest")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
        >
          Sort by Lowest Active Users
        </button>
        <button
          onClick={() => handleSortChange("alphabetical")}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300"
        >
          Sort Alphabetically by Date
        </button>
      </div>

      <div style={{ height: "400px", width: "100%" }}>
        <Line data={chartDataFormatted} options={options} />
      </div>

      {/* Modal for drilled-down data */}
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4">
              Details for {modalData.date}
            </h2>
            <p className="text-gray-700 mb-2">
              Active Users: {modalData.users}
            </p>
            <button
              onClick={() => setModalData(null)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
