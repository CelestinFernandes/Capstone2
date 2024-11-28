import React, { useState, useEffect } from 'react';
import { HomeIcon, FilmIcon, DocumentTextIcon, VideoCameraIcon, TvIcon, CogIcon, Bars3Icon } from '@heroicons/react/24/solid';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import '../styles/Sidebar.css'; // Import the CSS file

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // Initially set to null
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isCogRotated, setIsCogRotated] = useState(false); // New state to track rotation
  const navigate = useNavigate(); // hook to navigate in react-router

  const menuItems = [
    { name: 'Home', icon: HomeIcon, path: '/' },
    { name: 'News', icon: DocumentTextIcon, path: '/news' },
    { name: 'Search&nbsp;Results', icon: FilmIcon, path: '/SearchPage' },
    { name: 'Analytics', icon: VideoCameraIcon, path: '/AnalyticsPage' },
    { name: 'Favorites', icon: VideoCameraIcon, path: '/favorites' },
    { name: 'Chat', icon: TvIcon, path: '/chat' },
  ];

  // Load the selected item from localStorage when the component mounts
  useEffect(() => {
    const storedSelectedItem = localStorage.getItem('selectedItem');
    if (storedSelectedItem !== null) {
      setSelectedItem(Number(storedSelectedItem)); // Set the selected item to the stored value
    } else {
      setSelectedItem(0); // Default to Home if nothing is stored
    }
  }, []);

  // Save the selected item to localStorage whenever it changes
  useEffect(() => {
    if (selectedItem !== null) {
      localStorage.setItem('selectedItem', selectedItem); // Save to localStorage
    }
  }, [selectedItem]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleCogRotation = () => setIsCogRotated(!isCogRotated); // Toggle cog rotation

  const handleItemClick = (index) => {
    setSelectedItem(index); // Set the clicked item as selected
  };

  // Create a separate handleClick function for both icon and text click
  const handleClick = (index, path) => {
    handleItemClick(index); // Handle item click (selection)
    navigate(path); // Redirect to the desired path
  };

  return (
    <div className="relative">
      <button
        onClick={toggleSidebar}
        className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors z-20"
      >
        <Bars3Icon className="h-8 w-8" />
      </button>

      <aside className={`sidebar ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={selectedItem === index ? 'selected' : ''} // Conditional selected class
            >
              {/* Icon click handler */}
              <div 
                className="icon-wrapper"
                onClick={() => handleClick(index, item.path)} // Handle click for icon
              >
                <item.icon className="icon" />
              </div>

              {/* Text click handler */}
              <div className="text-wrapper">
                <Link
                  to={item.path} // Use Link for routing
                  className={`link ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    visibility: isSidebarOpen ? 'visible' : 'hidden',
                    width: isSidebarOpen ? 'auto' : '0',
                    padding: isSidebarOpen ? '0.5rem' : '0', // Adjust the padding to make sure the link remains clickable
                  }}
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default Link behavior to use custom handler
                    handleClick(index, item.path); // Call custom click handler
                  }}
                >
                  {item.name}
                </Link>
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
                <div className={`dot ${darkMode ? 'active' : ''}`}></div>
              </div>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
