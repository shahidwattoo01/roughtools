// Generic category-page skeleton — shown instantly while the page streams in
export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="h-7 bg-white/20 rounded-full w-40 mb-5" />
          <div className="h-10 bg-white/20 rounded-xl w-72 mb-4" />
          <div className="h-5 bg-white/15 rounded w-80 mb-6" />
          <div className="flex gap-2">
            {[72, 88, 64, 96].map(w => (
              <div key={w} className="h-6 bg-white/15 rounded-full" style={{ width: w }} />
            ))}
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="bg-white border-b border-gray-100 py-3">
        <div className="max-w-5xl mx-auto px-4 flex justify-center gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-3.5 bg-gray-200 rounded w-24" />)}
        </div>
      </div>

      {/* Tool grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="h-5 bg-gray-200 rounded w-40 mb-4" />
        <div className="grid sm:grid-cols-2 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-36 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-full mb-1" />
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
