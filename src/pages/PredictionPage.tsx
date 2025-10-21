import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Brain,
  Upload,
  Download,
  Thermometer,
  Weight,
  Calendar,
  TrendingUp,
  Settings,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Loading } from '../components/ui/loading'
import { FilterPanel } from '../components/ui/filter'

interface PredictionResult {
  rawReportText: string
  predictedTemperature?: number
  confidence?: number
  recommendations?: string[]
  reportUrl?: string
}

export function PredictionPage() {
  // Input selection modes
  const [mode, setMode] = useState<'upload' | 'manual' | 'existing'>('upload')

  // File & manual input states
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [existingFile, setExistingFile] = useState<string | null>(null)
  const [inputData, setInputData] = useState({
    temperature: '',
    weight: '',
    pressure: '',
    dayOfWeek: '',
    humidity: '',
  })

  // Filter values (sliders)
  const [filterValues, setFilterValues] = useState({
    temperature: 25,
    weight: 1500,
    pressure: 32,
    dayOfWeek: 4,
    humidity: 60,
  })
  const [showFilters, setShowFilters] = useState(false)

  // Process state & result
  const [isPredicting, setIsPredicting] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string>('')

  // Mock existing files list (simulate option C)
  const mockExistingFiles = ['previous_run_2025-10-20.csv', 'sample_dataset.xlsx']

  // ----- Handlers -----
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setSelectedFile(file)
    setError('')
    setResult(null)
  }

  const handleInputChange = (field: string, value: string) => {
    setInputData((p) => ({ ...p, [field]: value }))
    setError('')
    setResult(null)
  }

  const handleFilterChange = (key: string, value: number) => {
    setFilterValues((p) => ({ ...p, [key]: value }))
    setError('')
    setResult(null)
  }

  const handlePredict = async () => {
    // Validation
    if (mode === 'upload' && !selectedFile) {
      setError('Please upload a dataset file to predict.')
      return
    }
    if (mode === 'existing' && !existingFile) {
      setError('Please select an existing file.')
      return
    }
    if (mode === 'manual' && (!inputData.temperature || !inputData.weight)) {
      setError('Please enter temperature and weight for manual prediction.')
      return
    }

    setIsPredicting(true)
    setError('')
    setResult(null)

    // Simulate API / processing delay and build a mock raw report text
    setTimeout(() => {
      // Build lines based on input type
      const sourceDesc =
        mode === 'upload'
          ? `Uploaded file: ${selectedFile?.name}`
          : mode === 'existing'
          ? `Existing file: ${existingFile}`
          : `Manual input: temp=${inputData.temperature}, weight=${inputData.weight}`

      const lines = [
        `Prediction Report`,
        `Source: ${sourceDesc}`,
        `Generated: ${new Date().toLocaleString()}`,
        ``,
        `--- Summary ---`,
        `Predicted Temperature: ${(
          Math.random() * 10 +
          (inputData.temperature ? Number(inputData.temperature) : 20)
        ).toFixed(2)} °C`,
        `Confidence: ${(70 + Math.random() * 25).toFixed(2)}%`,
        ``,
        `--- Recommendations ---`,
        `• Monitor temperature every 6 hours.`,
        `• Check weight trends weekly.`,
        `• Re-run analysis after next dataset.`,
        ``,
        `--- Raw Parameters ---`,
        `Temperature (input): ${inputData.temperature || filterValues.temperature}`,
        `Weight (input): ${inputData.weight || filterValues.weight}`,
        `Pressure: ${inputData.pressure || filterValues.pressure}`,
        `DayOfWeek: ${inputData.dayOfWeek || filterValues.dayOfWeek}`,
        `Humidity: ${inputData.humidity || filterValues.humidity}`,
        ``,
        `--- Notes ---`,
        `This is a mock preview. Replace with backend report text when connected.`,
      ]

      const rawReportText = lines.join('\n')
      setResult({
        rawReportText,
        predictedTemperature: parseFloat(lines[6].split(':')[1]) || undefined,
        confidence: parseFloat(lines[7].split(':')[1]) || undefined,
        recommendations: [
          'Monitor temperature every 6 hours',
          'Check weight trends weekly',
          'Re-run analysis after next dataset',
        ],
      })
      setIsPredicting(false)
    }, 1100)
  }

  // Download the raw report as a .txt (or change to xmldata/xlsx when backend available)
  const handleDownloadReport = () => {
    if (!result) return
    const blob = new Blob([result.rawReportText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'prediction_report.txt'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Quick small UI helper for small text and consistent card sizes
  const smallText = 'text-sm'

  return (
    <section className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Title */}
      <div className="px-6 pt-4 pb-2">
        <h1 className="text-sm font-semibold text-gray-700 tracking-wide uppercase">Prediction Dashboard</h1>
      </div>

      {/* Controls and panels */}
      <div className="flex-1 px-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-[1fr_1.7fr] gap-8 h-full"
        >
          {/* LEFT: Input Controls */}
          <Card className="h-[70vh] shadow-md overflow-y-auto">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <Brain className="h-5 w-5" />
                Input Data
              </CardTitle>
            </CardHeader>

            <CardContent className={`space-y-4 p-4 ${smallText}`}>
              {/* Mode selector */}
              <div className="flex gap-2">
                <Button variant={mode === 'upload' ? 'default' : 'outline'} className="flex-1" onClick={() => setMode('upload')}>
                  Upload Dataset
                </Button>
                <Button variant={mode === 'manual' ? 'default' : 'outline'} className="flex-1" onClick={() => setMode('manual')}>
                  Manual Input
                </Button>
                <Button variant={mode === 'existing' ? 'default' : 'outline'} className="flex-1" onClick={() => setMode('existing')}>
                  Use Existing
                </Button>
              </div>

              {/* Upload */}
              {mode === 'upload' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Dataset File</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                    <Input
                      id="dataset-upload"
                      type="file"
                      accept=".csv,.xlsx,.json"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <label htmlFor="dataset-upload" className="cursor-pointer flex flex-col items-center">
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click to upload dataset</span>
                      <span className="text-xs text-gray-500 mt-1">CSV, XLSX, JSON accepted</span>
                    </label>
                  </div>
                  {selectedFile && <p className="text-sm text-green-600 mt-2">Selected: {selectedFile.name}</p>}
                </div>
              )}

              {/* Existing */}
              {mode === 'existing' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Choose existing file</label>
                  <div className="space-y-2">
                    {mockExistingFiles.map((f) => (
                      <div key={f} className={`p-2 rounded cursor-pointer hover:bg-gray-100 flex items-center justify-between ${existingFile === f ? 'bg-blue-50 border border-blue-100' : 'border border-transparent'}`} onClick={() => { setExistingFile(f); setSelectedFile(null); }}>
                        <span className="text-sm">{f}</span>
                        {existingFile === f && <span className="text-xs text-blue-600">Selected</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Manual */}
              {mode === 'manual' && (
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3">
                    <Thermometer className="h-5 w-5 text-blue-600" />
                    <Input type="number" placeholder="Temperature (°C)" value={inputData.temperature} onChange={(e) => handleInputChange('temperature', e.target.value)} />
                  </div>
                  <div className="flex items-center gap-3">
                    <Weight className="h-5 w-5 text-blue-600" />
                    <Input type="number" placeholder="Weight (kg)" value={inputData.weight} onChange={(e) => handleInputChange('weight', e.target.value)} />
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <Input type="number" placeholder="Pressure (PSI)" value={inputData.pressure} onChange={(e) => handleInputChange('pressure', e.target.value)} />
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <Input type="number" placeholder="Day of Week (1-7)" value={inputData.dayOfWeek} onChange={(e) => handleInputChange('dayOfWeek', e.target.value)} />
                  </div>
                  <div className="flex items-center gap-3">
                    <Brain className="h-5 w-5 text-blue-600" />
                    <Input type="number" placeholder="Humidity (%)" value={inputData.humidity} onChange={(e) => handleInputChange('humidity', e.target.value)} />
                  </div>
                </div>
              )}

              {/* Filters toggle and panel */}
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700 font-medium">Parameter Filters</div>
                  <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>{showFilters ? 'Hide' : 'Show'}</Button>
                </div>

                {showFilters ? (
                  <div className="mt-3">
                    <FilterPanel
                      filters={[
                        { key: 'temperature', label: 'Temperature', value: filterValues.temperature, min: -10, max: 50, step: 1, unit: '°C', icon: <Thermometer className="h-4 w-4"/> },
                        { key: 'weight', label: 'Weight', value: filterValues.weight, min: 500, max: 3000, step: 50, unit: 'kg', icon: <Weight className="h-4 w-4"/> },
                        { key: 'pressure', label: 'Pressure', value: filterValues.pressure, min: 20, max: 50, step: 1, unit: 'PSI', icon: <TrendingUp className="h-4 w-4"/> },
                        { key: 'dayOfWeek', label: 'Day of Week', value: filterValues.dayOfWeek, min: 1, max: 7, step: 1, unit: '', icon: <Calendar className="h-4 w-4"/> },
                        { key: 'humidity', label: 'Humidity', value: filterValues.humidity, min: 0, max: 100, step: 5, unit: '%', icon: <Brain className="h-4 w-4"/> },
                      ]}
                      onChange={(k, v) => handleFilterChange(k, v)}
                    />
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-gray-500">Use filters for quick parameter adjustments (used if manual fields are empty).</p>
                )}
              </div>

              {/* Predict Button & errors */}
              <div>
                <Button
                  onClick={handlePredict}
                  disabled={isPredicting}
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

                {error && <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">{error}</div>}
              </div>
            </CardContent>
          </Card>

          {/* RIGHT: Prediction Result (raw text preview) */}
          <Card className="h-[70vh] shadow-md flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <TrendingUp className="h-5 w-5" />
                Prediction Results
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 p-4 overflow-y-auto text-sm">
              {isPredicting ? (
                <div className="text-center py-10">
                  <Loading size="lg" className="mx-auto mb-4" />
                  <p className="text-gray-600">Running AI prediction analysis...</p>
                </div>
              ) : result ? (
                <div className="whitespace-pre-wrap font-mono text-xs text-gray-800">
                  {result.rawReportText}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Prediction report will appear here as raw text.</p>
                </div>
              )}
            </CardContent>

            {/* Download button fixed at bottom */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Button onClick={handleDownloadReport} disabled={!result} className="flex-1" size="lg">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // quick copy-to-clipboard if needed
                    if (result) {
                      navigator.clipboard.writeText(result.rawReportText).then(() => {
                        // small feedback could be added
                      })
                    }
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
