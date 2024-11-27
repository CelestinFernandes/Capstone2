import React, { useState } from 'react';

const News = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [inputFocused, setInputFocused] = useState(false);

  // Handle change in keyword input
  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (keyword.trim() === "") {
      setError("Please enter a keyword.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // const response = await fetch(`/fetch_data_test?keyword=${keyword}&limit=9`);
      const response = await fetch(`/fetch_data?keyword=${keyword}&limit=9`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      const jsonData = await response.json();
      setData(jsonData); // Set the fetched data to state
    } catch (err) {
      setError(`Error loading data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Sort articles by position (Top News Articles)
  const sortedByPosition = (articles) => {
    return articles.slice().sort((a, b) => a.position - b.position);
  };

  // Sort articles by publication date (Latest Articles)
  const sortedByDate = (articles) => {
    return articles.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg flex">
        {/* Main Content */}
        <div className="w-3/4 pr-8">
          {/* Header Section */}
          <header className="mb-12">
            <h1 className="text-4xl font-semibold text-center text-gray-800 mb-4">
              News, Search & Trends Dashboard for <span className="text-indigo-600">{keyword || 'Unknown'}</span>
            </h1>
            <p className="text-lg text-center text-gray-600">Explore the latest news, search results, and trending topics for your keyword.</p>
            
            {/* Search Input */}
            {!inputFocused ? (
              <div className="flex flex-col justify-center items-center h-full mt-8">
                <form 
                  onSubmit={(e) => { handleSubmit(e); setInputFocused(true); }} 
                  className="w-full max-w-md mx-auto transition-all duration-500 ease-in-out"
                >
                  <input
                    type="text"
                    placeholder="Enter a keyword"
                    value={keyword}
                    onChange={handleKeywordChange}
                    className="p-3 border border-gray-300 rounded-lg w-full mb-4 text-lg"
                  />
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white p-3 rounded-lg"
                  >
                    Search
                  </button>
                </form>
              </div>
            ) : (
              <div className="w-full max-w-md mx-auto mt-12 transition-all duration-500 ease-in-out">
                <form onSubmit={handleSubmit} className="flex flex-col items-center">
                  <input
                    type="text"
                    value={keyword}
                    onChange={handleKeywordChange}
                    className="p-3 border border-gray-300 rounded-lg w-1/2 mb-4 text-lg"
                  />
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white p-3 rounded-lg"
                  >
                    Search
                  </button>
                </form>
              </div>
            )}

          </header>

          {/* Display loading state with shimmer effect */}
          {loading && (
            <section className="mt-12">
              <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Top News Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Shimmer loading effect */}
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-gray-200 p-4 rounded-lg shadow-md animate-pulse">
                    <div className="bg-gray-300 h-6 w-3/4 mb-4 rounded"></div>
                    <div className="bg-gray-300 h-4 w-full mb-2 rounded"></div>
                    <div className="bg-gray-300 h-32 w-full rounded mb-4"></div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Error handling */}
          {error && <p className="text-center text-red-500 mt-4">{error}</p>}

          {/* News Section */}
          {data && !loading && (
            <section className="mt-12">
              <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Top News Articles</h2>
              {data.news.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedByPosition(data.news).map((article, index) => (
                    <div 
                      key={index} 
                      className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer hover:text-indigo-600 hover:border-indigo-600 border-b border-gray-200" 
                      onClick={() => window.open(article.link, "_blank")} 
                    >
                      <h3 className="text-xl font-medium text-gray-700 mb-2">{article.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">Published on: {article.date}</p>
                      {article.thumbnail && (
                        <img src={article.thumbnail} alt="Article Thumbnail" className="w-full h-32 object-cover rounded-lg mb-4" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No news articles available.</p>
              )}
            </section>
          )}
        </div>

        {/* Sidebar for Latest Articles */}
        <div className="w-1/4 bg-gray-50 p-6 rounded-lg shadow-lg sticky top-0">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Latest Articles</h3>
          {data && sortedByDate(data.news).slice(0, 5).map((article, index) => (
            <div key={index} className="mb-4">
              <h4
                onClick={() => window.open(article.link, "_blank")} 
                className="text-lg font-medium text-gray-700 mb-2 cursor-pointer hover:text-indigo-600 transition-colors"
              >
                {article.title}
              </h4>
              <p className="text-sm text-gray-500 mb-1">Published on: {article.date}</p>
              <hr className="border-t border-gray-300 my-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
