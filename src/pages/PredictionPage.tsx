import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Upload, Download, TrendingUp, Play, SkipForward, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'

interface PredictionResult {
  rawReportText: string
  predictedTemperature?: number
  confidence?: number
  recommendations?: string[]
  reportUrl?: string
}

interface Iteration {
  id: number
  timestamp: string
  results: PredictionResult
  parameters: any
}

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
]

const Button = ({ children, onClick, disabled, variant = 'default', size = 'md', className = '' }: any) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center'
  const variants = {
    default: 'bg-yellow-400 text-gray-900 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed',
    outline: 'border-2 border-yellow-400 text-yellow-600 hover:bg-yellow-50 disabled:border-gray-300 disabled:text-gray-300',
    ghost: 'text-gray-700 hover:bg-gray-100'
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  )
}

const Card = ({ children, className = '' }: any) => (
  <div className={`bg-white rounded-xl ${className}`}>{children}</div>
)

const Input = ({ type = 'text', placeholder, value, onChange, className = '' }: any) => (
  <input type={type} placeholder={placeholder} value={value} onChange={onChange} className={`border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`} />
)

const Loading = ({ size = 'md', className = '' }: any) => {
  const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' }
  return <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizes[size]} ${className}`} />
}

const FilterPanel = ({ filters, onChange }: any) => (
  <div className="space-y-2">
    {filters.map((f: any) => (
      <div key={f.key} className="space-y-1">
        <label className="text-xs font-medium text-gray-700">{f.label}</label>
        {typeof f.value === 'number' ? (
          <input type="number" min={f.min} max={f.max} step={f.step} value={f.value} onChange={e => onChange(f.key, parseFloat(e.target.value))} className="border border-gray-300 rounded px-2 py-1 w-full text-xs" />
        ) : (
          <input type="text" value={f.value} onChange={e => onChange(f.key, e.target.value)} className="border border-gray-300 rounded px-2 py-1 w-full text-xs" />
        )}
        {f.unit && <span className="text-xs text-gray-500">{f.unit}</span>}
      </div>
    ))}
  </div>
)

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
  const [error, setError] = useState<string>('')
  
  // Iteration state
  const [iterations, setIterations] = useState<Iteration[]>([])
  const [currentIterationIndex, setCurrentIterationIndex] = useState<number>(-1)
  const [isIterating, setIsIterating] = useState(false)

  const mockExistingFiles = ['previous_run_2025-10-20.csv', 'sample_dataset.xlsx']

  const generatePredictionResult = (iterationNum: number): PredictionResult => {
    const baseTemp = 65 + (Math.random() * 15)
    const variance = (Math.random() - 0.5) * 10
    const temp = baseTemp + variance + (iterationNum * 0.5)
    const confidence = 70 + Math.random() * 25
    
    const sourceDesc = mode === 'upload' ? `Uploaded file: ${selectedFile?.name}` : mode === 'existing' ? `Existing file: ${existingFile}` : `Manual input`

    const lines = [
      `========================================`,
      `ITERATION ${iterationNum} - PREDICTION REPORT`,
      `========================================`,
      `Source: ${sourceDesc}`,
      `Generated: ${new Date().toLocaleString()}`,
      `Iteration: ${iterationNum}`,
      ``,
      `--- SUMMARY ---`,
      `Predicted Temperature: ${temp.toFixed(2)} °C`,
      `Confidence Score: ${confidence.toFixed(2)}%`,
      `Variation from baseline: ${variance > 0 ? '+' : ''}${variance.toFixed(2)} °C`,
      ``,
      `--- KEY METRICS ---`,
      `• Average Tire Pressure: ${(filterValues.tirePressure + Math.random() * 2).toFixed(1)} PSI`,
      `• Tread Depth: ${(filterValues.treadDepth - iterationNum * 0.1).toFixed(1)} mm`,
      `• Load Index: ${filterValues.loadIndex}`,
      `• Temperature Index: ${filterValues.temperatureIndex || 75} °C`,
      `• Rolling Resistance: ${(filterValues.rollingResistance || 0.009).toFixed(4)}`,
      ``,
      `--- RECOMMENDATIONS ---`,
      `• Monitor temperature every ${6 + iterationNum} hours`,
      `• ${confidence > 85 ? 'High confidence - maintain current parameters' : 'Consider adjusting tire pressure'}`,
      `• Next iteration scheduled in ${Math.floor(Math.random() * 24 + 12)} hours`,
      `• ${temp > 75 ? 'WARNING: Temperature approaching critical threshold' : 'Temperature within normal range'}`,
      ``,
      `--- ACTIVE PARAMETERS (${selectedParams.length}) ---`,
      ...selectedParams.map(key => {
        const param = ALL_TIRE_PARAMETERS.find(p => p.key === key)
        return `${param?.label}: ${filterValues[key]} ${param?.unit || ''}`
      }),
      ``,
      `--- ITERATION STATISTICS ---`,
      `Total iterations completed: ${iterationNum}`,
      `Success rate: ${(85 + Math.random() * 10).toFixed(1)}%`,
      `Processing time: ${(0.8 + Math.random() * 0.4).toFixed(2)}s`,
      `Model version: v2.${iterationNum}.0`,
      `========================================`,
    ]

    return {
      rawReportText: lines.join('\n'),
      predictedTemperature: parseFloat(temp.toFixed(2)),
      confidence: parseFloat(confidence.toFixed(2)),
      recommendations: [
        `Monitor temperature every ${6 + iterationNum} hours`,
        confidence > 85 ? 'High confidence - maintain current parameters' : 'Consider adjusting tire pressure',
        temp > 75 ? 'WARNING: Temperature approaching critical threshold' : 'Temperature within normal range'
      ]
    }
  }

  const handleStartIterations = async () => {
    if (mode === 'upload' && !selectedFile) {
      setError('Please upload a dataset file first.')
      return
    }
    if (mode === 'existing' && !existingFile) {
      setError('Please select an existing file.')
      return
    }

    setError('')
    setIsIterating(true)
    setIsPredicting(true)

    setTimeout(() => {
      const newIteration: Iteration = {
        id: iterations.length + 1,
        timestamp: new Date().toLocaleString(),
        results: generatePredictionResult(iterations.length + 1),
        parameters: { ...filterValues, selectedParams }
      }

      setIterations([...iterations, newIteration])
      setCurrentIterationIndex(iterations.length)
      setIsPredicting(false)
    }, 1200)
  }

  const handleNextIteration = async () => {
    setIsPredicting(true)
    
    setTimeout(() => {
      const newIteration: Iteration = {
        id: iterations.length + 1,
        timestamp: new Date().toLocaleString(),
        results: generatePredictionResult(iterations.length + 1),
        parameters: { ...filterValues, selectedParams }
      }

      setIterations([...iterations, newIteration])
      setCurrentIterationIndex(iterations.length)
      setIsPredicting(false)
    }, 1200)
  }

  const handleResetIterations = () => {
    setIterations([])
    setCurrentIterationIndex(-1)
    setIsIterating(false)
    setError('')
  }

  const handleNavigateIteration = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentIterationIndex > 0) {
      setCurrentIterationIndex(currentIterationIndex - 1)
    } else if (direction === 'next' && currentIterationIndex < iterations.length - 1) {
      setCurrentIterationIndex(currentIterationIndex + 1)
    }
  }

  const handleDownloadReport = () => {
    if (currentIterationIndex === -1 || !iterations[currentIterationIndex]) return
    const result = iterations[currentIterationIndex].results
    const blob = new Blob([result.rawReportText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `iteration_${iterations[currentIterationIndex].id}_report.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleDownloadAllReports = () => {
    const allReports = iterations.map(iter => iter.results.rawReportText).join('\n\n' + '='.repeat(80) + '\n\n')
    const blob = new Blob([allReports], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'all_iterations_report.txt'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const currentResult = currentIterationIndex >= 0 ? iterations[currentIterationIndex] : null

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <div className="px-6 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-semibold text-gray-700 tracking-wide uppercase">Prediction Dashboard</h1>
          {iterations.length > 0 && (
            <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-lg shadow">
              Total Iterations: <span className="font-bold text-yellow-600">{iterations.length}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 px-6 pb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[calc(100vh-100px)]">
          
          {/* LEFT SIDE */}
          <Card className="shadow-lg h-full flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-5 w-5 text-yellow-600" />
                <h2 className="text-base font-semibold">Input & Filters</h2>
              </div>
              
              <div className="flex gap-2 mb-3">
                <Button variant={mode === 'upload' ? 'default' : 'outline'} size="sm" className="flex-1" onClick={() => setMode('upload')}>
                  Upload
                </Button>
                <Button variant={mode === 'manual' ? 'default' : 'outline'} size="sm" className="flex-1" onClick={() => setMode('manual')}>
                  Manual
                </Button>
                <Button variant={mode === 'existing' ? 'default' : 'outline'} size="sm" className="flex-1" onClick={() => setMode('existing')}>
                  Existing
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 text-sm">
              {mode === 'upload' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Dataset File</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input id="dataset-upload" type="file" accept=".csv,.xlsx,.json" onChange={(e) => { setSelectedFile(e.target.files?.[0] ?? null); setError('') }} className="hidden" />
                    <label htmlFor="dataset-upload" className="cursor-pointer flex flex-col items-center">
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click to upload dataset</span>
                    </label>
                  </div>
                  {selectedFile && <p className="text-sm text-green-600 mt-2">✓ {selectedFile.name}</p>}
                </div>
              )}

              {mode === 'manual' && (
                <div className="grid grid-cols-1 gap-3 mb-4">
                  {ALL_TIRE_PARAMETERS.slice(0, 5).map(p => (
                    <Input key={p.key} type="text" placeholder={p.label} value={inputData[p.key] || ''} onChange={(e: any) => { setInputData((prev: any) => ({ ...prev, [p.key]: e.target.value })); setError('') }} />
                  ))}
                </div>
              )}

              {mode === 'existing' && (
                <div className="space-y-2 mb-4">
                  <label className="text-sm font-medium text-gray-700">Select Existing File</label>
                  <select className="border border-gray-300 rounded-lg w-full px-3 py-2 text-sm" value={existingFile || ''} onChange={(e) => { setExistingFile(e.target.value); setError('') }}>
                    <option value="">-- Choose File --</option>
                    {mockExistingFiles.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-700 font-medium">Select Parameters ({selectedParams.length})</div>
                  <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                    {showFilters ? 'Hide' : 'Show'}
                  </Button>
                </div>

                {showFilters && (
                  <div className="border border-gray-200 p-3 rounded-lg max-h-64 overflow-y-auto mb-3 bg-gray-50">
                    <div className="grid grid-cols-2 gap-2">
                      {ALL_TIRE_PARAMETERS.map(p => (
                        <label key={p.key} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1 rounded">
                          <input type="checkbox" checked={selectedParams.includes(p.key)} onChange={() => {
                            setSelectedParams(prev => prev.includes(p.key) ? prev.filter(k => k !== p.key) : [...prev, p.key])
                            setError('')
                          }} className="rounded" />
                          <span className="text-xs">{p.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                  {ALL_TIRE_PARAMETERS.filter(p => selectedParams.includes(p.key)).map(p => (
                    <FilterPanel key={p.key} filters={[{ ...p, value: filterValues[p.key] }]} onChange={(key: string, val: any) => { setFilterValues((prev: any) => ({ ...prev, [key]: val })); setError('') }} />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t space-y-2">
              {error && <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">{error}</div>}
              
              <div className="flex gap-2">
                <Button onClick={handleStartIterations} disabled={isPredicting || iterations.length > 0} className="flex-1" size="lg">
                  <Play className="h-4 w-4 mr-2" /> Start Iterations
                </Button>
                <Button onClick={handleResetIterations} disabled={iterations.length === 0} variant="outline" size="lg">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              {iterations.length > 0 && (
                <Button onClick={handleNextIteration} disabled={isPredicting} className="w-full" size="lg" variant="outline">
                  <SkipForward className="h-4 w-4 mr-2" /> Next Iteration
                </Button>
              )}
            </div>
          </Card>

          {/* RIGHT SIDE */}
          <Card className="shadow-lg h-full flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-yellow-600" />
                  <h2 className="text-base font-semibold">
                    {currentResult ? `Iteration ${currentResult.id} Results` : 'Prediction Results'}
                  </h2>
                </div>
                
                {iterations.length > 1 && (
                  <div className="flex items-center gap-2">
                    <Button onClick={() => handleNavigateIteration('prev')} disabled={currentIterationIndex <= 0} variant="ghost" size="sm">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-600 min-w-[80px] text-center">
                      {currentIterationIndex + 1} / {iterations.length}
                    </span>
                    <Button onClick={() => handleNavigateIteration('next')} disabled={currentIterationIndex >= iterations.length - 1} variant="ghost" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto text-sm">
              <AnimatePresence mode="wait">
                {isPredicting ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-10">
                    <Loading size="lg" className="mx-auto mb-4" />
                    <p className="text-gray-600">Running AI prediction analysis...</p>
                    <p className="text-sm text-gray-500 mt-2">Iteration {iterations.length + 1}</p>
                  </motion.div>
                ) : currentResult ? (
                  <motion.div key={currentResult.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-blue-700">ITERATION {currentResult.id}</span>
                        <span className="text-xs text-blue-600">{currentResult.timestamp}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-xs text-gray-600">Temperature</div>
                          <div className="text-lg font-bold text-blue-700">{currentResult.results.predictedTemperature}°C</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Confidence</div>
                          <div className="text-lg font-bold text-green-600">{currentResult.results.confidence}%</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="whitespace-pre-wrap font-mono text-xs text-gray-800 bg-gray-50 p-4 rounded-lg border">
                      {currentResult.results.rawReportText}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10 text-gray-500">
                    <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Click "Start Iterations" to begin analysis</p>
                    <p className="text-sm mt-2">Results will appear here with iteration tracking</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-4 border-t flex gap-2">
              <Button onClick={handleDownloadReport} disabled={!currentResult} className="flex-1" size="lg">
                <Download className="h-4 w-4 mr-2" /> Download Report
              </Button>
              {iterations.length > 1 && (
                <Button onClick={handleDownloadAllReports} variant="outline" size="lg">
                  Download All
                </Button>
              )}
              <Button variant="outline" size="lg" onClick={() => {
                if (currentResult) navigator.clipboard.writeText(currentResult.results.rawReportText)
              }} disabled={!currentResult}>
                Copy
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}