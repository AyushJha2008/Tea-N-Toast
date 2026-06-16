// src/components/NoChatSelected.jsx
import React from 'react';

const NoChatSelected = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950 text-center">
      <div className="w-16 h-16 rounded-2xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center mb-4 animate-pulse">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white tracking-tight">Select a conversation</h3>
      <p className="text-sm text-slate-400 max-w-sm mt-1">
        Choose a chat companion from the left sidebar panel to begin messaging instantly.
      </p>
    </div>
  );
};

export default NoChatSelected;