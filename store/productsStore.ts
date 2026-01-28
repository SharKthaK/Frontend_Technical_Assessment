import { create } from 'zustand';
import { Product, ProductsResponse } from '@/lib/types';

/**
 * Products Store using Zustand
 * 
 * Advanced caching strategy:
 * - Caches product lists by category, search query, and pagination
 * - Caches individual product details
 * - Implements cache expiration (5 minutes)
 * - Reduces API calls significantly
 * 
 * Why this approach?
 * - Instant UI updates from cache
 * - Reduced bandwidth usage
 * - Better user experience
 * - Lower server costs
 */

interface ProductsState {
  products: Product[];
  total: number;
  currentPage: number;
  limit: number;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string;
  categories: string[];
  
  // Cache for product lists
  cache: Record<string, { products: Product[]; total: number; timestamp: number }>;
  
  // Cache for individual products
  productCache: Record<number, { product: Product; timestamp: number }>;
  
  // Actions
  setProducts: (data: ProductsResponse) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setCurrentPage: (page: number) => void;
  
  // Async actions
  fetchProducts: (page?: number, search?: string, category?: string) => Promise<void>;
  fetchProductById: (id: number) => Promise<Product | null>;
  fetchCategories: () => Promise<void>;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  total: 0,
  currentPage: 1,
  limit: 10,
  loading: false,
  error: null,
  searchQuery: '',
  selectedCategory: '',
  categories: [],
  cache: {},
  productCache: {},

  setProducts: (data) => {
    set({
      products: data.products,
      total: data.total,
    });
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setCurrentPage: (page) => set({ currentPage: page }),

  fetchProducts: async (page = 1, search = '', category = '') => {
    const state = get();
    const skip = (page - 1) * state.limit;
    const cacheKey = `${category}-${search}-${page}`;
    
    // Check cache first
    const cached = state.cache[cacheKey];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      set({
        products: cached.products,
        total: cached.total,
        currentPage: page,
        searchQuery: search,
        selectedCategory: category,
      });
      return;
    }

    set({ loading: true, error: null });

    try {
      let url: string;
      
      if (category && search) {
        // Search within specific category
        url = `https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=0`;
      } else if (category) {
        url = `https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=${state.limit}&skip=${skip}`;
      } else if (search) {
        url = `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}&limit=${state.limit}&skip=${skip}`;
      } else {
        url = `https://dummyjson.com/products?limit=${state.limit}&skip=${skip}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data: ProductsResponse = await response.json();
      
      // Filter products if searching within a category
      let filteredProducts = data.products;
      let filteredTotal = data.total;
      
      if (category && search) {
        filteredProducts = data.products.filter(product => 
          product.title.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase())
        );
        filteredTotal = filteredProducts.length;
        // Apply pagination to filtered results
        const start = skip;
        const end = start + state.limit;
        filteredProducts = filteredProducts.slice(start, end);
      }
      
      // Update cache
      set({
        products: filteredProducts,
        total: filteredTotal,
        currentPage: page,
        searchQuery: search,
        selectedCategory: category,
        loading: false,
        cache: {
          ...state.cache,
          [cacheKey]: {
            products: filteredProducts,
            total: filteredTotal,
            timestamp: Date.now(),
          },
        },
      });
    } catch (error) {
      const errorMessage = error instanceof TypeError && error.message.includes('fetch')
        ? 'Failed to connect. Please check your internet connection.'
        : error instanceof Error 
        ? error.message 
        : 'Failed to fetch products';
      
      set({
        error: errorMessage,
        loading: false,
      });
    }
  },

  fetchProductById: async (id: number) => {
    const state = get();
    
    // Check cache first
    const cached = state.productCache[id];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.product;
    }

    try {
      const response = await fetch(`https://dummyjson.com/products/${id}`);
      if (!response.ok) throw new Error('Product not found');
      
      const product: Product = await response.json();
      
      // Update cache
      set({
        productCache: {
          ...state.productCache,
          [id]: {
            product,
            timestamp: Date.now(),
          },
        },
      });
      
      return product;
    } catch (error) {
      console.error('Error fetching product:', error);
      // Re-throw the error so the calling component can handle it
      throw error;
    }
  },

  fetchCategories: async () => {
    try {
      const response = await fetch('https://dummyjson.com/products/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      
      const data = await response.json();
      set({ categories: data.map((cat: any) => cat.slug) });
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  },
}));
