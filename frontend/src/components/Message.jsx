// src/components/Message.jsx
import React from 'react';

const Message = ({ message, currentUserId }) => {
  const isMe = message.senderId === currentUserId;

  // Quick timestamp formatter helper string conversion
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
      {/* Partner Thumbnail Display - Only show on incoming texts */}
      {!isMe && (
        <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 capitalize flex-shrink-0">
          ?
        </div>
      )}

      <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
        {/* Message Content Bubble layout context text */}
        <div
          className={`px-4 py-2.5 text-sm rounded-2xl shadow-sm tracking-wide break-words whitespace-pre-wrap ${
            isMe
              ? 'bg-purple-600 text-white rounded-br-none'
              : 'bg-slate-800 text-slate-200 rounded-bl-none'
          }`}
        >
          {message.text}
        </div>
        
        {/* Context Timestamp metadata indicators */}
        <span className="text-[9px] text-slate-600 mt-1 px-1">
          {formatTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default Message;