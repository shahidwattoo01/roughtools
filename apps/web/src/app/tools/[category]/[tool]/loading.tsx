// Generic tool-page skeleton — shown instantly during navigation
export default function ToolPageLoading() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2">
          <div className="h-3 w-10 bg-gray-200 rounded" />
          <div className="h-3 w-2 bg-gray-200 rounded" />
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-3 w-2 bg-gray-200 rounded" />
          <div className="h-3 w-32 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex-shrink-0" />
            <div className="flex-1">
              <div className="h-7 bg-white/20 rounded-lg w-64 mb-2" />
              <div className="h-4 bg-white/15 rounded w-80" />
            </div>
          </div>
          <div className="flex gap-2 mt-5 flex-wrap">
            {[80, 96, 72, 64, 88].map(w => (
              <div key={w} className="h-6 bg-white/15 rounded-full" style={{ width: w }} />
            ))}
          </div>
        </div>
      </div>

      {/* Tool UI area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-1.5">
                <div className="h-3.5 bg-gray-200 rounded w-28" />
                <div className="h-11 bg-gray-100 rounded-xl" />
              </div>
            ))}
            <div className="h-12 bg-indigo-100 rounded-xl" />
          </div>
        </div>
        {/* Related tools */}
        <div className="h-5 bg-gray-200 rounded w-36 mb-4" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 rounded-lg flex-shrink-0" />
              <div className="flex-1">
                <div className="h-3.5 bg-gray-200 rounded w-28 mb-1.5" />
                <div className="h-3 bg-gray-100 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
