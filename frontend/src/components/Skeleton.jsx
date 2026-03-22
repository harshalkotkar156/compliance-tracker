export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 animate-pulse space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-200" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
      <div className="h-6 w-24 bg-gray-100 rounded-full" />
      <div className="border-t border-gray-100 pt-3 flex gap-4">
        <div className="space-y-1">
          <div className="h-5 w-8 bg-gray-200 rounded" />
          <div className="h-3 w-10 bg-gray-100 rounded" />
        </div>
        <div className="space-y-1">
          <div className="h-5 w-8 bg-gray-200 rounded" />
          <div className="h-3 w-10 bg-gray-100 rounded" />
        </div>
        <div className="space-y-1">
          <div className="h-5 w-8 bg-gray-200 rounded" />
          <div className="h-3 w-10 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonTaskCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-2 h-2 rounded-full bg-gray-200 mt-1.5 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-3 bg-gray-100 rounded w-full" />
          <div className="flex gap-2 mt-1">
            <div className="h-5 w-20 bg-gray-100 rounded-full" />
            <div className="h-5 w-16 bg-gray-100 rounded-full" />
            <div className="h-5 w-24 bg-gray-100 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-200" />
            <div className="space-y-1.5">
              <div className="h-6 w-10 bg-gray-200 rounded" />
              <div className="h-3 w-16 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}