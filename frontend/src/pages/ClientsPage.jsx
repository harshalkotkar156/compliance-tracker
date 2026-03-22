import { useState, useEffect, useCallback } from "react"
import { Plus, Search, Users } from "lucide-react"
import toast from "react-hot-toast"
import { getClients } from "../services/api.js"
import ClientCard from "../components/ClientCard.jsx"
import AddClientModal from "../components/AddClientModal.jsx"
import { SkeletonCard } from "../components/Skeleton.jsx";
export default function ClientsPage() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)

  const fetchClients = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getClients()
      setClients(res.data)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchClients() }, [fetchClients])

  const filtered = clients.filter((c) =>
    c.company_name.toLowerCase().includes(search.toLowerCase()) ||
    c.country.toLowerCase().includes(search.toLowerCase()) ||
    c.entity_type.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? "Loading..." : `${clients.length} client${clients.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} />
          Add Client
        </button>
      </div>

      {/* Search bar */}
      <div className="relative max-w-sm">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search by name, country, entity..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center justify-center
                        py-20 text-center gap-3">
          <Users size={40} className="text-gray-300" />
          <p className="text-sm font-semibold text-gray-500">
            {search ? "No clients match your search" : "No clients yet"}
          </p>
          {!search && (
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary mt-2"
            >
              <Plus size={15} />
              Add your first client
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((client) => (
            <ClientCard key={client._id} client={client} />
          ))}
        </div>
      )}

      {showModal && (
        <AddClientModal
          onClose={() => setShowModal(false)}
          onCreated={fetchClients}
        />
      )}
    </div>
  )
}