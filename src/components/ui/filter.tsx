import { useState } from 'react'
import { motion } from 'framer-motion'
import { Minus, Plus } from 'lucide-react'
import { Button } from './button'

interface FilterProps {
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  unit?: string
  icon?: React.ReactNode
  onChange: (value: number) => void
  className?: string
}

export function Filter({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  icon,
  onChange,
  className = ''
}: FilterProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleDecrease = () => {
    if (value > min) {
      setIsAnimating(true)
      onChange(Math.max(min, value - step))
      setTimeout(() => setIsAnimating(false), 150)
    }
  }

  const handleIncrease = () => {
    if (value < max) {
      setIsAnimating(true)
      onChange(Math.min(max, value + step))
      setTimeout(() => setIsAnimating(false), 150)
    }
  }

  const handleDirectInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) || 0
    if (newValue >= min && newValue <= max) {
      onChange(newValue)
    }
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-gray-700">{label}</span>
        </div>
        <span className="text-sm text-gray-500">
          {min}{unit} - {max}{unit}
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Decrease Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleDecrease}
          disabled={value <= min}
          className="h-10 w-10 p-0 hover:bg-red-50 hover:border-red-200 hover:text-red-600 disabled:opacity-50"
        >
          <Minus className="h-4 w-4" />
        </Button>

        {/* Value Display */}
        <motion.div
          className="flex-1 text-center"
          animate={{ scale: isAnimating ? 1.05 : 1 }}
          transition={{ duration: 0.15 }}
        >
          <input
            type="number"
            value={value}
            onChange={handleDirectInput}
            min={min}
            max={max}
            step={step}
            className="w-full text-2xl font-bold text-gray-900 text-center bg-transparent border-none outline-none focus:ring-0"
          />
          {unit && (
            <div className="text-sm text-gray-500 mt-1">{unit}</div>
          )}
        </motion.div>

        {/* Increase Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleIncrease}
          disabled={value >= max}
          className="h-10 w-10 p-0 hover:bg-green-50 hover:border-green-200 hover:text-green-600 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
            style={{ width: `${((value - min) / (max - min)) * 100}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${((value - min) / (max - min)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  )
}

interface FilterPanelProps {
  filters: Array<{
    key: string
    label: string
    value: number
    min?: number
    max?: number
    step?: number
    unit?: string
    icon?: React.ReactNode
  }>
  onChange: (key: string, value: number) => void
  className?: string
}

export function FilterPanel({ filters, onChange, className = '' }: FilterPanelProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Adjust Parameters</h3>
        <p className="text-sm text-gray-600">Use the controls below to fine-tune your prediction parameters</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filters.map((filter) => (
          <Filter
            key={filter.key}
            label={filter.label}
            value={filter.value}
            min={filter.min}
            max={filter.max}
            step={filter.step}
            unit={filter.unit}
            icon={filter.icon}
            onChange={(value) => onChange(filter.key, value)}
          />
        ))}
      </div>
    </div>
  )
}

