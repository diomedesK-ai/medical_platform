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
        .glow-pill {
          box-shadow: 0 0 24px rgba(168, 85, 247, 0.55), 0 0 60px rgba(168, 85, 247, 0.4);
        }
        .glow-text {
          text-shadow: 0 0 14px rgba(192, 132, 252, 0.95), 0 0 30px rgba(168, 85, 247, 0.7);
        }
        .glow-button {
          box-shadow: 0 0 24px rgba(147, 51, 234, 0.5), 0 0 44px rgba(236, 72, 153, 0.4);
          text-shadow: 0 0 10px rgba(147, 51, 234, 0.45);
          transition: box-shadow 0.3s ease, transform 0.3s ease, color 0.3s ease;
        }
        .glow-button:hover {
          box-shadow: 0 0 36px rgba(236, 72, 153, 0.6), 0 0 64px rgba(147, 51, 234, 0.55);
          transform: translateY(-1px) scale(1.03);
          color: #fff;
        }
        .pill-transparent {
          background: rgba(168, 85, 247, 0.10);
          border-color: rgba(216, 180, 254, 0.45);
        }
        .button-soft {
          background: rgba(255, 255, 255, 0.10);
          border-color: rgba(255, 255, 255, 0.28);
          color: #ffffff;
          backdrop-filter: blur(8px);
        }
        .button-soft:hover {
          background: rgba(255, 255, 255, 0.16);
          border-color: rgba(255, 255, 255, 0.38);
          color: #ffffff;
        }
      `}</style>
      <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Tablet-only overlay */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-[2226px] h-[90vh] rounded-3xl bg-black/85 backdrop-blur-md"></div>
      </div>

      {/* Pulsing Border Effect moved inside tablet container to avoid drifting on resize */}
      
      {/* Splash content - Left aligned in tablet */}
      <div className="relative z-10 w-full max-w-[2226px] h-[90vh] flex flex-col justify-center px-16 text-left">
        {/* Circle shader anchored to tablet bounds */}
        <div className="absolute inset-y-0 right-16 flex items-center pointer-events-none z-0">
          <div className="opacity-80">
            <PulsingBorderShader />
          </div>
        </div>
        <div className="max-w-5xl space-y-12">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-3 px-8 py-4 backdrop-blur-sm rounded-full border glow-pill pill-transparent">
            <div className="w-6 h-6 text-purple-300">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <span className="text-purple-200 font-semibold text-lg glow-text">AI-Powered Healthcare Platform</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-1">
            <h1 className="text-6xl font-bold leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400" style={{textShadow: '0 0 20px rgba(147, 51, 234, 0.6), 0 0 40px rgba(147, 51, 234, 0.4)'}}>
                Redefining Healthcare Economics:
              </span>
              <span className="text-white" style={{textShadow: '0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 255, 255, 0.2)'}}> Clinical Precision at a Fraction of the Cost</span>
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
            
            <button className="px-8 py-4 border-2 text-lg font-semibold rounded-full transition-all duration-300 glow-button button-soft">
              Patient Concierge
            </button>
            
            <button className="px-8 py-4 border-2 text-lg font-semibold rounded-full transition-all duration-300 glow-button button-soft">
              Healthcare Agents
            </button>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center gap-8 pt-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>AI Agents Reduce Costs by 80%</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Same Quality, Lower Cost</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Perfect for Cost-Sensitive Regions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default SplashScreen;
