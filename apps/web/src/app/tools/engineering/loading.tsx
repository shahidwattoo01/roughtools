export default function EngineeringHubLoading() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Hero */}
      <div className="bg-gradient-to-r from-sky-600 to-indigo-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="h-8 bg-white/20 rounded-full w-40 mb-5" />
          <div className="h-10 bg-white/20 rounded-xl w-80 mb-4" />
          <div className="h-5 bg-white/15 rounded w-96 mb-6" />
          <div className="flex gap-2 flex-wrap">
            {[72, 88, 64, 96, 80].map(w => (
              <div key={w} className="h-6 bg-white/15 rounded-full" style={{ width: w }} />
            ))}
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="bg-white border-b border-gray-100 py-3">
        <div className="max-w-5xl mx-auto px-4 flex justify-center gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-3.5 bg-gray-200 rounded w-24" />
          ))}
        </div>
      </div>

      {/* Content groups */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {[18, 18, 10, 10].map((count, gi) => (
          <div key={gi}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 bg-sky-100 rounded-xl" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-40 mb-1.5" />
                <div className="h-3 bg-gray-100 rounded w-56" />
              </div>
              <div className="h-6 bg-sky-100 rounded-full w-16" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {Array.from({ length: Math.min(count, 6) }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-sky-50 rounded-xl flex-shrink-0" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-36 mb-1.5" />
                      <div className="h-3 bg-gray-100 rounded w-full mb-1" />
                      <div className="h-3 bg-gray-100 rounded w-3/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
