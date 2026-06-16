// src/components/Navbar.jsx
import React from 'react';
import { useAuthStore } from '../store/useAuthStore';

const Navbar = () => {
  const { authUser, logout } = useAuthStore();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900 px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-2">
        {/* Simple Brand Emblem */}
        <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-white shadow-md shadow-purple-600/20">
          T
        </div>
        <span className="font-bold text-lg text-white tracking-wide hidden sm:block">
          Tea-N-Toast
        </span>
      </div>

      {authUser && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-semibold text-purple-400 capitalize">
              {authUser.name?.charAt(0) || 'U'}
            </div>
            <span className="text-sm font-medium text-slate-300 hidden md:block">
              {authUser.name}
            </span>
          </div>

          <button
            onClick={logout}
            className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 rounded-lg bg-slate-950 transition active:scale-[0.98]"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;