// src/pages/Home.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ChatContainer from '../components/ChatContainer';
import NoChatSelected from '../components/NoChatSelected';
import { useChatStore } from '../store/useChatStore';

const Home = () => {
  const selectedConversation = useChatStore((state) => state.selectedConversation);

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Application Header */}
      <Navbar />

      {/* Main Core Section Splitter */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        {/* Dynamic Inner Right Panel Render */}
        {!selectedConversation ? (
          <NoChatSelected />
        ) : (
          <ChatContainer />
        )}
      </div>
    </div>
  );
};

export default Home;