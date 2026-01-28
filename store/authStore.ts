import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Authentication Store using Zustand
 * 
 * Why Zustand?
 * - Simple and minimal boilerplate compared to Redux
 * - Built-in support for async actions without middleware
 * - Small bundle size (~1kb gzipped)
 * - Easy to understand and maintain
 * - Perfect for small to medium-sized applications
 * - No context providers needed - direct import and use
 * - Built-in devtools support
 */

interface AuthState {
  token: string | null;
  user: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    image: string;
  } | null;
  isAuthenticated: boolean;
  
  // Actions
  setAuth: (token: string, user: any) => void;
  logout: () => void;
  
  // Async action for login
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuth: (token, user) => {
        set({
          token,
          user,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },

      login: async (username: string, password: string) => {
        try {
          const response = await fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username,
              password,
              expiresInMins: 30,
            }),
          });

          if (!response.ok) {
            throw new Error('Invalid credentials');
          }

          const data = await response.json();
          
          set({
            token: data.token,
            user: {
              id: data.id,
              username: data.username,
              email: data.email,
              firstName: data.firstName,
              lastName: data.lastName,
              image: data.image,
            },
            isAuthenticated: true,
          });

          return { success: true };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Login failed',
          };
        }
      },
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
);
