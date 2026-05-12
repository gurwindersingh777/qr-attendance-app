import { type LucideIcon } from 'lucide-react'

interface Props {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-slate-400" />
      </div>
      <h3 className="font-medium text-slate-900 text-sm mb-1">{title}</h3>
      <p className="text-slate-500 text-sm max-w-xs">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}