export function DegreeCardSkeleton() {
  return (
    <div className="bg-white text-black p-4 rounded min-h-[250px] md:min-h-[300px] flex flex-col justify-between">
      <div id="header" className="animate-pulse">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
        {/* Code skeleton */}
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        {/* Completion time skeleton */}
        <div className="h-6 bg-gray-200 rounded w-2/3"></div>
      </div>
      
      <div id="footer" className="animate-pulse space-y-4">
        {/* Tuition skeleton */}
        <div className="py-5">
          <div className="h-5 bg-gray-300 rounded w-1/2"></div>
        </div>
        
        {/* Location skeleton */}
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-300 rounded mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        
        {/* Modalities skeleton */}
        <div className="flex space-x-2">
          <div className="h-6 bg-gray-200 rounded px-3 py-1 w-16"></div>
          <div className="h-6 bg-gray-200 rounded px-3 py-1 w-20"></div>
        </div>
      </div>
    </div>
  );
}
