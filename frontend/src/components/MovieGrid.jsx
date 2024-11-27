import React from 'react';

const MovieGrid = ({ category }) => {
  const movies = [
    { title: 'John Wick 4', img: 'https://placeimg.com/320/480/tech', rating: 5.0 },
    { title: 'Aquaman 2', img: 'https://placeimg.com/320/480/tech', rating: 4.7 },
    { title: 'Transformers: Rise of the Beasts', img: 'https://placeimg.com/320/480/tech', rating: 4.8 },
    { title: 'Peter Pan & Wendy', img: 'https://placeimg.com/320/480/tech', rating: 4.6 },
    { title: 'The Man from Toronto', img: 'https://placeimg.com/320/480/tech', rating: 4.7 },
    { title: 'Godzilla: King of the Monsters', img: 'https://placeimg.com/320/480/tech', rating: 4.5 },
    { title: 'Mission: Impossible', img: 'https://placeimg.com/320/480/tech', rating: 4.8 },
    { title: 'Avatar 2', img: 'https://placeimg.com/320/480/tech', rating: 4.9 },
  ];

  return (
    <div className={`grid ${category === 'top-rated' ? 'grid-cols-4 gap-6' : 'grid-cols-4 gap-4'}`}>
      {movies.map((movie, index) => (
        <div
          key={index}
          className="bg-gray-700 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all hover:scale-105 transform"
        >
          <img
            src={movie.img}
            alt={movie.title}
            className="w-full h-56 object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-semibold text-white">{movie.title}</h3>
            <div className="flex items-center space-x-2 text-yellow-400 mt-2">
              <span>{'⭐'.repeat(Math.floor(movie.rating))}</span>
              <span className="text-gray-400">{movie.rating}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieGrid;
