// src/store/useChatStore.js
import { create } from "zustand";
import api from "../api/axios";
import {useAuthStore} from "./useAuthStore"

export const useChatStore = create((set, get) => ({
  users: [],
  conversations: [],
  messages: [],
  selectedConversation: null, // Holds the current active conversation object
  isUsersLoading: false,
  isConversationsLoading: false,
  isMessagesLoading: false,

  // Fetch available users for side searching/listing
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await api.get("/users"); // Matches your router.get("/", auth, getUsers)
      set({ users: res.data.users || res.data });
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Fetch existing conversations
  getConversations: async () => {
    set({ isConversationsLoading: true });
    try {
      const res = await api.get("/convo");
      set({ conversations: res.data });
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      set({ isConversationsLoading: false });
    }
  },

  //start convo
  startConversation: async (partnerId) => {
    try {
      const res = await api.post("/convo/start", { participantId: partnerId });
      const newConversation = res.data;

      const existingConvo = get().conversations.find(c => c._id === newConversation._id);

      if (!existingConvo) {
        set({ conversations: [newConversation, ...get().conversations] });
      }

      set({ selectedConversation: newConversation });
      get().getMessages(newConversation._id);
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  },

  // Fetch messages from a specific conversation
  getMessages: async (conversationId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await api.get(`/messages/${conversationId}`);
      set({ messages: res.data });
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Send message to current conversation room backend API
  sendMessage: async (messageData) => {
    const { selectedConversation, messages, conversations } = get();
    if (!selectedConversation) return;

    try {
      const res = await api.post(`/messages/send/${selectedConversation._id}`, messageData);
      const newMsg = res.data;
      set({ messages: [...messages, newMsg] });
      //update sidebar preview
      set({
        conversations: conversations.map((c) =>
          c._id === selectedConversation._id ? { ...c, lastMessage: newMsg } : c
        ),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  },

  // Real-time listener binder for new incoming messages
  subscribeToMessages: () => {
    const selectedConversation = get().selectedConversation;
    if (!selectedConversation) return;

    // Grab the active socket instance from the auth store
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // Remove old listeners to avoid duplicate message triggers
    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      // Append only if the message belongs to the open chat
      if (newMessage.conversationId !== selectedConversation._id) return;
      
      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) socket.off("newMessage");
  },

  // Set the currently opened chat room
  setSelectedConversation: (conversation) => {
    set({ selectedConversation: conversation });
    if (conversation) {
      get().getMessages(conversation._id);
    } else {
      set({ messages: [] });
    }
  },
}));
