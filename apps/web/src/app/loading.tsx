// Global page loading skeleton — shown on first navigation to any route
export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 z-[100] overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full"
          style={{
            animation: 'progress-bar 1.4s ease-in-out infinite',
            width: '40%',
          }}
        />
      </div>

      {/* Hero skeleton */}
      <div className="bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white/10" />
            <div className="h-12 bg-white/10 rounded-xl w-56" />
          </div>
          <div className="h-6 bg-white/10 rounded-lg w-96 mx-auto mb-4" />
          <div className="h-12 bg-white/10 rounded-2xl max-w-2xl mx-auto" />
        </div>
      </div>

      {/* Category grid skeleton */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto mb-3" />
        <div className="h-4 bg-gray-100 rounded w-40 mx-auto mb-10" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-gray-200" />
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-5 bg-gray-100 rounded-full w-20" />
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @keyframes progress-bar {
          0%   { transform: translateX(-100%); }
          50%  { transform: translateX(100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  )
}
