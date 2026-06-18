// src/components/ChatContainer.jsx
import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import MessageInput from './MessageInput';
import Message from './Message';

const ChatContainer = () => {
  const { messages, selectedConversation, isMessagesLoading, getMessages, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();
  const messageEndRef = useRef(null);

  // Identify the chat companion profile info
  const partner = selectedConversation?.participants?.find((p) => p._id !== authUser?._id);
  const isOnline = partner ? onlineUsers.includes(partner._id) : false;

  // Scroll to bottom anchor smooth helper trigger
  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Re-fetch message histories whenever the selected thread changes
  useEffect(() => {
    if (selectedConversation?._id) {
      getMessages(selectedConversation._id);
    }
  }, [selectedConversation?._id, getMessages]);

  // Bind and unbind real-time listeners on conversation swap
  useEffect(() => {
    subscribeToMessages();

    return () => {
      unsubscribeFromMessages();
    };
  }, [selectedConversation?._id, subscribeToMessages, unsubscribeFromMessages]);

  // Handle auto-scroll whenever the message array grows
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500/30 border-t-purple-500" />
        <p className="text-xs text-slate-500 mt-2">Loading conversation thread...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-950 h-full relative">
      {/* Active Conversation Header Layout */}
      <div className="h-16 border-b border-slate-800 bg-slate-900/50 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 capitalize">
              {partner?.name?.charAt(0) || '?'}
            </div>
            {isOnline && (
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white leading-none">{partner?.name || 'User'}</h3>
            <span className="text-[10px] text-slate-500 mt-1 block">
              {isOnline ? 'Online now' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Messages Stream Window Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <p className="text-sm text-slate-500">No messages here yet.</p>
            <p className="text-xs text-slate-600 mt-0.5">Send a message to break the ice!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <Message key={msg._id} message={msg} currentUserId={authUser?._id} />
          ))
        )}
        
        {/* Scroll Target Bottom Anchor element */}
        <div ref={messageEndRef} />
      </div>

      {/* Sticky Message Dispatched Field Input */}
      <MessageInput />
    </div>
  );
};

export default ChatContainer;