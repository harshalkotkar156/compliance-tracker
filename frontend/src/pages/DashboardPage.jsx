import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  AlertTriangle, Building2, CheckCircle2,
  TrendingUp, Users, ArrowRight
} from "lucide-react"
import { getClients } from "../services/api.js";
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

  // Aggregate global stats across all clients
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
  const healthyClients = clients.filter((c) => c.stats?.overdue === 0)

  return (
    <div className="space-y-8 animate-fade-in">
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
          {[
            {
              label: "Total Clients",
              value: clients.length,
              icon: Users,
              bg: "bg-brand-50",
              text: "text-brand-700",
              iconColor: "text-brand-400",
              border: "border-brand-100",
            },
            {
              label: "Total Tasks",
              value: globalStats.total,
              icon: TrendingUp,
              bg: "bg-gray-50",
              text: "text-gray-700",
              iconColor: "text-gray-400",
              border: "border-gray-100",
            },
            {
              label: "Completed",
              value: globalStats.completed,
              icon: CheckCircle2,
              bg: "bg-green-50",
              text: "text-green-700",
              iconColor: "text-green-400",
              border: "border-green-100",
            },
            {
              label: "Overdue",
              value: globalStats.overdue,
              icon: AlertTriangle,
              bg: globalStats.overdue > 0 ? "bg-red-50" : "bg-gray-50",
              text: globalStats.overdue > 0 ? "text-red-700" : "text-gray-400",
              iconColor: globalStats.overdue > 0 ? "text-red-500" : "text-gray-300",
              border: globalStats.overdue > 0 ? "border-red-200" : "border-gray-100",
            },
          ].map(({ label, value, icon: Icon, bg, text, iconColor, border }) => (
            <div
              key={label}
              className={`rounded-xl border px-5 py-4 flex items-center gap-4
                          ${bg} ${border}`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center
                               justify-center bg-white/70`}>
                <Icon size={20} className={iconColor} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${text}`}>{value}</p>
                <p className={`text-xs ${text} opacity-70`}>{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Overdue clients section */}
      {!loading && overdueClients.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-red-500" />
            <h2 className="font-bold text-gray-900 text-sm">
              Needs Attention
              <span className="ml-2 badge bg-red-100 text-red-700">
                {overdueClients.length} client{overdueClients.length > 1 ? "s" : ""}
              </span>
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {overdueClients.map((client) => (
              <button
                key={client._id}
                onClick={() => navigate(`/clients/${client._id}`)}
                className="card border-red-200 bg-red-50/30 hover:border-red-300
                           hover:bg-red-50/60 p-4 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center
                                    justify-center">
                      <Building2 size={14} className="text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {client.company_name}
                      </p>
                      <p className="text-xs text-red-600 font-medium">
                        {client.stats.overdue} overdue task
                        {client.stats.overdue > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-red-300 group-hover:text-red-500
                               group-hover:translate-x-0.5 transition-all"
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
              <span className="badge bg-gray-100 text-gray-500">
                {clients.length}
              </span>
            )}
          </h2>
          <button
            onClick={() => navigate("/clients")}
            className="btn-ghost text-xs px-3 py-1.5"
          >
            View all
            <ArrowRight size={13} />
          </button>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : clients.length === 0 ? (
          <div className="card flex flex-col items-center justify-center
                          py-16 text-center gap-3">
            <Building2 size={36} className="text-gray-300" />
            <p className="text-sm font-medium text-gray-500">No clients yet</p>
            <p className="text-xs text-gray-400">
              Go to Clients page to add your first client
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clients.slice(0, 6).map((client) => (
              <button
                key={client._id}
                onClick={() => navigate(`/clients/${client._id}`)}
                className="card-hover p-5 text-left group"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">
                      {client.company_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {client.entity_type} · {client.country}
                    </p>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-gray-300 group-hover:text-brand-500
                               group-hover:translate-x-0.5 transition-all shrink-0"
                  />
                </div>
                <div className="flex gap-4">
                  <div>
                    <p className="text-lg font-bold text-gray-800">
                      {client.stats?.total || 0}
                    </p>
                    <p className="text-xs text-gray-400">Tasks</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-amber-600">
                      {client.stats?.pending || 0}
                    </p>
                    <p className="text-xs text-gray-400">Pending</p>
                  </div>
                  {(client.stats?.overdue || 0) > 0 && (
                    <div>
                      <p className="text-lg font-bold text-red-600">
                        {client.stats.overdue}
                      </p>
                      <p className="text-xs text-gray-400">Overdue</p>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}