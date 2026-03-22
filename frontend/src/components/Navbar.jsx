import { Link, useLocation } from "react-router-dom"
import { ShieldCheck, LayoutDashboard, Users } from "lucide-react"

const links = [
  { to: "/",        label: "Dashboard", icon: LayoutDashboard },
  { to: "/clients", label: "Clients",   icon: Users },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-700 transition-colors">
              <ShieldCheck size={16} className="text-white" />
            </div>
            <div className="leading-tight">
              <span className="font-bold text-gray-900 text-sm block">LedgersCFO</span>
              <span className="text-xs text-gray-400 block -mt-0.5">Compliance Tracker</span>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            {links.map(({ to, label, icon: Icon }) => {
              const active = to === "/" ? pathname === "/" : pathname.startsWith(to)
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}