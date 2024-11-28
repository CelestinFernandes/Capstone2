import React from 'react';
import { Film, Mail } from 'lucide-react';
import { IoLogoGithub } from "react-icons/io";
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Film className="h-6 w-6" />
              <span className="text-xl font-bold">BrownieBuddy</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Predicting box office success through analytics and machine learning.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/prediction" className="text-muted-foreground hover:text-foreground">
                  Movie Predictions
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="https://github.com/CelestinFernandes/Capstone2.git" className="text-muted-foreground hover:text-foreground" target="_blank" rel="noopener noreferrer">
                <IoLogoGithub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="mailto:celestin.fernandes21@st.niituniversity.in" className="text-muted-foreground hover:text-foreground">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} BrownieBuddy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}