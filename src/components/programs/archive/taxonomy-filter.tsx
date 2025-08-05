"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoading } from "@/components/global/loading-overlay";

interface TaxonomyItem {
    id: number;
    name: string;
    count: number;
}

interface TaxonomyFilterProps {
    items: TaxonomyItem[];
    taxonomyKey: string; // URL parameter key (e.g., 'campus', 'industry', 'category')
    label: string; // Display label (e.g., 'Campuses', 'Industries', 'Categories')
    singularLabel?: string; // Singular form (e.g., 'Campus', 'Industry', 'Category')
}

export function TaxonomyFilter({ 
    items, 
    taxonomyKey, 
    label, 
    singularLabel 
}: TaxonomyFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showLoading, hideLoading } = useLoading();
    
    const singular = singularLabel || label.slice(0, -1); // Remove 's' if no singular provided
    
    // Get current selected items from URL (can be multiple, comma-separated)
    const currentSelection = searchParams.get(taxonomyKey)?.split(",").filter(Boolean) || [];
    const [selectedItems, setSelectedItems] = useState<string[]>(currentSelection);
    const [isFiltering, setIsFiltering] = useState(false);

    useEffect(() => {
        // Update local state when URL changes
        const urlSelection = searchParams.get(taxonomyKey)?.split(",").filter(Boolean) || [];
        setSelectedItems(urlSelection);
        hideLoading();
        setIsFiltering(false);
    }, [searchParams, hideLoading, taxonomyKey]);

    const handleItemToggle = (itemId: string) => {
        const isSelected = selectedItems.includes(itemId);
        let newSelectedItems: string[];

        if (isSelected) {
            // Remove item
            newSelectedItems = selectedItems.filter(id => id !== itemId);
        } else {
            // Add item
            newSelectedItems = [...selectedItems, itemId];
        }

        setSelectedItems(newSelectedItems);
        updateURL(newSelectedItems);
    };

    const updateURL = (items: string[]) => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (items.length > 0) {
            params.set(taxonomyKey, items.join(","));
        } else {
            params.delete(taxonomyKey);
        }
        
        // Reset to first page when filtering
        params.set("page", "1");
        
        // Show loading before navigation
        setIsFiltering(true);
        showLoading();
        
        router.push(`/programs?${params.toString()}`);
    };

    const handleClearAll = () => {
        setSelectedItems([]);
        updateURL([]);
    };

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-900">{singularLabel}</h3>
                {selectedItems.length > 0 && (
                    <button
                        onClick={handleClearAll}
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                        Clear all
                    </button>
                )}
            </div>

            <div className="space-y-2">
                {items.map((item) => {
                    const isSelected = selectedItems.includes(item.id.toString());
                    const isDisabled = isFiltering;

                    return (
                        <label
                            key={item.id}
                            className={`flex items-center cursor-pointer px-2 rounded transition-colors ${
                                isDisabled ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => !isDisabled && handleItemToggle(item.id.toString())}
                                disabled={isDisabled}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                            />
                            <span className="ml-3 text-sm text-gray-700 flex-1" dangerouslySetInnerHTML={{ __html: item.name }}>
                            </span>
                            {/* <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {item.count}
                            </span> */}
                        </label>
                    );
                })}
            </div>

            {/* Filter status */}
            {selectedItems.length > 0 && (
                <div className="mt-3 text-sm text-gray-600">
                    {isFiltering ? (
                        <span className="flex items-center">
                            <div className="animate-spin rounded-full h-3 w-3 border border-gray-300 border-t-blue-600 mr-2"></div>
                            Filtering by {selectedItems.length} {selectedItems.length === 1 ? singular.toLowerCase() : label.toLowerCase()}...
                        </span>
                    ) : (
                        <span>
                            Filtered by {selectedItems.length} {selectedItems.length === 1 ? singular.toLowerCase() : label.toLowerCase()}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
