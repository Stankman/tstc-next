export function InstructorCardSkeleton() {
    return (
        <div className="p-4 min-h-[400px] space-y-4 border rounded border-gray-200">
            <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse mb-4"></div>
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
    );
}