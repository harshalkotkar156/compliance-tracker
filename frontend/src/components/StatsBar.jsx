import { CheckCircle2, Clock, AlertTriangle, ListTodo, Timer } from "lucide-react"

const statConfig = [
  {
    key: "total",
    label: "Total Tasks",
    icon: ListTodo,
    bg: "bg-gray-50",
    border: "border-gray-200",
    valueColor: "text-gray-800",
    labelColor: "text-gray-500",
    iconColor: "text-gray-400",
  },
  {
    key: "pending",
    label: "Pending",
    icon: Clock,
    bg: "bg-amber-50",
    border: "border-amber-200",
    valueColor: "text-amber-700",
    labelColor: "text-amber-600",
    iconColor: "text-amber-400",
  },
  {
    key: "in_progress",
    label: "In Progress",
    icon: Timer,
    bg: "bg-blue-50",
    border: "border-blue-200",
    valueColor: "text-blue-700",
    labelColor: "text-blue-600",
    iconColor: "text-blue-400",
  },
  {
    key: "completed",
    label: "Completed",
    icon: CheckCircle2,
    bg: "bg-green-50",
    border: "border-green-200",
    valueColor: "text-green-700",
    labelColor: "text-green-600",
    iconColor: "text-green-400",
  },
  {
    key: "overdue",
    label: "Overdue",
    icon: AlertTriangle,
    bg: "bg-red-50",
    border: "border-red-200",
    valueColor: "text-red-700",
    labelColor: "text-red-600",
    iconColor: "text-red-400",
  },
]

export default function StatsBar({ stats }) {
  if (!stats) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {statConfig.map(({ key, label, icon: Icon, bg, border, valueColor, labelColor, iconColor }) => (
        <div
          key={key}
          className={`rounded-xl border px-4 py-3 flex items-center gap-3 ${bg} ${border}`}
        >
          <div className="w-8 h-8 rounded-lg bg-white/70 flex items-center justify-center shrink-0">
            <Icon size={16} className={iconColor} />
          </div>
          <div>
            <p className={`text-xl font-bold leading-none ${valueColor}`}>
              {stats[key] ?? 0}
            </p>
            <p className={`text-xs mt-1 ${labelColor}`}>{label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}