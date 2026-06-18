// src/components/UserSearchModal.jsx
import React, { useState, useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';

const UserSearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const users = useChatStore((state) => state.users);
  const getUsers = useChatStore((state) => state.getUsers);
  const isUsersLoading = useChatStore((state) => state.isUsersLoading);
  const startConversation = useChatStore((state) => state.startConversation);
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    if (isOpen) {
      getUsers(); // Fetch users when the modal opens
    }
  }, [isOpen, getUsers]);

  if (!isOpen) return null;

  // Filter users based on input match (excluding user passwords/sensitive data)
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUser = async (userId) => {
    await startConversation(userId);
    onClose(); // Close the modal window after setting active conversation
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl flex flex-col max-h-[80vh] shadow-2xl">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Start a New Conversation</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm px-2 py-1 bg-slate-950 rounded-lg border border-slate-800">
            Close
          </button>
        </div>

        {/* Search Field Input */}
        <div className="p-4 border-b border-slate-800/60">
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
          />
        </div>

        {/* Users Item List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {isUsersLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-500/30 border-t-purple-500" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">No users found</div>
          ) : (
            filteredUsers.map((user) => {
              const isOnline = onlineUsers.includes(user._id);
              return (
                <button
                  key={user._id}
                  onClick={() => handleSelectUser(user._id)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left hover:bg-slate-800/60 transition group"
                >
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 capitalize">
                      {user.username.charAt(0)}
                    </div>
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-200 group-hover:text-white truncate">
                      {user.username}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-1 rounded-md border border-purple-500/10 opacity-0 group-hover:opacity-100 transition">
                    Chat
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSearchModal;