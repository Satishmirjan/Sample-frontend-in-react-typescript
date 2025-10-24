import { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Upload, Download, TrendingUp } from 'lucide-react'
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

// 30 tire-related parameters
const ALL_TIRE_PARAMETERS = [
  { key: 'tirePressure', label: 'Tire Pressure', value: 32, min: 20, max: 50, step: 1, unit: 'PSI' },
  { key: 'treadDepth', label: 'Tread Depth', value: 8, min: 0, max: 12, step: 0.5, unit: 'mm' },
  { key: 'loadIndex', label: 'Load Index', value: 91, min: 50, max: 120, step: 1, unit: '' },
  { key: 'speedRating', label: 'Speed Rating', value: 120, min: 80, max: 250, step: 5, unit: 'km/h' },
  { key: 'tireWidth', label: 'Tire Width', value: 205, min: 150, max: 300, step: 5, unit: 'mm' },
  { key: 'aspectRatio', label: 'Aspect Ratio', value: 55, min: 30, max: 80, step: 1, unit: '%' },
  { key: 'rimDiameter', label: 'Rim Diameter', value: 16, min: 12, max: 22, step: 1, unit: 'inch' },
  { key: 'tireAge', label: 'Tire Age', value: 2, min: 0, max: 10, step: 1, unit: 'years' },
  { key: 'sidewallHeight', label: 'Sidewall Height', value: 114, min: 80, max: 200, step: 1, unit: 'mm' },
  { key: 'rollingResistance', label: 'Rolling Resistance', value: 0.009, min: 0.005, max: 0.02, step: 0.001, unit: '' },
  { key: 'temperatureIndex', label: 'Temperature Index', value: 75, min: 50, max: 100, step: 1, unit: '°C' },
  { key: 'inflationType', label: 'Inflation Type', value: 32, min: 20, max: 50, step: 1, unit: 'PSI' },
  { key: 'tractionRating', label: 'Traction Rating', value: 7, min: 1, max: 10, step: 1, unit: '' },
  { key: 'corneringStiffness', label: 'Cornering Stiffness', value: 90, min: 50, max: 150, step: 1, unit: '' },
  { key: 'rideComfort', label: 'Ride Comfort', value: 7, min: 1, max: 10, step: 1, unit: '' },
  { key: 'wetGrip', label: 'Wet Grip', value: 7, min: 1, max: 10, step: 1, unit: '' },
  { key: 'noiseLevel', label: 'Noise Level', value: 72, min: 50, max: 100, step: 1, unit: 'dB' },
  { key: 'tireType', label: 'Tire Type', value: 'Radial', min: 0, max: 0, step: 0, unit: '' },
  { key: 'materialHardness', label: 'Material Hardness', value: 65, min: 40, max: 100, step: 1, unit: 'Shore A' },
  { key: 'camberSensitivity', label: 'Camber Sensitivity', value: 3, min: 0, max: 10, step: 0.1, unit: 'deg' },
  { key: 'tireWearRate', label: 'Tire Wear Rate', value: 0.01, min: 0, max: 0.1, step: 0.001, unit: '%' },
  { key: 'pressureVariation', label: 'Pressure Variation', value: 1, min: 0, max: 5, step: 0.1, unit: 'PSI' },
  { key: 'loadDistribution', label: 'Load Distribution', value: 50, min: 0, max: 100, step: 1, unit: '%' },
  { key: 'rollingSpeed', label: 'Rolling Speed', value: 90, min: 20, max: 150, step: 1, unit: 'km/h' },
  { key: 'temperatureGradient', label: 'Temperature Gradient', value: 5, min: 0, max: 20, step: 1, unit: '°C' },
  { key: 'sidewallFlexibility', label: 'Sidewall Flexibility', value: 8, min: 1, max: 10, step: 1, unit: '' },
  { key: 'corneringLoad', label: 'Cornering Load', value: 800, min: 100, max: 2000, step: 10, unit: 'kg' },
  { key: 'tractionCoefficient', label: 'Traction Coefficient', value: 0.85, min: 0, max: 1, step: 0.01, unit: '' },
  { key: 'inflationMethod', label: 'Inflation Method', value: 'Standard', min: 0, max: 0, step: 0, unit: '' },
  { key: 'maximumLoad', label: 'Maximum Load', value: 615, min: 100, max: 1000, step: 10, unit: 'kg' },
]

