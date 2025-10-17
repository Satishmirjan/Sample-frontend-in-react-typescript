import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FileSpreadsheet, Brain, ArrowRight, 
  TrendingUp, 
  ScanLine, 
  SlidersHorizontal, 
  LayoutDashboard, 
  FolderOpen} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'

export function LandingPage() {
  const features = [
    {
      icon: FileSpreadsheet,
      title: 'Convert Reports to Excel',
      description: 'Easily upload tyre test reports in PDF, DOCX, or CSV formats and convert them into clean Excel sheets. Extract important data like temperature, weight, and test readings in just one click.'
    },
    {
      icon: TrendingUp,
      title: 'Smart Prediction Engine',
      description: 'Use our built-in AI model to predict tyre performance parameters such as wear rate, grip, or temperature response based on past data. Get quick insights and downloadable results.'
    },
    {
      icon: ScanLine,
      title: 'Automated Data Extraction',
      description: 'No manual typing! The system automatically identifies tables, measurements, and key metrics from your reports using advanced parsing and OCR techniques.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Tyre Data{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FCC61D] to-[#000000]">
                Analyzer
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              A smart tool to extract key experiment data (like temperature, weight, and day readings) 
              from reports and export them to Excel or predict results with AI.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/convert" className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                Convert to Excel
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link to="/prediction" className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Prediction
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to analyze tyre experiment data efficiently
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="bg-[#FFF7DD] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-[#000000]" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#FCC61D] to-[#000000] py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Analyze Your Tyre Data?
            </h2>
            <p className="text-xl text-[#FFF7DD] mb-8 max-w-2xl mx-auto">
              Start converting your PDF reports to Excel or run AI predictions today
            </p>
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Link to="/convert" className="flex items-center gap-2">
                Get Started Now
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

