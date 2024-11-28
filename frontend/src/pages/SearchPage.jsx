import React, { useState } from "react";

const SearchPage = () => {
  const [searchData, setSearchData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState(""); // Search keyword state

  const handleSearch = async () => {
    if (!keyword) {
      setError("Please enter a search term.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/fetch_data_test?keyword=${keyword}&limit=9`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }
      const data = await response.json();
      setSearchData(data.search);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
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

        {/* Displaying insights */}
        {searchData && !loading && !error && (
          <div className="mb-6 text-center text-gray-800">
            <p className="text-lg font-semibold">
              Top {searchData.organic_results.length} results for "{keyword}"
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Here are the top search results based on your query. Explore more for detailed information.
            </p>
          </div>
        )}

        {/* Displaying results */}
        {searchData && !loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {searchData.organic_results.map((result, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg hover:scale-105 transition transform"
              >
                <div className="flex flex-col items-center">
                  {/* Larger Thumbnail or Favicon */}
                  <div className="w-24 h-24 mb-4 bg-gray-100 rounded-full overflow-hidden flex justify-center items-center border-4 border-gray-200 shadow-lg">
                    {result.thumbnail ? (
                      <img
                        src={result.thumbnail}
                        alt={result.title}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <img
                        src={result.favicon}
                        alt={result.title}
                        className="w-full h-full object-cover rounded-full"
                      />
                    )}
                  </div>
                  {/* Title */}
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                    <a
                      href={result.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {result.title}
                    </a>
                  </h2>
                  {/* Snippet */}
                  <p className="text-sm text-gray-600 mb-4">{result.snippet}</p>
                  {/* Source */}
                  <p className="text-xs text-gray-500 mb-4">Source: {result.source}</p>
                  {/* Read more link */}
                  <div className="flex justify-center">
                    <a
                      href={result.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <span>Read more</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
