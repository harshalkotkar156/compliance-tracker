import axios from "axios"


const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
})

// Unwrap response data automatically
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message =
      err.response?.data?.message || err.message || "Something went wrong"
    return Promise.reject(new Error(message))
  }
)

// ─── Clients ───────────────────────────────────────────────
export const getClients  = ()       => api.get("/clients")
export const getClient   = (id)     => api.get(`/clients/${id}`)
export const createClient= (data)   => api.post("/clients", data)
export const deleteClient= (id)     => api.delete(`/clients/${id}`)


export const getTasks         = (clientId, params = {}) =>
  api.get(`/tasks/${clientId}`, { params })
export const createTask       = (data)       => api.post("/tasks", data)
export const updateTaskStatus = (id, status) =>
  api.patch(`/tasks/${id}/status`, { status })
export const deleteTask       = (id)         => api.delete(`/tasks/${id}`)