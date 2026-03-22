import { useState } from "react"
import { X, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { createClient } from "../services/api"

const ENTITY_TYPES = ["Private Limited", "Public Limited", "LLP", "Partnership", "Sole Proprietorship", "Trust", "NGO", "Other"]
const inputCls = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
const labelCls = "block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide"

export default function AddClientModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    company_name: "", country: "India",
    entity_type: "Private Limited", contact_email: "",
  })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors((er) => ({ ...er, [field]: "" }))
  }

  const validate = () => {
    const e = {}
    if (!form.company_name.trim()) e.company_name = "Company name is required"
    if (!form.country.trim())      e.country      = "Country is required"
    if (form.contact_email && !/^\S+@\S+\.\S+$/.test(form.contact_email))
      e.contact_email = "Enter a valid email"
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await createClient(form)
      toast.success("Client added!")
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Add New Client</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          <div>
            <label className={labelCls}>Company Name <span className="text-red-500 font-normal normal-case">*</span></label>
            <input
              type="text" value={form.company_name} onChange={set("company_name")}
              placeholder="e.g. Rajesh Exports Pvt Ltd" autoFocus
              className={`${inputCls} ${errors.company_name ? "border-red-300" : ""}`}
            />
            {errors.company_name && <p className="text-xs text-red-500 mt-1">{errors.company_name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Country <span className="text-red-500 font-normal normal-case">*</span></label>
              <input
                type="text" value={form.country} onChange={set("country")} placeholder="India"
                className={`${inputCls} ${errors.country ? "border-red-300" : ""}`}
              />
              {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country}</p>}
            </div>
            <div>
              <label className={labelCls}>Entity Type</label>
              <select value={form.entity_type} onChange={set("entity_type")} className={inputCls}>
                {ENTITY_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Contact Email</label>
            <input
              type="email" value={form.contact_email} onChange={set("contact_email")}
              placeholder="finance@company.com"
              className={`${inputCls} ${errors.contact_email ? "border-red-300" : ""}`}
            />
            {errors.contact_email && <p className="text-xs text-red-500 mt-1">{errors.contact_email}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 cursor-pointer">
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? "Adding..." : "Add Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}