'use client';

import React, { useEffect, useState } from 'react';
import PulsingBorderShader from './PulsingBorderShader';

interface SplashScreenProps {
  onClose: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onClose }) => {

  return (
    <>
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.3; }
          100% { transform: scale(1.2); opacity: 0.8; }
        }
      `}</style>
      <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Tablet-only overlay */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-[2226px] h-[90vh] rounded-3xl bg-black/85 backdrop-blur-md"></div>
      </div>

      {/* Pulsing Border Effect - Positioned to the right */}
      <div className="absolute inset-0 flex items-center justify-end pr-32 pointer-events-none z-5">
        <div className="opacity-80">
          <PulsingBorderShader />
        </div>
      </div>
      
      {/* Splash content - Left aligned in tablet */}
      <div className="relative z-10 w-full max-w-[2226px] h-[90vh] flex flex-col justify-center px-16 text-left">
        <div className="max-w-5xl space-y-12">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-purple-600/20 backdrop-blur-sm rounded-full border border-purple-400/30">
            <div className="w-6 h-6 text-purple-300">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <span className="text-purple-200 font-semibold text-lg">AI-Powered Government Platform</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-1">
            <h1 className="text-8xl font-bold leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400" style={{textShadow: '0 0 20px rgba(147, 51, 234, 0.6), 0 0 40px rgba(147, 51, 234, 0.4)'}}>
                Omni
              </span>
              <span className="text-white" style={{textShadow: '0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 255, 255, 0.2)'}}>-Government Vision</span>
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-6 pt-8">
            <button
              onClick={onClose}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-2"
            >
              Go to Dashboard
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
              </svg>
            </button>
            
            <button className="px-8 py-4 bg-transparent border-2 border-gray-600 text-gray-300 text-lg font-semibold rounded-full hover:border-gray-500 hover:text-white transition-all duration-300">
              Digital Concierge
            </button>
            
            <button className="px-8 py-4 bg-transparent border-2 border-gray-600 text-gray-300 text-lg font-semibold rounded-full hover:border-gray-500 hover:text-white transition-all duration-300">
              Digital Workforce
            </button>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center gap-8 pt-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Available 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <span>No setup required</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Enterprise ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default SplashScreen;
