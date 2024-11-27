import React, { useState } from 'react';
import {
  HomeIcon,
  FilmIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  TvIcon,
  CogIcon,
  Bars3Icon,
} from '@heroicons/react/24/solid';
import '../styles/Sidebar.css'; // Import the CSS file

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // Track the selected item
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isCogRotated, setIsCogRotated] = useState(false); // New state to track rotation

  const menuItems = [
    { name: 'Home', icon: HomeIcon },
    { name: 'News', icon: DocumentTextIcon },
    { name: 'Movies', icon: FilmIcon },
    { name: 'Favorites', icon: VideoCameraIcon },
    { name: 'Chat', icon: TvIcon },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const toggleCogRotation = () => setIsCogRotated(!isCogRotated); // Toggle cog rotation

  const handleItemClick = (index) => {
    setSelectedItem(index); // Set the clicked item as selected
    
    // Set the selection with a delay of 450ms
    setTimeout(() => {
      setSelectedItem(index);
    }, ); // 450ms delay for selection effect
  };

  return (
    <div className="relative">
      <button
        onClick={toggleSidebar}
        className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors z-20"
      >
        <Bars3Icon className="h-8 w-8" />
      </button>

      <aside
        className={`sidebar ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
      >
        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <li
              key={index}
              onClick={() => handleItemClick(index)} // Add click handler
              className={selectedItem === index ? 'selected' : ''} // Conditional selected class
              style={{}}
            >
              <item.icon className="icon" />
              <div className={`text ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                {item.name}
              </div>
            </li>
          ))}
        </nav>

        <div className="settings-button">
          <button
            onClick={() => {
              toggleModal();
              toggleCogRotation(); // Rotate the cog on click
            }}
            className={`settings-icon ${isCogRotated ? 'rotated' : ''}`} // Apply the rotated class conditionally
          >
            <CogIcon className="h-8 w-8 text-[#858a8f]" />
          </button>
          <div className={`cog-text ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
            Settings
          </div>
        </div>
      </aside>

      {isModalOpen && (
        <div className="modal">
          <div className="switch">
            <span className="text-gray-200 mr-2">Enable Dark Mode</span>
            <label>
              <input
                type="checkbox"
                className="sr-only"
                checked={darkMode}
                onChange={toggleDarkMode}
              />
              <div className="toggle">
                <div
                  className={`dot ${darkMode ? 'active' : ''}`}
                ></div>
              </div>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
