"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface ProgramPaginationProps {
    currentPage: number;
    totalPages: number;
    total: number;
}

export function ProgramPagination({ currentPage, totalPages, total }: ProgramPaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    if (totalPages <= 1) {
        return null;
    }

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`/programs?${params.toString()}`);
    };

    const getVisiblePages = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
                Showing page {currentPage} of {totalPages} ({total} total programs)
            </div>
            
            <div className="flex items-center space-x-1">
                {/* Previous button */}
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 text-sm rounded-md transition-colors ${
                        currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                    }`}
                >
                    Previous
                </button>

                {/* Page numbers */}
                {visiblePages.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                                {page}
                            </span>
                        );
                    }

                    const pageNum = page as number;
                    const isCurrentPage = pageNum === currentPage;

                    return (
                        <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 text-sm rounded-md transition-colors ${
                                isCurrentPage
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                            }`}
                        >
                            {pageNum}
                        </button>
                    );
                })}

                {/* Next button */}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 text-sm rounded-md transition-colors ${
                        currentPage === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                    }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
