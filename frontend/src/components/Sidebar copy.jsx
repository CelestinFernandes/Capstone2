import React from 'react';
import { HomeIcon, FilmIcon, DocumentTextIcon, VideoCameraIcon, TvIcon, CogIcon } from '@heroicons/react/24/solid';

const Sidebar = () => {
  const menuItems = [
    { name: 'Home', icon: HomeIcon },
    { name: 'Search', icon: DocumentTextIcon },
    { name: 'Movies', icon: FilmIcon },
    { name: 'Favorites', icon: VideoCameraIcon },
    { name: 'Chat', icon: TvIcon },
  ];

  return (
    <aside className="w-14 bg-gray-800 dark:bg-black p-4 shadow-md absolute top-0 left-0 h-full z-10">
      <nav className="flex flex-col items-center space-y-6">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className="flex items-center justify-center text-gray-400 hover:text-white transition-colors relative group"
          >
            {/* Large Icon, no text */}
            <item.icon className="h-8 w-8 text-white" />

            {/* Tooltip with Arrow (appears on hover) */}
            <div className="absolute left-full ml-2 hidden group-hover:block">
              {/* Arrow pointing to the left */}
              <div className="w-2 h-2 border-4 border-solid border-gray-700 absolute left-[-3px] top-1/2 transform -translate-y-1/2 rotate-45"></div>
              {/* Tooltip box with rounded corners */}
              <div className="bg-gray-700 text-white text-sm rounded-lg px-4 py-2 border-3 border-solid border-gray-700">
                {item.name}
              </div>
            </div>
          </li>
        ))}
      </nav>

      {/* Settings button */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <button className="text-gray-400 hover:text-white transition-colors">
          <CogIcon className="h-8 w-8 text-white" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
