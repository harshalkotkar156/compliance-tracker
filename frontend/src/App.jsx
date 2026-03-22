import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { Routes,Route ,Navigate} from 'react-router-dom';
import './App.css'

import Navbar from './components/Navbar.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ClientDetailPage from './pages/ClientDetailPage.jsx';
import ClientsPage from "./pages/ClientsPage.jsx"

function App() {
  
  
  return (
    <>
     <Toaster
        // position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            fontSize: "14px",
            borderRadius: "10px",
            maxWidth: "380px",
          },

        }}
      />

     <Navbar />

     <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/"           element={<DashboardPage />} />
          <Route path="/clients"    element={<ClientsPage />} />
          <Route path="/clients/:id" element={<ClientDetailPage />} />
          <Route path="*"           element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
    </>
  )
}

export default App
