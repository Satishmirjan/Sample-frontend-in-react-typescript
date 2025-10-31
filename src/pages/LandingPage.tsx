import { useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FileSpreadsheet, Brain, ArrowRight, TrendingUp, ScanLine, Zap, Shield, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export  function LandingPage() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const features = [
    {
      icon: FileSpreadsheet,
      title: 'Convert Reports to Excel',
      description:
        'Easily upload tyre test reports in PDF, DOCX, or CSV formats and convert them into clean Excel sheets. Extract important data like temperature, weight, and test readings in just one click.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: TrendingUp,
      title: 'Smart Prediction Engine',
      description:
        'Use our built-in AI model to predict tyre performance parameters such as wear rate, grip, or temperature response based on past data. Get quick insights and downloadable results.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: ScanLine,
      title: 'Automated Data Extraction',
      description:
        'No manual typing! The system automatically identifies tables, measurements, and key metrics from your reports using advanced parsing and OCR techniques.',
      color: 'from-orange-500 to-red-500',
    },
  ]

  const stats = [
    { icon: Zap, value: '10x', label: 'Faster Processing' },
    { icon: Shield, value: '99.9%', label: 'Accuracy Rate' },
    { icon: Clock, value: '<2min', label: 'Average Time' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Tire Tread Patterns */}
        <motion.div
          className="absolute top-20 -left-20 w-64 h-64 opacity-5"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="20" strokeDasharray="10 5" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="15" strokeDasharray="8 4" />
            <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="10" strokeDasharray="5 3" />
          </svg>
        </motion.div>

        <motion.div
          className="absolute bottom-20 -right-20 w-80 h-80 opacity-5"
          animate={{
            rotate: -360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="15" strokeDasharray="12 6" />
            <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="12" strokeDasharray="10 5" />
            <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="6 3" />
          </svg>
        </motion.div>

        {/* Floating Vehicle Silhouettes */}
        <motion.div
          className="absolute top-1/4 right-1/4 opacity-10"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg width="120" height="60" viewBox="0 0 120 60" fill="currentColor" className="text-gray-400 dark:text-gray-600">
            <path d="M10 40 L30 40 L35 25 L50 25 L55 15 L75 15 L80 25 L95 25 L100 40 L110 40 C110 40 112 45 110 48 C108 51 105 52 105 52 L15 52 C15 52 12 51 10 48 C8 45 10 40 10 40 Z" />
            <circle cx="30" cy="48" r="8" fill="currentColor" />
            <circle cx="90" cy="48" r="8" fill="currentColor" />
          </svg>
        </motion.div>

        <motion.div
          className="absolute top-2/3 left-1/4 opacity-10"
          animate={{
            y: [0, 20, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg width="80" height="100" viewBox="0 0 80 100" fill="currentColor" className="text-gray-400 dark:text-gray-600">
            <circle cx="20" cy="80" r="15" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="60" cy="80" r="15" fill="none" stroke="currentColor" strokeWidth="3" />
            <path d="M20 80 L35 50 L45 50 L50 35 L55 35 L60 50 L60 80" strokeWidth="3" stroke="currentColor" fill="none" />
            <path d="M45 50 L50 60 L35 60 Z" />
          </svg>
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 right-1/3 opacity-10"
          animate={{
            y: [0, -25, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg width="140" height="80" viewBox="0 0 140 80" fill="currentColor" className="text-gray-400 dark:text-gray-600">
            <rect x="10" y="30" width="60" height="35" />
            <rect x="70" y="15" width="50" height="50" />
            <circle cx="30" cy="65" r="10" />
            <circle cx="100" cy="65" r="10" />
          </svg>
        </motion.div>

        {/* Animated Gradient Orbs */}
        <motion.div
          className="absolute top-1/3 left-1/2 w-96 h-96 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ y, opacity }}
          >
            {/* Floating Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border border-yellow-400/30 rounded-full mb-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                AI-Powered Tyre Analysis
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
              Revolutionize Your
              <br />
              <span className="relative inline-block mt-2">
                <motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    backgroundSize: '200% 200%',
                  }}
                >
                  Tyre Data Analysis
                </motion.span>
                <motion.span
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Transform complex tyre test reports into actionable insights with our intelligent extraction and prediction platform.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="text-lg px-10 py-7 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold shadow-xl hover:shadow-2xl transition-all"
              >
                <FileSpreadsheet className="h-6 w-6 mr-3" />
                Convert to Excel
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="ml-3"
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-10 py-7 border-2 border-gray-300 dark:border-gray-600 hover:border-yellow-400 dark:hover:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Brain className="h-6 w-6 mr-3" />
                AI Prediction
                <ArrowRight className="h-5 w-5 ml-3" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
                whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                transition={{ duration: 0.3 }}
              >
                <stat.icon className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative container mx-auto px-4 py-20">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to analyze tyre experiment data efficiently
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <Card className="h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-2 border-gray-200 dark:border-gray-700 hover:border-yellow-400 dark:hover:border-yellow-400 transition-all duration-300 overflow-hidden group">
                <CardContent className="p-8 relative">
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  />
                  
                  <div className="relative z-10">
                    <motion.div
                      className={`bg-gradient-to-br ${feature.color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="h-10 w-10 text-white" />
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500" />
        
        {/* Animated Tire Patterns in Background */}
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 opacity-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full text-white">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="5 5" />
          </svg>
        </motion.div>

        <motion.div
          className="absolute bottom-10 right-10 w-40 h-40 opacity-20"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full text-white">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="8 4" />
          </svg>
        </motion.div>

        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto">
              Join industry leaders who trust our platform for precise tyre data analysis
            </p>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="text-lg px-12 py-7 bg-white text-orange-600 hover:bg-gray-100 font-bold shadow-2xl"
              >
                Get Started Now
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="ml-3"
                >
                  <ArrowRight className="h-6 w-6" />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}