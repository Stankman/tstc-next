"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { usePathname } from "next/navigation";

// Create a context for the loading state
interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  showLoading: () => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Provider component
export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);
  const pathname = usePathname();

  // Minimum loading duration in milliseconds
  const MINIMUM_LOADING_DURATION = 800;

  // Hide loading when pathname changes (navigation complete)
  useEffect(() => {
    if (loadingStartTime) {
      const elapsedTime = Date.now() - loadingStartTime;
      const remainingTime = Math.max(0, MINIMUM_LOADING_DURATION - elapsedTime);
      
      setTimeout(() => {
        setIsLoading(false);
        setLoadingStartTime(null);
      }, remainingTime);
    } else {
      setIsLoading(false);
    }
  }, [pathname, loadingStartTime]);

  const showLoading = () => {
    setIsLoading(true);
    setLoadingStartTime(Date.now());
  };

  const hideLoading = () => {
    if (loadingStartTime) {
      const elapsedTime = Date.now() - loadingStartTime;
      const remainingTime = Math.max(0, MINIMUM_LOADING_DURATION - elapsedTime);
      
      setTimeout(() => {
        setIsLoading(false);
        setLoadingStartTime(null);
      }, remainingTime);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, showLoading, hideLoading }}>
      {children}
      <LoadingOverlay />
    </LoadingContext.Provider>
  );
}

// Hook to use loading context
export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

// The actual overlay component
function LoadingOverlay() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-200" />
      
      {/* Loading content */}
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="bg-white rounded-lg p-6 shadow-xl flex flex-col items-center space-y-4 max-w-sm mx-4">
          {/* Spinner */}
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 animate-pulse"></div>
          </div>
          
          {/* Loading text */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Loading</h3>
            <p className="text-sm text-gray-600">Please wait while we load your content...</p>
          </div>
          
          {/* Progress dots */}
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </>
  );
}

// Enhanced Link component with loading state
import Link from "next/link";
import { ComponentProps, MouseEvent } from "react";

interface LoadingLinkProps extends ComponentProps<typeof Link> {
  showLoader?: boolean;
}

export function LoadingLink({ 
  showLoader = true, 
  onClick, 
  children, 
  ...props 
}: LoadingLinkProps) {
  const { showLoading } = useLoading();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (showLoader) {
      showLoading();
    }
    onClick?.(e);
  };

  return (
    <Link {...props} onClick={handleClick}>
      {children}
    </Link>
  );
}

// Button component with loading state
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
}

export function LoadingButton({ 
  loading = false, 
  loadingText = "Loading...", 
  disabled,
  children,
  className = "",
  ...props 
}: LoadingButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`relative ${className} ${loading ? 'cursor-not-allowed' : ''}`}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
        </div>
      )}
      <span className={loading ? 'invisible' : 'visible'}>
        {loading ? loadingText : children}
      </span>
    </button>
  );
}