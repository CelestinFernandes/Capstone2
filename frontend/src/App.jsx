// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import React from "react";
// import Home from "./pages/Home";
// import About from "./pages/About";
// import Prediction from "./pages/Prediction";
// import SignUp from "./pages/SignUp";
// import SignIn from "./pages/SignIn";
// import Header from "./components/Header";
// import Footer from "./components/Footer";

// export default function App() {
//   return ( 
//   <BrowserRouter>
//   <Header />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/prediction" element={<Prediction />} />
//         <Route path="/signin" element={<SignIn />} />
//         <Route path="/signup" element={<SignUp />} />
//         <Route path="/about" element={<About />} />
//       </Routes>
//       <Footer />  
//       </BrowserRouter>
//   );
// }



import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route, no need for Router
import Sidebar from './components/Sidebar'; // Import Sidebar
import MovieGrid from './components/MovieGrid'; // Import MovieGrid
import News from './pages/News'; // Import the News page component

const App = () => {
  // Check if dark mode setting exists in localStorage
  const savedDarkMode = localStorage.getItem('darkMode') === 'true';

  // Initialize dark mode state based on saved preference or default to true
  const [darkMode, setDarkMode] = useState(savedDarkMode);

  const [sidebarExpanded, setSidebarExpanded] = useState(true); // Track sidebar state (expanded/collapsed)

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Apply the dark mode class to the body and save the preference to localStorage
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('darkMode', 'true'); // Save dark mode preference
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('darkMode', 'false'); // Save light mode preference
    }
  }, [darkMode]);

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-[#121212]' : 'bg-[#f5f5f5]'} transition-colors duration-300`}>
      {/* Sidebar */}
      <Sidebar sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded} />

      {/* Main content area */}
      <div
        className={`flex-1 flex flex-col overflow-y-auto transition-all duration-300 ease-in-out`}
        style={{
          marginLeft: '5vw', // Apply a 5vw margin to the content area from the left
        }}
      >
        <div className="flex flex-col p-6 flex-grow">
          <Routes>
            {/* Default home page route */}
            <Route path="/" element={
              <div>
                <h2 className="text-3xl font-semibold text-white dark:text-gray-100 mb-4">Top Rated</h2>
                <MovieGrid category="top-rated" />
                <h2 className="text-3xl font-semibold text-white dark:text-gray-100 mt-8 mb-4">Best of Action</h2>
                <MovieGrid category="action" />
              </div>
            } />

            {/* News page route */}
            <Route path="/news" element={<News />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
