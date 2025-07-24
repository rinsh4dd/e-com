import React from 'react';
import { IoLogoAmplify } from "react-icons/io5";

const ShoeCartLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="flex flex-col items-center space-y-6">
        {/* Animated Logo */}
        <div className="relative">
          {/* Pulsing background circle */}
          <div className="absolute inset-0 rounded-full bg-red-500 opacity-20 animate-ping"></div>
          <div className="absolute inset-0 rounded-full bg-red-500 opacity-40 animate-pulse"></div>
          
          {/* Logo container */}
          <div className="relative w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <IoLogoAmplify className="text-3xl text-white" />
          </div>
        </div>

        {/* ShoeCart Text */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Shoe<span className="text-red-500">Cart</span>
          </h1>
          <p className="text-gray-600 text-sm">Loading your experience...</p>
        </div>

        {/* Loading Dots */}
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};


export default ShoeCartLoader;