export function PredictionPage() {
  const [mode, setMode] = useState<'upload' | 'manual' | 'existing'>('upload')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [existingFile, setExistingFile] = useState<string | null>(null)
  const [inputData, setInputData] = useState<any>({})
  const [filterValues, setFilterValues] = useState<any>(
    ALL_TIRE_PARAMETERS.reduce((acc, p) => ({ ...acc, [p.key]: p.value }), {})
  )
  const [selectedParams, setSelectedParams] = useState<string[]>(['tirePressure', 'treadDepth', 'loadIndex'])
  const [showFilters, setShowFilters] = useState(false)
  const [isPredicting, setIsPredicting] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string>('')

  const mockExistingFiles = ['previous_run_2025-10-20.csv', 'sample_dataset.xlsx']

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setSelectedFile(file)
    setError('')
    setResult(null)
  }

  const handleInputChange = (field: string, value: string) => {
    setInputData((p: any) => ({ ...p, [field]: value }))
    setError('')
    setResult(null)
  }

  const handleFilterChange = (key: string, value: number | string) => {
    setFilterValues((p: any) => ({ ...p, [key]: value }))
    setError('')
    setResult(null)
  }

  const handleParamToggle = (key: string) => {
    setSelectedParams((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    )
  }

  const handlePredict = async () => {
    if (mode === 'upload' && !selectedFile) {
      setError('Please upload a dataset file to predict.')
      return
    }
    if (mode === 'existing' && !existingFile) {
      setError('Please select an existing file.')
      return
    }

    setIsPredicting(true)
    setError('')
    setResult(null)

    setTimeout(() => {
      const sourceDesc =
        mode === 'upload'
          ? `Uploaded file: ${selectedFile?.name}`
          : mode === 'existing'
          ? `Existing file: ${existingFile}`
          : `Manual input: ${JSON.stringify(inputData)}`

      const lines = [
        `Prediction Report`,
        `Source: ${sourceDesc}`,
        `Generated: ${new Date().toLocaleString()}`,
        ``,
        `--- Summary ---`,
        `Predicted Temperature: ${(Math.random() * 10 + (inputData.tirePressure || 20)).toFixed(2)} °C`,
        `Confidence: ${(70 + Math.random() * 25).toFixed(2)}%`,
        ``,
        `--- Recommendations ---`,
        `• Monitor temperature every 6 hours.`,
        `• Check weight trends weekly.`,
        `• Re-run analysis after next dataset.`,
        ``,
        `--- Raw Parameters ---`,
        ...ALL_TIRE_PARAMETERS.map(p => `${p.label}: ${filterValues[p.key]}`),
      ]

      const rawReportText = lines.join('\n')
      setResult({
        rawReportText,
        predictedTemperature: parseFloat(lines[5].split(':')[1]) || undefined,
        confidence: parseFloat(lines[6].split(':')[1]) || undefined,
        recommendations: [
          'Monitor temperature every 6 hours',
          'Check weight trends weekly',
          'Re-run analysis after next dataset',
        ],
      })
      setIsPredicting(false)
    }, 1200)
  }

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

  const smallText = 'text-sm'

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <div className="px-6 pt-4 pb-2">
        <h1 className="text-sm font-semibold text-gray-700 tracking-wide uppercase">Prediction Dashboard</h1>
      </div>

      <div className="flex-1 px-6 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[calc(100vh-100px)]"
        >
          {/* LEFT SIDE */}
          <Card className="shadow-lg h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <Brain className="h-5 w-5" />
                Input & Filters
              </CardTitle>
            </CardHeader>
            <CardContent className={`flex-1 overflow-y-auto p-4 ${smallText}`}>
              <div className="flex gap-2 mb-4">
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

              {mode === 'upload' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Dataset File</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                    <Input id="dataset-upload" type="file" accept=".csv,.xlsx,.json" onChange={handleFileSelect} className="hidden" />
                    <label htmlFor="dataset-upload" className="cursor-pointer flex flex-col items-center">
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click to upload dataset</span>
                    </label>
                  </div>
                  {selectedFile && <p className="text-sm text-green-600 mt-2">Selected: {selectedFile.name}</p>}
                </div>
              )}

              {mode === 'manual' && (
                <div className="grid grid-cols-1 gap-3">
                  {ALL_TIRE_PARAMETERS.slice(0, 5).map(p => (
                    <Input key={p.key} type="text" placeholder={p.label} value={inputData[p.key] || ''} onChange={e => handleInputChange(p.key, e.target.value)} />
                  ))}
                </div>
              )}

              {mode === 'existing' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Select Existing File</label>
                  <select
                    className="border rounded-md w-full px-3 py-2"
                    value={existingFile || ''}
                    onChange={(e) => setExistingFile(e.target.value)}
                  >
                    <option value="">-- Choose File --</option>
                    {mockExistingFiles.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-700 font-medium">Select Parameters</div>
                  <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                    {showFilters ? 'Hide' : 'Show'}
                  </Button>
                </div>

                {showFilters && (
                  <div className="border p-2 rounded max-h-64 overflow-y-auto mb-2">
                    <div className="grid grid-cols-2 gap-2">
                      {ALL_TIRE_PARAMETERS.map(p => (
                        <label key={p.key} className="flex items-center gap-2">
                          <input type="checkbox" checked={selectedParams.includes(p.key)} onChange={() => handleParamToggle(p.key)} />
                          <span className="text-xs">{p.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
  {ALL_TIRE_PARAMETERS.filter(p => selectedParams.includes(p.key)).map(p => (
    <FilterPanel
      key={p.key}
      filters={[{ ...p, value: filterValues[p.key] }]}
      onChange={handleFilterChange}
    />
  ))}
</div>
              </div>

              <Button onClick={handlePredict} disabled={isPredicting} className="w-full mt-4" size="lg">
                {isPredicting ? <><Loading className="mr-2" />Analyzing...</> : 'Predict Results'}
              </Button>
              {error && <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">{error}</div>}
            </CardContent>
          </Card>

          {/* RIGHT SIDE */}
          <Card className="shadow-lg h-full flex flex-col">
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
                <div className="whitespace-pre-wrap font-mono text-xs text-gray-800">{result.rawReportText}</div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Prediction report will appear here as raw text.</p>
                </div>
              )}
            </CardContent>
            <div className="p-4 border-t flex gap-2">
              <Button onClick={handleDownloadReport} disabled={!result} className="flex-1" size="lg">
                <Download className="h-4 w-4 mr-2" /> Download Report
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (result) navigator.clipboard.writeText(result.rawReportText)
                }}
              >
                Copy
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
