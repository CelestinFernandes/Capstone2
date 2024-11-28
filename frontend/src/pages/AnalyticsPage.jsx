import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register the required chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Analytics = () => {
  const [trendsData, setTrendsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState(""); // No default value for the search

  // Fetching trends data from the API
  const fetchTrendsData = async () => {
    if (keyword.trim() === "") {
      setError("Please enter a search keyword.");
      return;
    }

    setLoading(true); // Show loading spinner when the search is triggered
    setError(null); // Reset previous errors
    try {
      const response = await fetch(`/fetch_data_test?keyword=${encodeURIComponent(keyword)}&limit=9`);
      if (!response.ok) {
        throw new Error(`Failed to fetch trends data. Status: ${response.status}`);
      }
      const data = await response.json();
      setTrendsData(data.trends); // Assuming the response contains a "trends" object
    } catch (err) {
      setError(err.message || "Failed to load trends data.");
    } finally {
      setLoading(false); // Hide the loading spinner
    }
  };

  // Prepare data for chart.js
  const chartData = trendsData
    ? {
        labels: trendsData.interest_over_time.timeline_data.map((entry) => entry.date),
        datasets: [
          {
            label: "Interest Over Time",
            data: trendsData.interest_over_time.timeline_data.map((entry) => {
              const value = entry.values[0]?.value; // Get the interest value for the current search term
              return value ? parseInt(value) : 0;
            }),
            borderColor: "#3b82f6", // Blue color
            backgroundColor: "rgba(59, 130, 246, 0.2)", // Light blue background
            tension: 0.4,
            fill: true,
          },
        ],
      }
    : {};

  const handleSearch = () => {
    if (keyword.trim() === "") {
      setError("Please enter a search keyword.");
      setTrendsData(null); // Clear any previously displayed data
    } else {
      fetchTrendsData(); // Only fetch data when search button is clicked
    }
  };

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        {/* Search bar and button */}
        <div className="flex justify-between items-center mb-8">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search..."
          />
          <button
            onClick={handleSearch}
            className="ml-4 px-6 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            Search
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 text-red-600 font-semibold text-center">
            {error}
          </div>
        )}

        {/* Loading spinner */}
        {loading && (
          <div className="flex justify-center items-center text-xl text-gray-600">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
          </div>
        )}

        {/* Trends Data */}
        {!loading && !error && trendsData && (
          <div>
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: `Interest Over Time for "${keyword}"`,
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const value = context.raw;
                        return `Interest Value: ${value}`;
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    type: 'category', // Explicitly set the x-axis scale type to category
                    title: {
                      display: true,
                      text: "Date Range",
                    },
                  },
                  y: {
                    type: 'linear', // Ensure the y-axis is a linear scale
                    title: {
                      display: true,
                      text: "Interest Value",
                    },
                    beginAtZero: true, // Start Y axis at 0
                  },
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
