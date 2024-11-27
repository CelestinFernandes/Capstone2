import React from 'react';

const FilterBar = () => {
  return (
    <div className="flex space-x-4">
      <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-purple-500">
        All Genres
      </button>
      <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-purple-500">
        All Languages
      </button>
      <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-purple-500">
        All Countries
      </button>
      <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-purple-500">
        All Ratings
      </button>
      <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-purple-500">
        Sort By
      </button>
    </div>
  );
};

export default FilterBar;
