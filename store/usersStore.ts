import { create } from 'zustand';
import { User, UsersResponse } from '@/lib/types';

/**
 * Users Store using Zustand
 * 
 * Implements client-side caching to:
 * - Reduce unnecessary API calls
 * - Improve performance
 * - Provide instant UI feedback
 * - Reduce server load
 * 
 * Caching Strategy:
 * - Cache search results by query string
 * - Cache individual user details by ID
 * - Cache expires after page refresh (session-based)
 * - Can be extended to use localStorage for persistent caching
 */

interface UsersState {
  users: User[];
  total: number;
  currentPage: number;
  limit: number;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  
  // Cache for search results
  cache: Record<string, { users: User[]; total: number; timestamp: number }>;
  
  // Cache for individual users
  userCache: Record<number, { user: User; timestamp: number }>;
  
  // Actions
  setUsers: (data: UsersResponse) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  
  // Async actions
  fetchUsers: (page?: number, search?: string) => Promise<void>;
  fetchUserById: (id: number) => Promise<User | null>;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  total: 0,
  currentPage: 1,
  limit: 10,
  loading: false,
  error: null,
  searchQuery: '',
  cache: {},
  userCache: {},

  setUsers: (data) => {
    set({
      users: data.users,
      total: data.total,
    });
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCurrentPage: (page) => set({ currentPage: page }),

  fetchUsers: async (page = 1, search = '') => {
    const state = get();
    const skip = (page - 1) * state.limit;
    const cacheKey = `${search}-${page}`;
    
    // Check cache first
    const cached = state.cache[cacheKey];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      set({
        users: cached.users,
        total: cached.total,
        currentPage: page,
        searchQuery: search,
      });
      return;
    }

    set({ loading: true, error: null });

    try {
      const url = search
        ? `https://dummyjson.com/users/search?q=${encodeURIComponent(search)}&limit=${state.limit}&skip=${skip}`
        : `https://dummyjson.com/users?limit=${state.limit}&skip=${skip}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const data: UsersResponse = await response.json();
      
      // Update cache
      set({
        users: data.users,
        total: data.total,
        currentPage: page,
        searchQuery: search,
        loading: false,
        cache: {
          ...state.cache,
          [cacheKey]: {
            users: data.users,
            total: data.total,
            timestamp: Date.now(),
          },
        },
      });
    } catch (error) {
      const errorMessage = error instanceof TypeError && error.message.includes('fetch')
        ? 'Failed to connect. Please check your internet connection.'
        : error instanceof Error 
        ? error.message 
        : 'Failed to fetch users';
      
      set({
        error: errorMessage,
        loading: false,
      });
    }
  },

  fetchUserById: async (id: number) => {
    const state = get();
    
    // Check cache first
    const cached = state.userCache[id];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.user;
    }

    try {
      const response = await fetch(`https://dummyjson.com/users/${id}`);
      if (!response.ok) throw new Error('User not found');
      
      const user: User = await response.json();
      
      // Update cache
      set({
        userCache: {
          ...state.userCache,
          [id]: {
            user,
            timestamp: Date.now(),
          },
        },
      });
      
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      // Re-throw the error so the calling component can handle it
      throw error;
    }
  },
}));
