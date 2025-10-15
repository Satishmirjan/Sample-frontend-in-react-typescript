import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from './ui/button'

export function Header() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/convert', label: 'Convert to Excel' },
    { path: '/prediction', label: 'Prediction' },
  ]

  return (
    <motion.header 
      className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
            <img src="/jk-tyre-logo-header.webp" alt="JK Tyre logo" className="h-8 w-auto md:h-10 object-contain" />  
            </div>
            <span className="text-xl font-bold text-gray-900">
              Tyre Data Analyzer
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  location.pathname === item.path
                    ? 'text-blue-600'
                    : 'text-gray-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Button asChild size="sm">
              <Link to="/convert">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

