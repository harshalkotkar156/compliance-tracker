import { useState } from "react"
import { Calendar, Tag, AlertTriangle, ChevronDown, Trash2, Loader2 } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import toast from "react-hot-toast"
import { updateTaskStatus, deleteTask } from "../services/api"

const STATUS_STYLES = {
  "Pending":     { select: "bg-amber-50 text-amber-700 border-amber-200",  dot: "bg-amber-400" },
  "In Progress": { select: "bg-blue-50 text-blue-700 border-blue-200",     dot: "bg-blue-500"  },
  "Completed":   { select: "bg-green-50 text-green-700 border-green-200",  dot: "bg-green-500" },
  "Cancelled":   { select: "bg-gray-100 text-gray-500 border-gray-200",    dot: "bg-gray-400"  },
}

const PRIORITY_STYLES = {
  "Low":      "bg-gray-100 text-gray-500",
  "Medium":   "bg-blue-50 text-blue-600",
  "High":     "bg-orange-50 text-orange-600",
  "Critical": "bg-red-100 text-red-700",
}

const STATUSES = ["Pending", "In Progress", "Completed", "Cancelled"]

export default function TaskCard({ task, onUpdated }) {
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const isOverdue   = task.is_overdue
  const isCompleted = task.status === "Completed" || task.status === "Cancelled"
  const dueDate     = new Date(task.due_date)

  const handleStatusChange = async (newStatus) => {
    if (newStatus === task.status) return
    setUpdating(true)
    try {
      await updateTaskStatus(task._id, newStatus)
      toast.success(`Marked as "${newStatus}"`)
      onUpdated()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Delete this task? This cannot be undone.")) return
    setDeleting(true)
    try {
      await deleteTask(task._id)
      toast.success("Task deleted")
      onUpdated()
    } catch (err) {
      toast.error(err.message)
      setDeleting(false)
    }
  }

  return (
    <div className={`bg-white rounded-xl border shadow-sm px-5 py-4 transition-all duration-200 ${
      isOverdue
        ? "border-red-300 bg-red-50/40 hover:border-red-400"
        : "border-gray-100 hover:border-indigo-200 hover:shadow-md"
    } ${isCompleted ? "opacity-60" : ""}`}>

      <div className="flex items-start gap-3">

        {/* Indicator dot / overdue icon */}
        <div className="mt-1.5 shrink-0">
          {isOverdue
            ? <AlertTriangle size={14} className="text-red-500" />
            : <div className={`w-2 h-2 rounded-full ${STATUS_STYLES[task.status]?.dot ?? "bg-gray-400"}`} />
          }
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">

          {/* Title */}
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`text-sm font-semibold leading-snug ${
              isCompleted ? "line-through text-gray-400" : "text-gray-900"
            }`}>
              {task.title}
            </h3>
            {isOverdue && (
              <span className="text-xs font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                OVERDUE
              </span>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Meta chips row */}
          <div className="flex flex-wrap items-center gap-2 mt-2.5">

            {/* Status dropdown */}
            <div className="relative inline-flex items-center">
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updating}
                className={`text-xs font-medium pl-2.5 pr-7 py-1 rounded-full border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 ${
                  STATUS_STYLES[task.status]?.select ?? "bg-gray-100 text-gray-600 border-gray-200"
                }`}
              >
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                {updating
                  ? <Loader2 size={10} className="animate-spin text-gray-500" />
                  : <ChevronDown size={10} className="text-gray-500" />
                }
              </div>
            </div>

            {/* Priority */}
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
              PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES["Medium"]
            }`}>
              {task.priority}
            </span>

            {/* Category */}
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Tag size={10} />
              {task.category}
            </span>

            {/* Due date */}
            <span className={`flex items-center gap-1 text-xs ${
              isOverdue ? "text-red-600 font-semibold" : "text-gray-400"
            }`}>
              {isOverdue ? <AlertTriangle size={10} /> : <Calendar size={10} />}
              {isOverdue
                ? `${formatDistanceToNow(dueDate)} overdue`
                : format(dueDate, "dd MMM yyyy")
              }
            </span>
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          disabled={deleting}
          title="Delete task"
          className="shrink-0 p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-50 cursor-pointer"
        >
          {deleting
            ? <Loader2 size={14} className="animate-spin" />
            : <Trash2 size={14} />
          }
        </button>
      </div>
    </div>
  )
}