// src/components/Sidebar.jsx
import React, { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';

const Sidebar = () => {
  const { conversations, getConversations, selectedConversation, setSelectedConversation, isConversationsLoading } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();

  useEffect(() => {
    getConversations();
  }, [getConversations]);

  if (isConversationsLoading) {
    return (
      <aside className="h-full w-20 md:w-80 border-r border-slate-800 bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500/30 border-t-purple-500" />
      </aside>
    );
  }

  return (
    <aside className="h-full w-20 md:w-80 border-r border-slate-800 bg-slate-900 flex flex-col transition-all duration-300">
      {/* Header Search Wrapper */}
      <div className="p-4 border-b border-slate-800 hidden md:block">
        <h1 className="text-xl font-bold text-white mb-1">Chats</h1>
        <p className="text-xs text-slate-500">Connect with your friends</p>
      </div>

      {/* Conversation Thread Nodes */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm hidden md:block">
            No active conversations
          </div>
        ) : (
          conversations.map((convo) => {
            // Your backend models assign array sets inside the room. Let's find the counterpart metadata
            const partner = convo.participants?.find((p) => p._id !== authUser?._id);
            const isSelected = selectedConversation?._id === convo._id;
            const isOnline = partner ? onlineUsers.includes(partner._id) : false;

            return (
              <button
                key={convo._id}
                onClick={() => setSelectedConversation(convo)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition group text-left ${
                  isSelected 
                    ? 'bg-purple-600/10 border border-purple-500/20 text-white' 
                    : 'border border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                {/* Avatar Status Ring Layout */}
                <div className="relative flex-shrink-0 mx-auto md:mx-0">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-semibold capitalize text-slate-300">
                    {partner?.name?.charAt(0) || '?'}
                  </div>
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
                  )}
                </div>

                {/* Counterpart contextual string details */}
                <div className="hidden md:block flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold truncate text-slate-200 group-hover:text-white">
                      {partner?.name || "Unknown User"}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {convo.lastMessage?.text || "Click to open conversation thread"}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
};

export default Sidebar;