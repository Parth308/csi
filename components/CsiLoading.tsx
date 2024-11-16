import React from 'react'

export default function CSILoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
      <div className="text-center">
        <div className="w-24 h-24 mb-4 mx-auto">
          <img 
            src="/csi_logo.png" 
            alt="CSI Logo" 
            className="w-full h-full object-contain animate-pulse"
          />
        </div>
        <h1 className="text-3xl font-bold text-[#2196f3] mb-1">Computer Society of India</h1>
        <p className="text-gray-600 mb-4">Admin Portal</p>
        <div className="flex justify-center items-center space-x-2">
          <div className="w-3 h-3 bg-[#2196f3] rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-[#2196f3] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-[#2196f3] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <p className="mt-4 text-gray-700">Loading...</p>
      </div>
    </div>
  )
}