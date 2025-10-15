import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { LandingPage } from './pages/LandingPage'
//import { ConvertPage } from '../tempwaste/ConvertPage'
//import { PredictionPage } from '../tempwaste/PredictionPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

