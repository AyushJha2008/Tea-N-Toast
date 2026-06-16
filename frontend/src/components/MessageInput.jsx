// src/components/MessageInput.jsx
import React, { useState } from 'react';
import { useChatStore } from '../store/useChatStore';

const MessageInput = () => {
  const [text, setText] = useState('');
  const sendMessage = useChatStore((state) => state.sendMessage);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await sendMessage({ text: text.trim() });
      setText(''); // Reset text state input field buffer on successful post tracking
    } catch (error) {
      console.error("Failed to post context message text dispatch:", error);
    }
  };

  return (
    <div className="p-4 bg-slate-900 border-t border-slate-800/80">
      <form onSubmit={handleSend} className="flex items-center gap-2 max-w-6xl mx-auto">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/80 transition-all duration-150"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:hover:bg-purple-600 text-white px-5 py-3 rounded-xl font-medium text-sm transition-all shadow-md shadow-purple-600/10 flex items-center justify-center"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default MessageInput;