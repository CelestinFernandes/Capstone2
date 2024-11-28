import React, { useState } from 'react';

const News = () => {
  const [data, setData] = useState(null); // Holds the current data (original news)
  const [originalData, setOriginalData] = useState(null); // Holds the original data for "Back to Articles"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showSummarizedContent, setShowSummarizedContent] = useState(false);
  const [hasSummarized, setHasSummarized] = useState(false); // Track if summarization has been done
  const [summarizedData, setSummarizedData] = useState(null); // Store the summarized data

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
    setHasSummarized(false); // Reset summarization status when a new search is done

    try {
      const response = await fetch(`/fetch_data_test?keyword=${keyword}&limit=9`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      const jsonData = await response.json();
      console.log(jsonData)
      setData(jsonData); // Set the fetched data to state
      setOriginalData(jsonData); // Store the original data for "Back to Articles"
      setSummarizedData(jsonData.summarized_news); // Store summarized news data from the API response
    } catch (err) {
      setError(`Error loading data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle the Summarize button click
  const handleSummarize = () => {
    if (!hasSummarized) {
      setIsSummarizing(true); // Show shimmer effect
      setShowSummarizedContent(true); // Show summarized content

      setTimeout(() => {
        setHasSummarized(true); // Mark that summarization has been done
        setIsSummarizing(false); // Hide shimmer
      }, 3000); // Simulate a 3-second loading time for the summarization process
    } else {
      // Toggle between showing summarized or original content
      if (showSummarizedContent) {
        setShowSummarizedContent(false); // Hide summarized content
      } else {
        setShowSummarizedContent(true); // Show summarized content
      }
    }
  };

  

  const renderFormattedContent = (summarizedData) => {
    const formatText = (text) => {
      const sections = text.split('**'); // Split by title markers (assumes '**' is the delimiter)
      const formattedSections = [];
      
      for (let i = 0; i < sections.length; i++) {
        if (i % 2 === 1) {
          // This section is a title (odd indexed sections after split)
          const title = sections[i].trim();
          formattedSections.push(
            <h3 className="text-2xl font-bold mt-14 mb-4 p-2 border-b-2 border-gray-300">
              {title}
            </h3>
          );
                  } else {
          // This section is content (even indexed sections after split)
          const content = sections[i].trim();
          console.log(content)
          
          // Separate numbered points in the content
          const points = content.split('\n').map((line) => {
            if (line.trim()) {
              return (
                <li className="list-inside mt-2">{line.trim()}</li>
              );
            }
            return null;
          });
          
          formattedSections.push(<ul>{points}</ul>);
        }
      }
      
      return formattedSections;
    };
    
  return (
    <section className="mt-6 ">
      <div>
        {/* Render formatted content */}
        {formatText(summarizedData)}
      </div>
    </section>
  );
};
  
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg flex">
        {/* Main Content */}
        <div className="w-3/4 pr-8">
          {/* Header Section */}
          <header className="mb-12">
            <h1 className="text-4xl font-semibold text-center text-gray-800 mb-4">
              News, Search & Trends Dashboard for <span className="text-indigo-600">{keyword || '--'}</span>
            </h1>
            <p className="text-lg text-center text-gray-600">Explore the latest news, search results, and trending topics for your keyword.</p>

            {/* Summarize Button (appears after search) */}
            {data && !isSummarizing && (
              <div className="text-center mt-6">
                <button
                  onClick={handleSummarize}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all ease-in-out duration-300"
                  disabled={isSummarizing} // Disable button when summarizing is in progress
                >
                  {showSummarizedContent ? "Back to Articles" : "Summarize"}
                </button>
              </div>
            )}

            {/* Hide Search Input and Button when Summarizing */}
            {!isSummarizing && !showSummarizedContent && (
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
            )}
          </header>

          {/* Show Shimmer Effect for Summarize only if summarization has not been done */}
          {isSummarizing && !hasSummarized && (
            <section className="mt-12">
              <div className="animate-pulse">
                <p className="text-center text-xl text-gray-500">Summarizing...</p>
                <div className="bg-gray-300 h-4 w-3/4 mx-auto rounded mt-2 mb-6"></div>
                <div className="bg-gray-300 h-4 w-1/2 mx-auto rounded mt-2"></div>
              </div>
            </section>
          )}

{/* Show Summarized Content */}
{showSummarizedContent && !isSummarizing && summarizedData && (
  <section className="mt-12">
    <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Summarized Content</h2>

    <div className="bg-white p-4 rounded-lg shadow-md">
      {/* Render formatted content with titles and points */}
      {renderFormattedContent(summarizedData)}
      </div>
  </section>
)}



          {/* Show Original Articles */}
          {!showSummarizedContent && !loading && !isSummarizing && data && (
            <section className="mt-12">
              <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Top News Articles</h2>
              {data.news.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.news.map((article, index) => (
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

          {/* Display Error Message */}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>

        {/* Sidebar for Latest Articles */}
        {!showSummarizedContent && (
          <div className="w-1/4 bg-gray-50 p-6 rounded-lg shadow-lg sticky top-0">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Latest Articles</h3>
            {data && data.news.slice(0, 5).map((article, index) => (
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
        )}
      </div>
    </div>
  );
};

export default News;
