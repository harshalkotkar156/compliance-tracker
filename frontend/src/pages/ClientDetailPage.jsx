import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft, Plus, Building2, Loader2,
  CheckCircle2, ListTodo
} from "lucide-react"
import toast from "react-hot-toast"
import { getClient, getTasks } from "../services/api.js"
import StatsBar from "../components/StatsBar.jsx"
import FilterBar from "../components/FilterBar.jsx"
import TaskCard from "../components/TaskCard.jsx"
import AddTaskModal from "../components/AddTaskModal.jsx"
import { SkeletonTaskCard } from "../components/Skeleton.jsx"

export default function ClientDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [client,  setClient]  = useState(null)
  const [tasks,   setTasks]   = useState([])
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  // Filter state
  const [search,         setSearch]         = useState("")
  const [status,         setStatus]         = useState("All")
  const [category,       setCategory]       = useState("All")
  const [sortBy,         setSortBy]         = useState("due_date")
  const [showOverdueOnly,setShowOverdueOnly] = useState(false)

  // Fetch client info once
  useEffect(() => {
    getClient(id)
      .then((res) => setClient(res.data))
      .catch(() => { toast.error("Client not found"); navigate("/clients") })
  }, [id])

  // Fetch tasks whenever filters change
  const fetchTasks = useCallback(async () => {
    setLoading(true)
    try {
      const params = { sort: sortBy }
      if (status   !== "All") params.status   = status
      if (category !== "All") params.category = category
      if (search.trim())      params.search   = search.trim()
      if (showOverdueOnly)    params.overdue  = true

      const res = await getTasks(id, params)
      setTasks(res.data)
      setStats(res.stats)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }, [id, status, category, sortBy, search, showOverdueOnly])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  // Reset filters when switching clients
  useEffect(() => {
    setSearch(""); setStatus("All"); setCategory("All")
    setSortBy("due_date"); setShowOverdueOnly(false)
  }, [id])

  if (!client) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin text-brand-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb + header */}
      <div>
        <button
          onClick={() => navigate("/clients")}
          className="btn-ghost text-xs px-2 py-1 mb-3 -ml-1"
        >
          <ArrowLeft size={14} />
          Back to Clients
        </button>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center
                            justify-center shrink-0">
              <Building2 size={22} className="text-brand-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {client.company_name}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {client.entity_type} · {client.country}
                {client.contact_email && (
                  <> · <span className="text-brand-600">{client.contact_email}</span></>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="btn-primary shrink-0"
          >
            <Plus size={16} />
            Add Task
          </button>
        </div>
      </div>

      {/* Stats bar */}
      {stats && <StatsBar stats={stats} />}

      {/* Filter bar */}
      <FilterBar
        search={search}           setSearch={setSearch}
        status={status}           setStatus={setStatus}
        category={category}       setCategory={setCategory}
        sortBy={sortBy}           setSortBy={setSortBy}
        showOverdueOnly={showOverdueOnly}
        setShowOverdueOnly={setShowOverdueOnly}
        overdueCount={stats?.overdue || 0}
      />

      {/* Task list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <SkeletonTaskCard key={i} />)}
        </div>
      ) : tasks.length === 0 ? (
        <div className="card flex flex-col items-center justify-center
                        py-16 text-center gap-3">
          {search || status !== "All" || category !== "All" ? (
            <>
              <ListTodo size={36} className="text-gray-300" />
              <p className="text-sm font-medium text-gray-500">
                No tasks match your filters
              </p>
              <p className="text-xs text-gray-400">Try clearing the filters</p>
            </>
          ) : (
            <>
              <CheckCircle2 size={36} className="text-gray-300" />
              <p className="text-sm font-medium text-gray-500">
                No tasks yet for this client
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="btn-primary mt-2"
              >
                <Plus size={15} />
                Add first task
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-gray-400 font-medium px-1">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""}
          </p>
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onUpdated={fetchTasks}
            />
          ))}
        </div>
      )}

      {showModal && (
        <AddTaskModal
          clientId={client._id}
          clientName={client.company_name}
          onClose={() => setShowModal(false)}
          onCreated={fetchTasks}
        />
      )}
    </div>
  )
}