import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import  toast  from 'react-hot-toast';

export const useChatStore = create((get, set) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTabs: "chats",
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: localStorage.getItem("isSoundEnabled") === "true" ? true : false,

    toggleSound: () => {
        localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
        set({ isSoundEnabled: !get().isSoundEnabled });
    },

    setActiveTabs: (tab) => {
        set({ activeTabs: tab });
    },

    setSelectedUser: (selectedUser) => {
        set({ selectedUser });
    },

    getAllContacts: async () => {
        set({ isUserLoading: true });
        try {
            const res = await axiosInstance.get("/messages/contacts");

            set({ allContacts: res.data });
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUserLoading: false });
        }
    },

    getMyChatPartner: async () => {
        set({ isUserLoading: true });
        try {
            const res = await axiosInstance.get("/messages/contacts");

            set({ allContacts: res.data });
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUserLoading: false });
        }
    },
}));