import { useNavigate } from "react-router-dom"
import { AlertTriangle, Building2, ArrowRight } from "lucide-react"

const ENTITY_COLORS = {
  "Private Limited":     "bg-blue-50 text-blue-700",
  "Public Limited":      "bg-indigo-50 text-indigo-700",
  "LLP":                 "bg-purple-50 text-purple-700",
  "Partnership":         "bg-amber-50 text-amber-700",
  "Sole Proprietorship": "bg-orange-50 text-orange-700",
  "Trust":               "bg-teal-50 text-teal-700",
  "NGO":                 "bg-green-50 text-green-700",
  "Other":               "bg-gray-100 text-gray-600",
}

export default function ClientCard({ client }) {
  const navigate   = useNavigate()
  const hasOverdue = client.stats?.overdue > 0

  return (
    <div
      onClick={() => navigate(`/clients/${client._id}`)}
      className={`bg-white rounded-xl border shadow-sm p-5 flex flex-col gap-4 cursor-pointer group transition-all duration-200 ${
        hasOverdue
          ? "border-red-200 hover:border-red-400 hover:shadow-md"
          : "border-gray-100 hover:border-indigo-200 hover:shadow-md"
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            hasOverdue ? "bg-red-100" : "bg-indigo-50"
          }`}>
            {hasOverdue
              ? <AlertTriangle size={18} className="text-red-500" />
              : <Building2 size={18} className="text-indigo-500" />
            }
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm leading-tight">
              {client.company_name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">{client.country}</p>
          </div>
        </div>
        <ArrowRight size={16} className="text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
      </div>

      {/* Entity badge */}
      <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full ${
        ENTITY_COLORS[client.entity_type] ?? ENTITY_COLORS["Other"]
      }`}>
        {client.entity_type}
      </span>

      {/* Stats */}
      {client.stats && (
        <div className="flex items-center gap-0 pt-3 border-t border-gray-100 divide-x divide-gray-100">
          {[
            { value: client.stats.total,     label: "Tasks",   color: "text-gray-800" },
            { value: client.stats.pending,   label: "Pending", color: "text-amber-600" },
            { value: client.stats.overdue,   label: "Overdue", color: hasOverdue ? "text-red-600" : "text-gray-300" },
            { value: client.stats.completed, label: "Done",    color: "text-green-600" },
          ].map(({ value, label, color }) => (
            <div key={label} className="flex-1 text-center px-2">
              <p className={`text-lg font-bold ${color}`}>{value}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}