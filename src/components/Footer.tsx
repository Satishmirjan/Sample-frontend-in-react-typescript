import { motion } from 'framer-motion'

export function Footer() {
  return (
    <motion.footer 
      className="bg-gray-900 text-white py-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-400">
          © 2025 Tyre Data Analyzer | Powered by Jk Tyres
        </p>
      </div>
    </motion.footer>
  )
}

