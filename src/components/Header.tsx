import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from './ui/button'
import { ThemeToggle } from './ui/theme-toggle'
import { Menu, X, Zap } from 'lucide-react'

export function Header() {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/convert', label: 'Convert to Excel' },
    { path: '/prediction', label: 'Prediction' },
  ]

  return (
    <>
      <motion.header 
        className={`bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? 'shadow-lg' : 'shadow-sm'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div 
                className="relative bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-xl shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                {/* Animated Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl blur-md opacity-0 group-hover:opacity-50"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <img 
                  src="/jk-tyre-logo-header.webp" 
                  alt="JK Tyre logo" 
                  className="h-7 w-auto md:h-8 object-contain relative z-10" 
                />
                
                {/* Corner Accent */}
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </motion.div>
              
              <div className="flex flex-col">
                <motion.span 
                  className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Tyre Data Analyzer
                </motion.span>
                <motion.span
                  className="text-xs text-yellow-600 dark:text-yellow-400 font-medium flex items-center gap-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Zap className="w-3 h-3" />
                  AI-Powered
                </motion.span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Link
                      to={item.path}
                      className="relative px-4 py-2 rounded-lg group"
                    >
                      <span
                        className={`text-base font-medium transition-colors relative z-10 ${
                          isActive
                            ? 'text-orange-600 dark:text-orange-400'
                            : 'text-gray-600 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400'
                        }`}
                      >
                        {item.label}
                      </span>
                      
                      {/* Active Indicator */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-lg"
                          layoutId="activeNav"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      
                      {/* Hover Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-lg opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.2 }}
                      />
                      
                      {/* Bottom Border */}
                      {isActive && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <ThemeToggle />
              </motion.div>

              <motion.div
                className="hidden md:block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  asChild 
                  size="sm"
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <Link to="/convert" className="flex items-center gap-2">
                    Get Started
                    <motion.span
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </Link>
                </Button>
              </motion.div>

              {/* Mobile Menu Button */}
              <motion.button
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  ) : (
                    <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  )}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 origin-left"
          style={{ scaleX: useTransform(scrollY, [0, 1000], [0, 1]) }}
        />
      </motion.header>

      {/* Mobile Menu */}
      <motion.div
        className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: isMobileMenuOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ pointerEvents: isMobileMenuOpen ? 'auto' : 'none' }}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <motion.div
          className="absolute right-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-2xl"
          initial={{ x: '100%' }}
          animate={{ x: isMobileMenuOpen ? 0 : '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between mb-8">
              <span className="text-lg font-bold text-gray-900 dark:text-white">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-2">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-yellow-400/20 to-orange-500/20 text-orange-600 dark:text-orange-400'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                asChild 
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold shadow-lg"
              >
                <Link 
                  to="/convert" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2"
                >
                  Get Started
                  →
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}