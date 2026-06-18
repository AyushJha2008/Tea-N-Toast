// src/components/Sidebar.jsx
import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import UserSearchModal from "../components/UserSearchModel.jsx";

const Sidebar = () => {
  const {
    conversations,
    getConversations,
    selectedConversation,
    setSelectedConversation,
    isConversationsLoading,
  } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
        <div>
          <h1 className="text-xl font-bold text-white mb-1">Chats</h1>
          <p className="text-xs text-slate-500">Connect with your friends</p>
        </div>
        <button
          onClick={() => setIsSearchOpen(true)}
          className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md shadow-purple-600/10 text-xs font-semibold transition active:scale-95"
          title="New Chat"
        >
          + New Chat
        </button>
      </div>

      {/* Mini View Trigger for Small Screens */}
      <div className="p-2 border-b border-slate-800 md:hidden flex justify-center">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-10 h-10 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md transition"
        >
          +
        </button>
      </div>

      {/* Conversation Thread Nodes */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm hidden md:block">
            No active conversations. <br />
            <button onClick={() => setIsSearchOpen(true)} className="text-purple-400 font-medium hover:underline mt-2">
              Find users to talk to
            </button>
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
                    ? "bg-purple-600/10 border border-purple-500/20 text-white"
                    : "border border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                }`}
              >
                {/* Avatar Status Ring Layout */}
                <div className="relative flex-shrink-0 mx-auto md:mx-0">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-semibold capitalize text-slate-300">
                    {partner?.name?.charAt(0) || "?"}
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

      {/* Mount Search Modal Component overlay */}
      <UserSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </aside>
  );
};

export default Sidebar;
