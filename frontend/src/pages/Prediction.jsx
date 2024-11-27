import React, { useState } from 'react';

export default function PredictionPage() {
  const [movieName, setMovieName] = useState('');
  const [budget, setBudget] = useState('');
  const [releaseDate, setReleaseDate] = useState('');

  const handlePrediction = () => {
    console.log("Predicting success for:", movieName, budget, releaseDate);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
    
      <main className="flex flex-col items-center px-6 py-16 space-y-8">
        <h2 className="text-2xl font-semibold text-gray-200">Enter Movie Details</h2>
        <div className="w-full max-w-md space-y-6">
          <input
            type="text"
            placeholder="Movie Name"
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <input
            type="number"
            placeholder="Budget (in million $)"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <input
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            onClick={handlePrediction}
            className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-lg text-white rounded-md shadow-lg hover:from-purple-600 hover:to-pink-500"
          >
            Predict Success
          </button>
        </div>
      </main>
    </div>
  );
}