import type { Metadata } from 'next'
import { AdminSidebar } from './_components/AdminSidebar'

export const metadata: Metadata = {
  title: 'Admin — RoughTools',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0f0f0f] text-white">
      <AdminSidebar />
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  )
}
