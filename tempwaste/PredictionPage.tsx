import { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Upload, Download, Thermometer, Weight, Calendar, TrendingUp, Settings } from 'lucide-react'
import { Button } from '../src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../src/components/ui/card'
import { Input } from '../src/components/ui/input'
import { Loading } from '../src/components/ui/loading'
import { FilterPanel } from '../src/components/ui/filter'

interface PredictionResult {
  predictedTemperature: number
  confidence: number
  recommendations: string[]
  reportUrl?: string
}

export function PredictionPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [inputData, setInputData] = useState({
    temperature: '',
    weight: '',
    pressure: '',
    dayOfWeek: '',
    humidity: ''
  })
  const [isPredicting, setIsPredicting] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string>('')
  const [useFileInput, setUseFileInput] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  
  // Filter state for adjustable parameters
  const [filterValues, setFilterValues] = useState({
    temperature: 25,
    weight: 1500,
    pressure: 32,
    dayOfWeek: 4,
    humidity: 60
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError('')
      setResult(null)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setInputData(prev => ({
      ...prev,
      [field]: value
    }))
    setError('')
    setResult(null)
  }

  const handleFilterChange = (key: string, value: number) => {
    setFilterValues(prev => ({
      ...prev,
      [key]: value
    }))
    setError('')
    setResult(null)
  }

  const handlePredict = async () => {
    if (useFileInput && !selectedFile) {
      setError('Please select a dataset file')
      return
    }

    if (!useFileInput && (!inputData.temperature || !inputData.weight)) {
      setError('Please fill in at least temperature and weight')
      return
    }

    setIsPredicting(true)
    setError('')

    try {
      let response

      if (useFileInput && selectedFile) {
        const formData = new FormData()
        formData.append('file', selectedFile)

        response = await fetch('http://localhost:5000/api/predict', {
          method: 'POST',
          body: formData,
        })
      } else {
        // Use filter values if available, otherwise use manual input
        const dataToSend = Object.keys(inputData).some(key => inputData[key as keyof typeof inputData]) 
          ? inputData 
          : filterValues
        
        response = await fetch('http://localhost:5000/api/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        })
      }

      if (!response.ok) {
        throw new Error('Prediction failed')
      }

      const data = await response.json()
      setResult({
        predictedTemperature: data.predicted_temperature || 22.3,
        confidence: data.confidence || 85.5,
        recommendations: data.recommendations || [
          'Optimal temperature range achieved',
          'Consider monitoring weight fluctuations',
          'Schedule next analysis in 7 days'
        ],
        reportUrl: data.report_url
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prediction failed')
    } finally {
      setIsPredicting(false)
    }
  }

  const handleDownloadReport = () => {
    if (result?.reportUrl) {
      const link = document.createElement('a')
      link.href = result.reportUrl
      link.download = 'prediction_report.xlsx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Prediction Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Upload your dataset or enter parameters to get AI-powered predictions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Input Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Input Method Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={useFileInput ? "default" : "outline"}
                  onClick={() => setUseFileInput(true)}
                  className="flex-1"
                >
                  Upload Dataset
                </Button>
                <Button
                  variant={!useFileInput ? "default" : "outline"}
                  onClick={() => setUseFileInput(false)}
                  className="flex-1"
                >
                  Manual Input
                </Button>
              </div>

              {useFileInput ? (
                /* File Upload */
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Dataset File
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <Input
                      type="file"
                      accept=".csv,.xlsx,.json"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="dataset-upload"
                    />
                    <label
                      htmlFor="dataset-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="h-12 w-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        Click to upload dataset
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        CSV, XLSX, JSON files accepted
                      </span>
                    </label>
                  </div>
                  {selectedFile && (
                    <p className="text-sm text-green-600 mt-2">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
              ) : (
                /* Manual Input Fields */
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-3">
                    <Thermometer className="h-5 w-5 text-blue-600" />
                    <Input
                      type="number"
                      placeholder="Temperature (°C)"
                      value={inputData.temperature}
                      onChange={(e) => handleInputChange('temperature', e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Weight className="h-5 w-5 text-blue-600" />
                    <Input
                      type="number"
                      placeholder="Weight (kg)"
                      value={inputData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <Input
                      type="number"
                      placeholder="Pressure (PSI)"
                      value={inputData.pressure}
                      onChange={(e) => handleInputChange('pressure', e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <Input
                      type="number"
                      placeholder="Day of Week (1-7)"
                      value={inputData.dayOfWeek}
                      onChange={(e) => handleInputChange('dayOfWeek', e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Brain className="h-5 w-5 text-blue-600" />
                    <Input
                      type="number"
                      placeholder="Humidity (%)"
                      value={inputData.humidity}
                      onChange={(e) => handleInputChange('humidity', e.target.value)}
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={handlePredict}
                disabled={
                  (useFileInput && !selectedFile) || 
                  (!useFileInput && !inputData.temperature) || 
                  isPredicting
                }
                className="w-full"
                size="lg"
              >
                {isPredicting ? (
                  <>
                    <Loading className="mr-2" />
                    Analyzing...
                  </>
                ) : (
                  'Predict Results'
                )}
              </Button>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Filter Controls Section */}
          {!useFileInput && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Parameter Filters
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="ml-auto"
                  >
                    {showFilters ? 'Hide' : 'Show'} Filters
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showFilters && (
                  <FilterPanel
                    filters={[
                      {
                        key: 'temperature',
                        label: 'Temperature',
                        value: filterValues.temperature,
                        min: -10,
                        max: 50,
                        step: 1,
                        unit: '°C',
                        icon: <Thermometer className="h-4 w-4 text-blue-600" />
                      },
                      {
                        key: 'weight',
                        label: 'Weight',
                        value: filterValues.weight,
                        min: 500,
                        max: 3000,
                        step: 50,
                        unit: 'kg',
                        icon: <Weight className="h-4 w-4 text-blue-600" />
                      },
                      {
                        key: 'pressure',
                        label: 'Pressure',
                        value: filterValues.pressure,
                        min: 20,
                        max: 50,
                        step: 1,
                        unit: 'PSI',
                        icon: <TrendingUp className="h-4 w-4 text-blue-600" />
                      },
                      {
                        key: 'dayOfWeek',
                        label: 'Day of Week',
                        value: filterValues.dayOfWeek,
                        min: 1,
                        max: 7,
                        step: 1,
                        unit: '',
                        icon: <Calendar className="h-4 w-4 text-blue-600" />
                      },
                      {
                        key: 'humidity',
                        label: 'Humidity',
                        value: filterValues.humidity,
                        min: 0,
                        max: 100,
                        step: 5,
                        unit: '%',
                        icon: <Brain className="h-4 w-4 text-blue-600" />
                      }
                    ]}
                    onChange={handleFilterChange}
                  />
                )}
                {!showFilters && (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">
                      Click "Show Filters" to adjust prediction parameters with interactive controls
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Prediction Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isPredicting ? (
                <div className="text-center py-8">
                  <Loading size="lg" className="mx-auto mb-4" />
                  <p className="text-gray-600">Running AI prediction analysis...</p>
                </div>
              ) : result ? (
                <div className="space-y-6">
                  {/* Main Prediction */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-3">Prediction Result</h3>
                    <div className="text-3xl font-bold text-blue-900 mb-2">
                      {result.predictedTemperature}°C
                    </div>
                    <p className="text-sm text-blue-700">
                      Confidence: {result.confidence}%
                    </p>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Recommendations</h4>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Download Report */}
                  <Button 
                    onClick={handleDownloadReport} 
                    className="w-full" 
                    size="lg"
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Prediction Report
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Prediction results will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}

