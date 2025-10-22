import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { ThemeToggle } from './ui/theme-toggle'

export function Header() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/convert', label: 'Convert to Excel' },
    { path: '/prediction', label: 'Prediction' },
  ]

  return (
    <motion.header 
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-2 py-2">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-[#FCC61D] p-2 rounded-lg">
            <img src="/jk-tyre-logo-header.webp" alt="JK Tyre logo" className="h-7 w-auto md:h-8 object-contain" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Tyre Data Analyzer
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-lg font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                  location.pathname === item.path
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button asChild size="sm">
              <Link to="/convert">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

