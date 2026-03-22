import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  AlertTriangle, Building2, CheckCircle2,
  TrendingUp, Users, ArrowRight
} from "lucide-react"
import { getClients } from "../services/api.js"
import { SkeletonStats, SkeletonCard } from "../components/Skeleton.jsx"
import toast from "react-hot-toast"

export default function DashboardPage() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getClients()
      .then((res) => setClients(res.data))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }, [])

  const globalStats = clients.reduce(
    (acc, c) => ({
      total:     acc.total     + (c.stats?.total     || 0),
      pending:   acc.pending   + (c.stats?.pending   || 0),
      completed: acc.completed + (c.stats?.completed || 0),
      overdue:   acc.overdue   + (c.stats?.overdue   || 0),
    }),
    { total: 0, pending: 0, completed: 0, overdue: 0 }
  )

  const overdueClients = clients.filter((c) => c.stats?.overdue > 0)

  const statCards = [
    {
      label: "Total Clients",
      value: clients.length,
      icon: Users,
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      text: "text-indigo-700",
      iconColor: "text-indigo-400",
      iconBg: "bg-indigo-100",
    },
    {
      label: "Total Tasks",
      value: globalStats.total,
      icon: TrendingUp,
      bg: "bg-gray-50",
      border: "border-gray-200",
      text: "text-gray-700",
      iconColor: "text-gray-400",
      iconBg: "bg-gray-100",
    },
    {
      label: "Completed",
      value: globalStats.completed,
      icon: CheckCircle2,
      bg: "bg-green-50",
      border: "border-green-100",
      text: "text-green-700",
      iconColor: "text-green-500",
      iconBg: "bg-green-100",
    },
    {
      label: "Overdue",
      value: globalStats.overdue,
      icon: AlertTriangle,
      bg: globalStats.overdue > 0 ? "bg-red-50"   : "bg-gray-50",
      border: globalStats.overdue > 0 ? "border-red-200" : "border-gray-200",
      text: globalStats.overdue > 0 ? "text-red-700"  : "text-gray-400",
      iconColor: globalStats.overdue > 0 ? "text-red-500"  : "text-gray-300",
      iconBg: globalStats.overdue > 0 ? "bg-red-100"  : "bg-gray-100",
    },
  ]

  return (
    <div className="space-y-8">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of all clients and compliance tasks
        </p>
      </div>

      {/* Global stats */}
      {loading ? (
        <SkeletonStats />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statCards.map(({ label, value, icon: Icon, bg, border, text, iconColor, iconBg }) => (
            <div
              key={label}
              className={`rounded-xl border px-5 py-4 flex items-center gap-4 ${bg} ${border}`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
                <Icon size={20} className={iconColor} />
              </div>
              <div>
                <p className={`text-2xl font-bold leading-none ${text}`}>{value}</p>
                <p className={`text-xs mt-1 ${text} opacity-80`}>{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Needs attention — overdue clients */}
      {!loading && overdueClients.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-red-500" />
            <h2 className="font-bold text-gray-900 text-sm">
              Needs Attention
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700">
              {overdueClients.length} client{overdueClients.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {overdueClients.map((client) => (
              <button
                key={client._id}
                onClick={() => navigate(`/clients/${client._id}`)}
                className="w-full bg-red-50 border border-red-200 rounded-xl p-4
                           text-left hover:bg-red-100 hover:border-red-300
                           transition-all duration-150 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-100 border border-red-200
                                    flex items-center justify-center shrink-0">
                      <Building2 size={14} className="text-red-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900 leading-tight">
                        {client.company_name}
                      </p>
                      <p className="text-xs text-red-600 font-medium mt-0.5">
                        {client.stats.overdue} overdue task
                        {client.stats.overdue > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-red-300 group-hover:text-red-500
                               group-hover:translate-x-0.5 transition-all shrink-0"
                  />
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* All clients grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Building2 size={16} className="text-gray-400" />
            All Clients
            {!loading && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full
                               bg-gray-100 text-gray-500">
                {clients.length}
              </span>
            )}
          </h2>
          <button
            onClick={() => navigate("/clients")}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500
                       hover:text-indigo-600 hover:bg-indigo-50 px-3 py-1.5
                       rounded-lg transition-colors cursor-pointer"
          >
            View all
            <ArrowRight size={13} />
          </button>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>

        ) : clients.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm
                          flex flex-col items-center justify-center py-16 text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Building2 size={24} className="text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-600">No clients yet</p>
            <p className="text-xs text-gray-400">
              Go to Clients page to add your first client
            </p>
          </div>

        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clients.slice(0, 6).map((client) => {
              const hasOverdue = (client.stats?.overdue || 0) > 0
              return (
                <button
                  key={client._id}
                  onClick={() => navigate(`/clients/${client._id}`)}
                  className={`w-full bg-white rounded-xl border shadow-sm p-5 text-left
                              cursor-pointer group transition-all duration-200
                              ${hasOverdue
                                ? "border-red-200 hover:border-red-300 hover:shadow-md"
                                : "border-gray-100 hover:border-indigo-200 hover:shadow-md"
                              }`}
                >
                  {/* Card top row */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        hasOverdue ? "bg-red-100" : "bg-indigo-50"
                      }`}>
                        {hasOverdue
                          ? <AlertTriangle size={16} className="text-red-500" />
                          : <Building2 size={16} className="text-indigo-500" />
                        }
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 text-sm leading-tight truncate">
                          {client.company_name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {client.entity_type} · {client.country}
                        </p>
                      </div>
                    </div>
                    <ArrowRight
                      size={14}
                      className={`shrink-0 mt-0.5 transition-all group-hover:translate-x-0.5 ${
                        hasOverdue
                          ? "text-red-300 group-hover:text-red-500"
                          : "text-gray-300 group-hover:text-indigo-500"
                      }`}
                    />
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-0 divide-x divide-gray-100">
                      {[
                        { value: client.stats?.total     || 0, label: "Tasks",   color: "text-gray-800" },
                        { value: client.stats?.pending   || 0, label: "Pending", color: "text-amber-600" },
                        { value: client.stats?.completed || 0, label: "Done",    color: "text-green-600" },
                        ...(hasOverdue
                          ? [{ value: client.stats.overdue, label: "Overdue", color: "text-red-600" }]
                          : []
                        ),
                      ].map(({ value, label, color }) => (
                        <div key={label} className="flex-1 text-center px-2 first:pl-0 last:pr-0">
                          <p className={`text-lg font-bold leading-none ${color}`}>{value}</p>
                          <p className="text-xs text-gray-400 mt-1">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}