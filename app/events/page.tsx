"use client"
import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown, Play, Pause, Volume2, VolumeX, Maximize, MoreHorizontal, Menu, X, ChevronLeft } from 'lucide-react';
import { timelineData } from './timelineData';
import Link from 'next/link';

const Timeline = () => {
  const [currentYear, setCurrentYear] = useState(0); // Changed from 'false' to 0
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [autoScrollPaused, setAutoScrollPaused] = useState(false);
  const [userActive, setUserActive] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const userActivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const currentData = timelineData[currentYear];

  const handleYearClick = (index: number) => {
    setCurrentYear(index);
    resetAutoScrollTimer();
    registerUserActivity();
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const navigateTimeline = (direction: 'up' | 'down') => {
    if (direction === 'up' && currentYear > 0) {
      setCurrentYear(currentYear - 1);
    } else if (direction === 'down' && currentYear < timelineData.length - 1) {
      setCurrentYear(currentYear + 1);
    }
    resetAutoScrollTimer();
    registerUserActivity();
  };

  // Register user activity and set timer for inactivity
  const registerUserActivity = () => {
    setUserActive(true);
    setAutoScrollPaused(true);
    
    // Clear any existing user activity timer
    if (userActivityTimerRef.current) {
      clearTimeout(userActivityTimerRef.current);
    }
    
    // Set a new timer for inactivity detection (5 seconds)
    userActivityTimerRef.current = setTimeout(() => {
      setUserActive(false);
      setAutoScrollPaused(false); // Resume auto-scrolling after inactivity
    }, 5000);
  };

  const resetAutoScrollTimer = () => {
    // Clear any existing timer
    if (autoScrollTimerRef.current) {
      clearTimeout(autoScrollTimerRef.current);
    }
    
    // Set a new timer if auto-scroll is not paused
    if (!autoScrollPaused) {
      autoScrollTimerRef.current = setTimeout(() => {
        // Go to next year if possible, otherwise go to the first year
        if (currentYear < timelineData.length - 1) {
          setCurrentYear(prev => prev + 1);
        } else {
          setCurrentYear(0);
        }
      }, 10000); // 10 seconds
    }
  };

  // Set up auto-scroll timer
  useEffect(() => {
    resetAutoScrollTimer();
    
    // Clean up on unmount
    return () => {
      if (autoScrollTimerRef.current) {
        clearTimeout(autoScrollTimerRef.current);
      }
      if (userActivityTimerRef.current) {
        clearTimeout(userActivityTimerRef.current);
      }
    };
  }, [currentYear, autoScrollPaused]);

  // Detect user activity
  useEffect(() => {
    const handleActivity = () => {
      registerUserActivity();
    };

    // Add event listeners for user activity
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('scroll', handleActivity);
    
    // Add resize listener to handle responsive layouts
    const handleResize = () => {
      // Auto-open sidebar on larger screens
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    // Initialize sidebar state based on screen size
    handleResize();

    // Initial user activity registration
    registerUserActivity();

    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    interface KeyboardHandler {
      (e: KeyboardEvent): void;
    }

    const handleKeyPress: KeyboardHandler = (e) => {
      if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateTimeline('up');
      }
      if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateTimeline('down');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentYear]);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-gradient-radial from-[#000033] to-black text-white">
      {/* Back Button */}
      <Link href="/">
        <button className="fixed z-50 top-4 right-4 p-2 rounded-full bg-blue-900/80 text-cyan-300 hover:bg-blue-800/90 transition-colors flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
      </Link>
      
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed z-50 top-4 left-4 p-2 rounded-full bg-blue-900/80 text-cyan-300"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <div className="flex h-full w-full overflow-hidden">
        {/* Left Timeline Sidebar - Responsive */}
        <div 
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          } fixed md:static z-40 w-full max-w-[18rem] md:max-w-[20rem] lg:w-80 bg-gradient-to-b from-[#05050A]/80 via-[#0B1A2D] to-[#04070F] border-r border-[#0B1A2D] 
            flex flex-col overflow-y-auto h-full transition-transform duration-300 ease-in-out`}
        >
          <div className="font-bold text-xl md:text-2xl text-center py-6 md:py-10 border-b border-blue-900 text-cyan-300">
            Timeline
          </div>
          
          {/* Timeline Navigation - Updated to show date instead of year */}
          <div className="flex-1 relative overflow-y-auto">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-blue-800"></div>
            
            {timelineData.map((item, index) => (
              <div
                key={item.date}
                onClick={() => handleYearClick(index)}
                className={`relative cursor-pointer py-4 md:py-6 px-8 transition-all duration-300 ${
                  currentYear === index ? 'bg-[#000044] shadow-lg shadow-blue-900/20' : 'hover:bg-[#000044]/50'
                }`}
              >
                <div className={`absolute left-7 w-2 md:w-3 h-2 md:h-3 rounded-full border-2 transition-all ${
                  currentYear === index ? 'bg-yellow-300 border-cyan-300' : 'bg-blue-600 border-blue-400'
                }`}></div>
                
                <div className="ml-6">
                  <div className={`text-sm md:text-base font-bold transition-colors ${
                    currentYear === index ? 'text-cyan-300' : 'text-blue-400'
                  }`}>
                    {item.date}
                  </div>
                  <div className={`text-sm transition-colors ${
                    currentYear === index ? 'text-white' : 'text-blue-300'
                  }`}>
                    {item.title}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline Controls - No changes needed */}
          <div className="py-6 md:py-10 border-t border-blue-900">
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigateTimeline('up')}
                disabled={currentYear === 0}
                className="p-2 rounded-lg bg-blue-800 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronUp className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </button>
              <button
                onClick={() => navigateTimeline('down')}
                disabled={currentYear === timelineData.length - 1}
                className="p-2 rounded-lg bg-blue-800 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronDown className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-gradient-to-b from-[#05050A]/80 via-[#0B1A2D] to-[#04070F] overflow-y-auto w-full">
          <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 pt-14 md:pt-8">
            {/* Date Display - Updated to show date instead of year */}
            <div className="text-right mb-4 md:mb-8">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-800 to-white leading-none">
                {currentData.date}
              </div>
            </div>

            {/* Content in single column layout - Restructured to place content below description */}
            <div className="space-y-6 md:space-y-8">
              {/* Title and Description */}
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cyan-300 mb-2 md:mb-4">
                  {currentData.title}
                </h2>
                <p className="text-blue-200 text-base md:text-lg mb-4 md:mb-6">
                  {currentData.description}
                </p>
              </div>
              
              {/* Content section - Moved below description */}
              <div className="bg-blue-900/20 p-6 rounded-lg border border-blue-800">
                <p className="text-blue-100 leading-relaxed">
                  {currentData.content}
                </p>
              </div>

              {/* Video Section */}
              {currentData.video && (
                <div className="bg-black rounded-lg overflow-hidden shadow-2xl shadow-cyan-900/20">
                  <div className="aspect-video relative">
                    <iframe
                      src={currentData.video.url}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                    
                    {/* Video Controls Overlay */}
                    <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 flex items-center justify-between text-white">
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <button 
                          onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                          className="p-1 hover:bg-blue-900/50 rounded"
                        >
                          {isVideoPlaying ? <Pause className="w-3 h-3 sm:w-4 sm:h-4" /> : <Play className="w-3 h-3 sm:w-4 sm:h-4" />}
                        </button>
                        <span className="text-xs sm:text-sm">0:00 / 0:27</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <button 
                          onClick={() => setIsVideoMuted(!isVideoMuted)}
                          className="p-1 hover:bg-blue-900/50 rounded"
                        >
                          {isVideoMuted ? <VolumeX className="w-3 h-3 sm:w-4 sm:h-4" /> : <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />}
                        </button>
                        <button className="p-1 hover:bg-blue-900/50 rounded">
                          <Maximize className="w-4 h-4" />
                        </button>
                        <button className="p-1 hover:bg-blue-900/50 rounded">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-black">
                    <h3 className="text-cyan-300 font-medium">{currentData.video.title}</h3>
                  </div>
                </div>
              )}

              {/* Infinite Image Gallery - replacing the existing Image Gallery section */}
              {currentData.images && Array.isArray(currentData.images) && currentData.images.length > 0 && (
                <div className="mt-8 overflow-hidden">
                  <div className="relative w-full py-4">
                    {/* First set of images */}
                    <div className="flex animate-infinite-scroll space-x-4">
                      {currentData.images.map((image, index) => (
                        <div key={`original-${index}`} className="flex-shrink-0">
                          <img
                            src={image}
                            alt={`${currentData.title} - Image ${index + 1}`}
                            className="h-48 md:h-60 w-auto object-cover rounded-md"
                          />
                        </div>
                      ))}
                      
                      {/* Duplicate set for seamless scrolling */}
                      {currentData.images.map((image, index) => (
                        <div key={`duplicate-${index}`} className="flex-shrink-0">
                          <img
                            src={image}
                            alt={`${currentData.title} - Image ${index + 1}`}
                            className="h-48 md:h-60 w-auto object-cover rounded-md"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {userActive && (<div className='hidden'>User is active</div>)}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }

        .animate-infinite-scroll {
          animation: infinite-scroll 10s linear infinite;
          min-width: 100%;
        }

        .animate-infinite-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Timeline;