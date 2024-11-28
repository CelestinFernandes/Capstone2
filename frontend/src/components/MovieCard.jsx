import React from 'react';

const MovieCard = ({ movie }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg text-center">
      <img src={movie.img} alt={movie.title} className="rounded-lg mb-4" />
      <h3 className="text-lg font-semibold">{movie.title}</h3>
      <p className="text-yellow-400">⭐ {movie.rating}</p>
    </div>
  );
};

export default MovieCard;
