import React from "react"

interface FilterProps {
  filters: {
    key: string
    label: string
    value: number | string
    min: number
    max: number
    step: number
    unit: string
  }[]
  onChange: (key: string, value: number | string) => void
}

export const FilterPanel: React.FC<FilterProps> = ({ filters, onChange }) => {
  return (
    <div className="space-y-4">
      {filters.map((f) => (
        <div key={f.key} className="flex flex-col">
          <label className="text-xs font-medium text-gray-700 mb-1">
            {f.label} {f.unit && <span className="text-gray-400">({f.unit})</span>}
          </label>

          {typeof f.min === "number" && f.max > f.min ? (
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={f.min}
                max={f.max}
                step={f.step}
                value={Number(f.value)}
                onChange={(e) => onChange(f.key, parseFloat(e.target.value))}
                className="flex-1 cursor-pointer accent-blue-500"
              />
              <input
                type="number"
                min={f.min}
                max={f.max}
                step={f.step}
                value={Number(f.value)}
                onChange={(e) => onChange(f.key, parseFloat(e.target.value))}
                className="w-20 border rounded-md text-xs px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>
          ) : (
            <input
              type="text"
              value={f.value}
              onChange={(e) => onChange(f.key, e.target.value)}
              className="border rounded-md text-xs px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          )}
        </div>
      ))}
    </div>
  )
}
