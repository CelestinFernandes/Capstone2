import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <main className="flex flex-col items-center justify-center text-center px-6 py-16 space-y-10">
        <h2 className="text-3xl font-semibold text-gray-200">Predict Your Movie's Success</h2>
        <p className="max-w-lg text-gray-400">
          Using advanced analytics, our AI predicts the success of your upcoming movie based on trends and historical data.
        </p>
        <button className="px-6 py-3 mt-4 text-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full shadow-lg">
          Try Prediction Now
        </button>
      </main>
    </div>
  );
}