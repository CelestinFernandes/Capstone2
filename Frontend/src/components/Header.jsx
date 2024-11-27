import React, { useState, useEffect } from "react"
import { Film, Home, Info, LineChart, LogOut, Menu, Search, X } from "lucide-react"
import { FaSun, FaMoon } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [theme, setTheme] = useState("light")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
  }

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Prediction", href: "/prediction", icon: LineChart },
    { name: "About", href: "/about", icon: Info },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between px-4">
          <a href="/" className="flex items-center space-x-2 text-xl font-bold hover:opacity-75">
            <Film className="text-white font-bold text-lgh-6 w-6" />
            <span className="text-white font-bold text-lg">BrownieBuddy</span>
          </a>
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="group relative px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-white"
              >
                <span>{item.name}</span>
                <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-gray-900 dark:via-white to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            ))}
          </nav>
          <div className="hidden lg:flex items-center space-x-4">
            <div className="relative">
              <input
                type="search"
                placeholder="Search movies..."
                className="w-64 pr-8 py-2 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <Search className="h-4 w-4" />
              </button>
            </div>
            <button
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={toggleTheme}
            >
              {theme === "light" ? <FaMoon className="h-5 w-5" /> : <FaSun className="h-5 w-5" />}
            </button>
            <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
              {isAuthenticated ? (
                <>
                  <LogOut className="h-5 w-5 mr-2 inline" />
                  Log out
                </>
              ) : (
                <Link to="/signup">Sign Up</Link>
              )}
            </button>
          </div>
          <div className="flex lg:hidden items-center space-x-4">
            {/* Add the Theme Toggle Button before the hamburger menu */}
            <button
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={toggleTheme}
            >
              {theme === "light" ? <FaMoon className="h-5 w-5" /> : <FaSun className="h-5 w-5" />}
            </button>

            {/* Hamburger Menu Button */}
            <button
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-1 px-4 py-3">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </a>
              ))}
              <button
                className="w-full flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
