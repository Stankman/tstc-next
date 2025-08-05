"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoading } from "@/components/global/loading-overlay";
import {useTranslations} from 'next-intl';

export function ProgramSearch() {
    const t = useTranslations('programs');
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showLoading, hideLoading } = useLoading();
    const currentSearch = searchParams.get("search") || "";
    const [searchTerm, setSearchTerm] = useState(currentSearch);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        // Clear loading when search params change (navigation complete)
        hideLoading();
        setIsSearching(false);
    }, [searchParams, hideLoading]);

    useEffect(() => {
        // Don't trigger on initial load if searchTerm matches currentSearch
        if (searchTerm === currentSearch) return;

        const debounceTimeout = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());

            if (searchTerm) {
                params.set("search", searchTerm);
            } else {
                params.delete("search");
            }
            params.set("page", "1");
            
            // Show loading before navigation
            setIsSearching(true);
            showLoading();
            
            router.push(`/programs?${params.toString()}`);
        }, 500);

        return () => clearTimeout(debounceTimeout);
    }, [searchTerm, router, searchParams, currentSearch, showLoading]);

    const handleClearSearch = () => {
        setSearchTerm("");
    };

    return (
        <div className="mb-6">
            <div className="relative flex">
                <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                {/* Search icon or loading spinner */}
                <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                    {isSearching ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
                    ) : (
                        <svg 
                            className="h-4 w-4 text-gray-400" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                            />
                        </svg>
                    )}
                </div>

                {/* Clear button */}
                {searchTerm && (
                    <button
                        onClick={handleClearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label="Clear search"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
            
            {/* Search status */}
            {searchTerm && (
                <div className="mt-2 text-sm text-gray-600">
                    {isSearching ? (
                        <span className="flex items-center">
                            <div className="animate-spin rounded-full h-3 w-3 border border-gray-300 border-t-blue-600 mr-2"></div>
                            Searching for "{searchTerm}"...
                        </span>
                    ) : (
                        <span>Showing results for "{searchTerm}"</span>
                    )}
                </div>
            )}
        </div>
    );
}