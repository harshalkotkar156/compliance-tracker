import { Search, SlidersHorizontal, X, AlertTriangle } from "lucide-react"

const STATUSES   = ["All", "Pending", "In Progress", "Completed", "Cancelled"]
const CATEGORIES = ["All", "Tax Filing", "GST", "ROC Filing", "Audit", "Payroll", "TDS", "Annual Return", "Other"]
const SORT_OPTIONS = [
  { value: "due_date",      label: "Due Date ↑" },
  { value: "due_date_desc", label: "Due Date ↓" },
  { value: "priority",      label: "Priority" },
  { value: "created",       label: "Recently Added" },
  { value: "title",         label: "Title A–Z" },
]

export default function FilterBar({
  search, setSearch,
  status, setStatus,
  category, setCategory,
  sortBy, setSortBy,
  showOverdueOnly, setShowOverdueOnly,
  overdueCount = 0,
}) {
  const hasActiveFilter = search || status !== "All" || category !== "All" || showOverdueOnly

  const clearAll = () => {
    setSearch(""); setStatus("All")
    setCategory("All"); setSortBy("due_date"); setShowOverdueOnly(false)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">

      {/* Overdue banner */}
      {overdueCount > 0 && (
        <button
          onClick={() => setShowOverdueOnly(!showOverdueOnly)}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all cursor-pointer ${
            showOverdueOnly
              ? "bg-red-600 text-white border-red-600"
              : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
          }`}
        >
          <AlertTriangle size={15} className="shrink-0" />
          <span className="flex-1 text-left">
            {overdueCount} overdue task{overdueCount > 1 ? "s" : ""}
          </span>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
            showOverdueOnly ? "bg-white/20 text-white" : "bg-red-100 text-red-700"
          }`}>
            {showOverdueOnly ? "Showing only" : "Click to filter"}
          </span>
        </button>
      )}

      {/* Filter row */}
      <div className="flex flex-wrap gap-2">

        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Status */}
        <div className="relative">
          <SlidersHorizontal size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none min-w-36"
          >
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none min-w-36"
        >
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none min-w-40"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Clear */}
        {hasActiveFilter && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>
    </div>
  )
}