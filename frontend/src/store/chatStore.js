import { create } from 'zustand'

export const useChatStore = create((set, get) => ({
  messages: [],
  currentSessionId: null,
  isTyping: false,
  selectedCategory: null,

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      ...message,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    }],
  })),

  setMessages: (messages) => set({ messages }),

  clearMessages: () => set({ messages: [] }),

  setTyping: (isTyping) => set({ isTyping }),

  setSessionId: (sessionId) => set({ currentSessionId: sessionId }),

  setCategory: (category) => set({ selectedCategory: category }),

  updateMessageFeedback: (messageId, feedback) => set((state) => ({
    messages: state.messages.map((msg) =>
      msg.id === messageId ? { ...msg, feedback } : msg
    ),
  })),
}))
