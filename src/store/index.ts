"use client";

import { create } from "zustand";

// ============================================
// Auth Modal Store
// ============================================
interface AuthStore {
  isOpen: boolean;
  mode: "login" | "register";
  openLogin: () => void;
  openRegister: () => void;
  close: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isOpen: false,
  mode: "login",
  openLogin: () => set({ isOpen: true, mode: "login" }),
  openRegister: () => set({ isOpen: true, mode: "register" }),
  close: () => set({ isOpen: false }),
}));

// ============================================
// User Store
// ============================================
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  plan: "free" | "pro" | "studio";
  credits: number;
}

interface UserStore {
  user: UserProfile | null;
  isLoading: boolean;
  setUser: (user: UserProfile) => void;
  clearUser: () => void;
  updateCredits: (credits: number) => void;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  clearUser: () => set({ user: null, isLoading: false }),
  updateCredits: (credits) =>
    set((state) => ({
      user: state.user ? { ...state.user, credits } : null,
    })),
  setLoading: (isLoading) => set({ isLoading }),
}));

// ============================================
// Generation Store
// ============================================
export interface Generation {
  id: string;
  type: "2d" | "3d";
  prompt: string;
  style: string;
  status: "pending" | "processing" | "completed" | "failed";
  imageUrl: string | null;
  modelUrl: string | null;
  modelFormat: string | null;
  creditsUsed: number;
  createdAt: string;
}

interface GenerationStore {
  generations: Generation[];
  currentGeneration: Generation | null;
  isGenerating: boolean;
  is3DConverting: boolean;
  setGenerations: (generations: Generation[]) => void;
  addGeneration: (generation: Generation) => void;
  setCurrentGeneration: (generation: Generation | null) => void;
  updateGeneration: (id: string, updates: Partial<Generation>) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setIs3DConverting: (is3DConverting: boolean) => void;
}

export const useGenerationStore = create<GenerationStore>((set) => ({
  generations: [],
  currentGeneration: null,
  isGenerating: false,
  is3DConverting: false,
  setGenerations: (generations) => set({ generations }),
  addGeneration: (generation) =>
    set((state) => ({ generations: [generation, ...state.generations] })),
  setCurrentGeneration: (currentGeneration) => set({ currentGeneration }),
  updateGeneration: (id, updates) =>
    set((state) => ({
      generations: state.generations.map((g) =>
        g.id === id ? { ...g, ...updates } : g
      ),
      currentGeneration:
        state.currentGeneration?.id === id
          ? { ...state.currentGeneration, ...updates }
          : state.currentGeneration,
    })),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setIs3DConverting: (is3DConverting) => set({ is3DConverting }),
}));
