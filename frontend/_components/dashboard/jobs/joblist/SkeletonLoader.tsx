const SkeletonLoader = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(9)].map((_, i) => (
      <div
        key={i}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-3 flex-1">
            <div className="h-5 bg-gray-200 rounded-lg w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded-full w-20 ml-4"></div>
        </div>
        <div className="space-y-3 mb-4">
          <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-4/5"></div>
        </div>
        <div className="flex gap-4 mb-4">
          <div className="h-4 bg-gray-200 rounded-lg w-20"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-16"></div>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex gap-2">
            <div className="h-10 bg-gray-200 rounded-full w-10"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-20"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-xl w-24"></div>
        </div>
      </div>
    ))}
  </div>
);

export default SkeletonLoader;