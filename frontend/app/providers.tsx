"use client";

import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Assuming the AuthProvider is correctly implemented and exported from this path
import { AuthProvider } from "@/context/auth-context"; 

/**
 * A client component wrapper to consolidate context providers.
 * This is necessary in Next.js App Router structure where layout.tsx is a Server Component,
 * but contexts (like React Query and Auth) must be initialized in a Client Component.
 */
export function Providers({ children }: { children: ReactNode }) {
  // Initialize QueryClient once using useState to prevent re-initialization on component re-renders.
  // This instance manages caching, state management, and background fetching for all data hooks.
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Cache data for 5 minutes before considering it stale
        staleTime: 5 * 60 * 1000, 
        // Retry failed queries a maximum of 2 times
        retry: 2, 
      },
      // You can add default options for mutations here if needed
      mutations: {}
    },
  }));

  return (
    // 1. Establish the React Query context (must be the outermost data layer)
    <QueryClientProvider client={queryClient}>
      
      {/* 2. Establish the Authentication context, used by hooks like useAuth */}
      <AuthProvider>
        {children}
      </AuthProvider>
      
    </QueryClientProvider>
  );
}