import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AuthToggle from '../components/AuthToggle';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import AnimatedGradientBackground from '../components/AnimatedGradientBackground';
import Header from "../components/Header";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AnimatedGradientBackground>
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-2xl w-full max-w-md relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-center mb-6 text-white">
              Join the Prediction!
            </h2>
            <AuthToggle />
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white">
                  User Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 text-white placeholder-white/50"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 text-white placeholder-white/50"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="mt-1 block w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 text-white placeholder-white/50"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/70 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  Sign Up
                </motion.button>
              </div>
            </form>
            <div className="mt-6">
              <p className="text-center text-sm text-white/80">
                By signing up, you agree to our{' '}
                <a href="/terms" className="font-medium text-white hover:text-pink-200">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="/privacy" className="font-medium text-white hover:text-pink-200">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatedGradientBackground>
  );
};

export default SignUp;
