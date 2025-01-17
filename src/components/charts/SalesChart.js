import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Import the API
import { api } from "../services/api"; // Update this with the correct path

// Import the zoom plugin
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin // Register the zoom plugin
);

export const SalesChart = ({ data, type }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortBy, setSortBy] = useState("sales");
  const [modalData, setModalData] = useState(null); // For displaying modal data

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the API
        const result = await api.fetchDashboardData("week"); // or use a dynamic date range
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

  const sortedData = [...chartData].sort((a, b) => {
    if (sortBy === "sales") {
      return sortOrder === "desc" ? b.sales - a.sales : a.sales - b.sales;
    } else if (sortBy === "date") {
      return sortOrder === "desc"
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date);
    }
    return 0;
  });

  const chartDataFormatted = {
    labels: sortedData.map((item) => item.date),
    datasets: [
      {
        fill: type === "area",
        label: "Sales",
        data: sortedData.map((item) => item.sales),
        borderColor: "#3b82f6",
        backgroundColor:
          type === "area" ? "rgba(59, 130, 246, 0.5)" : "#3b82f6",
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
        text: "Sales Overview",
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
    onClick: (e, elements) => {
      // Check if an element (bar, point) was clicked
      if (elements.length > 0) {
        const elementIndex = elements[0].index;
        const selectedItem = sortedData[elementIndex]; // Get data of clicked element
        setModalData(selectedItem); // Set the modal data based on the clicked item
      }
    },
  };

  const handleSortChange = (order, by) => {
    setSortOrder(order);
    setSortBy(by);
  };

  const ChartComponent = type === "bar" ? Bar : Line;

  const closeModal = () => {
    setModalData(null); // Close the modal
  };

  return (
    <div>
      {/* Sorting options */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => handleSortChange("asc", "sales")}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300"
        >
          Sort Sales Ascending
        </button>
        <button
          onClick={() => handleSortChange("desc", "sales")}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-300"
        >
          Sort Sales Descending
        </button>
        <button
          onClick={() => handleSortChange("asc", "date")}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-300"
        >
          Sort Date Ascending
        </button>
        <button
          onClick={() => handleSortChange("desc", "date")}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition duration-300"
        >
          Sort Date Descending
        </button>
      </div>

      <div style={{ height: "400px", width: "100%" }}>
        <ChartComponent data={chartDataFormatted} options={options} />
      </div>

      {/* Modal for drilling down */}
      {modalData && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">
              Details for {modalData.date}
            </h2>
            <p>
              <strong>Sales:</strong> {modalData.sales}
            </p>
            <p>
              <strong>Date:</strong> {modalData.date}
            </p>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
