import Link from 'next/link'

interface CategoryCardProps {
  title: string
  description: string
  icon: string
  href: string
  toolCount: number
  color: string
  badge?: string
}

export default function CategoryCard({
  title, description, icon, href, toolCount, color, badge
}: CategoryCardProps) {
  return (
    <Link href={href}>
      <div className="group relative bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-brand-200 transition-all duration-200 cursor-pointer h-full">

        {badge && (
          <span className="absolute top-4 right-4 bg-brand-50 text-brand-700 text-xs font-medium px-2 py-1 rounded-full">
            {badge}
          </span>
        )}

        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-2xl mb-4`}>
          {icon}
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">
          {title}
        </h3>

        <p className="text-sm text-gray-500 mb-4 leading-relaxed">
          {description}
        </p>

        <span className="text-xs font-medium text-gray-400">
          {toolCount} tools
        </span>
      </div>
    </Link>
  )
}