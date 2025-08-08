"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoading } from "@/components/global/loading-overlay";
import { Campus } from "@/lib/wordpress/wordpress.d";

interface ProgramCategoryFilterProps {
    campuses: Campus[];
}

export function ProgramCategoryFilter({ campuses }: ProgramCategoryFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showLoading, hideLoading } = useLoading();
    
    // Get current selected campuses from URL (can be multiple, comma-separated)
    const currentCampuses = searchParams.get("campus")?.split(",").filter(Boolean) || [];
    const [selectedCampuses, setSelectedCampuses] = useState<string[]>(currentCampuses);
    const [isFilteringByCampus, setIsFilteringByCampus] = useState(false);

    useEffect(() => {
        // Update local state when URL changes
        const urlCampuses = searchParams.get("campus")?.split(",").filter(Boolean) || [];
        setSelectedCampuses(urlCampuses);
        hideLoading();
        setIsFilteringByCampus(false);
    }, [searchParams, hideLoading]);

    const handleCampusToggle = (campusId: string) => {
        const isSelected = selectedCampuses.includes(campusId);
        let newSelectedCampuses: string[];

        if (isSelected) {
            // Remove campus
            newSelectedCampuses = selectedCampuses.filter(id => id !== campusId);
        } else {
            // Add campus
            newSelectedCampuses = [...selectedCampuses, campusId];
        }

        setSelectedCampuses(newSelectedCampuses);
        updateURL(newSelectedCampuses);
    };

    const updateURL = (campuses: string[]) => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (campuses.length > 0) {
            params.set("campus", campuses.join(","));
        } else {
            params.delete("campus");
        }
        
        // Reset to first page when filtering
        params.set("page", "1");
        
        // Show loading before navigation
        setIsFilteringByCampus(true);
        showLoading();
        
        router.push(`/programs?${params.toString()}`);
    };

    const handleClearCampuses = () => {
        setSelectedCampuses([]);
        updateURL([]);
    };

    if (campuses.length === 0) {
        return null;
    }

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-900">Campuses</h3>
                {selectedCampuses.length > 0 && (
                    <button
                        onClick={handleClearCampuses}
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                        Clear all
                    </button>
                )}
            </div>

            <div className="space-y-2">
                {campuses.map((campus) => {
                    const isSelected = selectedCampuses.includes(campus.id.toString());
                    const isDisabled = isFilteringByCampus;

                    return (
                        <label
                            key={campus.id}
                            className={`flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors ${
                                isDisabled ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => !isDisabled && handleCampusToggle(campus.id.toString())}
                                disabled={isDisabled}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                            />
                            <span className="ml-3 text-sm text-gray-700 flex-1">
                                {campus.name}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {campus.count}
                            </span>
                        </label>
                    );
                })}
            </div>

            {/* Filter status */}
            {selectedCampuses.length > 0 && (
                <div className="mt-3 text-sm text-gray-600">
                    {isFilteringByCampus ? (
                        <span className="flex items-center">
                            <div className="animate-spin rounded-full h-3 w-3 border border-gray-300 border-t-blue-600 mr-2"></div>
                            Filtering by {selectedCampuses.length} {selectedCampuses.length === 1 ? 'campus' : 'campuses'}...
                        </span>
                    ) : (
                        <span>
                            Filtered by {selectedCampuses.length} {selectedCampuses.length === 1 ? 'campus' : 'campuses'}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
