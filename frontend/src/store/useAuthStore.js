// src/store/useAuthStore.js
import { create } from "zustand";
import {io, Socket} from "socket.io-client"
import api from "../api/axios";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  onlineUsers: [],
  Socket: null,

  // Initialize Socket connection
  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket?.connected) return;

    // Connect to backend server passing the userId query parameter
    const newSocket = io("http://localhost:3000", {
      query: {
        userId: authUser._id,
      },
    });

    newSocket.connect();
    set({ socket: newSocket });

    // Listen for live online user array updates from backend
    newSocket.on("getOnlineUsers", (users) => {
      set({ onlineUsers: users });
    });
  },

  // Disconnect active socket session
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  // Checks user verification on initial app loading/refresh
  checkAuth: async () => {
    try {
      const res = await api.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Handles User Registration
  signup: async (data, navigate) => {
    set({ isSigningUp: true });
    try {
      const res = await api.post("/auth/register", data);
      // Your backend returns safe user details on registration (no cookies yet, or user needs to log in)
      // If your registration doesn't auto-login, redirect to /login
      if (res.data.success) {
        navigate("/login");
      }
    } catch (error) {
      console.log("Signup error:", error.response?.data?.message || error.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Handles User Login
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await api.post("/auth/login", data);
      set({ authUser: res.data.user });
      get().connectSocket(); //live connection after login
    } catch (error) {
      console.log("Login error:", error.response?.data?.message || error.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // Handles User Logout
  logout: async () => {
    try {
      await api.post("/auth/logout");
      get().disconnectSocket() //disconnect offline
      set({ authUser: null });
    } catch (error) {
      console.log("Logout error:", error);
    }
  }
}));