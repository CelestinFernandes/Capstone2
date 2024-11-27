import React, { useState, useEffect } from 'react';

const News = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkFilePath = async () => {
      try {
        // Assuming results.json is in the public directory
        const response = await fetch('/results.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch the file. Status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(`Error loading JSON data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    checkFilePath();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading data...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        {/* Header Section */}
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          News, Search & Trends Dashboard for "{data.keyword || 'Unknown'}"
        </h1>

        {/* News Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">News Results</h2>
          {data.news && data.news.length > 0 ? (
            data.news.map((article, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition mb-4">
                <h3 className="text-xl font-medium text-gray-700">{article.title}</h3>
                <p className="text-sm text-gray-500">Position: {article.position}</p>
                <p className="text-sm text-gray-500">Date: {article.date}</p>

                {/* Display Thumbnail */}
                {article.thumbnail && (
                  <img src={article.thumbnail} alt="Article Thumbnail" className="w-full h-auto rounded-lg mt-2 mb-4" />
                )}

                {/* News Article Link */}
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  Read Full Article
                </a>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-600">No news articles available.</p>
          )}
        </div>

        {/* Search Results Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Search Results</h2>
          {data.search && data.search.organic_results && data.search.organic_results.length > 0 ? (
            data.search.organic_results.map((result, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition mb-4">
                <h3 className="text-xl font-medium text-gray-700">
                  <a
                    href={result.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    {result.title}
                  </a>
                </h3>
                <p className="text-sm text-gray-600">{result.snippet}</p>
                <a
                  href={result.redirect_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline mt-2 inline-block"
                >
                  View on Wikipedia
                </a>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-600 mt-2">No search results available.</p>
          )}
        </div>

        {/* Trends Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Trends Data</h2>
          <div className="space-y-4">
            {data.trends && data.trends.interest_over_time && data.trends.interest_over_time.timeline_data.length > 0 ? (
              data.trends.interest_over_time.timeline_data.map((timeline, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition mb-4">
                  <h3 className="text-lg font-medium text-gray-700">{timeline.date}</h3>
                  <p className="text-sm text-gray-600">
                    Value: <span className="font-semibold">{timeline.values[0]?.value || 'N/A'}</span>
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600 mt-2">No trends data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
