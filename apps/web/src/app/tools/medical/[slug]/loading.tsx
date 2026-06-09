export default function MedicalToolLoading() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2">
          <div className="h-3 w-10 bg-gray-200 rounded" />
          <div className="h-3 w-2 bg-gray-200 rounded" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
          <div className="h-3 w-2 bg-gray-200 rounded" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-3 w-2 bg-gray-200 rounded" />
          <div className="h-3 w-36 bg-gray-200 rounded" />
        </div>
      </div>
      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700">
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
      {/* Calculator */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-emerald-500 to-teal-600" />
            <div className="p-6 space-y-4">
              <div className="h-10 bg-gray-100 rounded-xl" />
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-1.5">
                  <div className="h-3.5 bg-gray-200 rounded w-28" />
                  <div className="h-10 bg-gray-100 rounded-xl" />
                </div>
              ))}
              <div className="h-12 bg-emerald-100 rounded-xl" />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="h-5 bg-gray-200 rounded w-20 mb-1.5" />
              <div className="h-3 bg-gray-100 rounded w-40" />
            </div>
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-3" />
                <div className="h-4 bg-gray-200 rounded w-36 mx-auto mb-2" />
                <div className="h-3 bg-gray-100 rounded w-48 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
