import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { LandingPage } from './pages/LandingPage'
import { ConvertPage } from './pages/ConvertPage'
 import { PredictionPage } from './pages/PredictionPage'

function AppContent() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <Header />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/convert" element={<ConvertPage />} />
          <Route path="/prediction" element={<PredictionPage />} />
        </Routes>
      </main>

      {location.pathname === '/' && <Footer />}
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
