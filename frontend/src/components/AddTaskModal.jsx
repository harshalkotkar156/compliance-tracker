import { useState } from "react"
import { X, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { createTask } from "../services/api"

const CATEGORIES = ["Tax Filing", "GST", "ROC Filing", "Audit", "Payroll", "TDS", "Annual Return", "Other"]
const PRIORITIES  = ["Low", "Medium", "High", "Critical"]

const inputCls = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
const labelCls = "block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide"
const errorCls = "text-xs text-red-500 mt-1"

export default function AddTaskModal({ clientId, clientName, onClose, onCreated }) {
  const [form, setForm] = useState({
    title: "", description: "",
    category: "Tax Filing", due_date: "", priority: "Medium",
  })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors((er) => ({ ...er, [field]: "" }))
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title    = "Title is required"
    if (!form.due_date)     e.due_date = "Due date is required"
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await createTask({ ...form, client_id: clientId })
      toast.success("Task created!")
      onCreated(); onClose()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">Add Compliance Task</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              For: <span className="font-semibold text-gray-700">{clientName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* Title */}
          <div>
            <label className={labelCls}>Title <span className="text-red-500 normal-case font-normal">*</span></label>
            <input
              type="text" value={form.title} onChange={set("title")}
              placeholder="e.g. Q4 Income Tax Filing" autoFocus
              className={`${inputCls} ${errors.title ? "border-red-300 focus:ring-red-400" : ""}`}
            />
            {errors.title && <p className={errorCls}>{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              value={form.description} onChange={set("description")}
              placeholder="Optional details..." rows={2}
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Category + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Category <span className="text-red-500 normal-case font-normal">*</span></label>
              <select value={form.category} onChange={set("category")} className={inputCls}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Priority</label>
              <select value={form.priority} onChange={set("priority")} className={inputCls}>
                {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Due date */}
          <div>
            <label className={labelCls}>Due Date <span className="text-red-500 normal-case font-normal">*</span></label>
            <input
              type="date" value={form.due_date} onChange={set("due_date")}
              className={`${inputCls} ${errors.due_date ? "border-red-300 focus:ring-red-400" : ""}`}
            />
            {errors.due_date && <p className={errorCls}>{errors.due_date}</p>}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button" onClick={onClose}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}