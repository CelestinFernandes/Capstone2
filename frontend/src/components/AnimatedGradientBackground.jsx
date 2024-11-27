import React from 'react';

const AnimatedGradientBackground = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#881FFF] via-[#ff814b] to-[#7e4bff] bg-[length:200%_200%] animate-gradient">
        <div className="absolute inset-0 bg-[url('/movie-reel.svg')] opacity-5 bg-repeat"></div>
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AnimatedGradientBackground;
