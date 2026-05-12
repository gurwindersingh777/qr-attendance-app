import { cn } from "@/lib/utils"

interface Props {
  label: string
  value: string | number
  valueClassName?: string
  sub?: string
}

export default function StatCard({ label, value, valueClassName, sub }: Props) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border-2">
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <p className={cn('text-2xl font-semibold text-slate-900', valueClassName)}>
        {value}
      </p>
      {sub && (
        <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
      )}
    </div>
  )
}
