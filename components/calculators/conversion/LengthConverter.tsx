'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'
import { convertUnits } from '@/lib/calc-engine'
import { RefreshCw } from 'lucide-react'

const units = ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi', 'nmi', 'μm']
const unitLabels: Record<string, string> = {
  
  mm: 'mm (Millimeter)', cm: 'cm (Centimeter)', m: 'm (Meter)', km: 'km (Kilometer)',
  in: 'in (Inch)', ft: 'ft (Foot)', yd: 'yd (Yard)', mi: 'mi (Mile)',
  nmi: 'nmi (Nautical Mile)', 'μm': 'μm (Micrometer)',

}

export default function LengthConverter() {
  const [valueStr, setValueStr] = useState('1')
  const [fromUnit, setFromUnit] = useState(units[0])
  const [toUnit, setToUnit] = useState(units[1] || units[0])

  const value = parseFloat(valueStr)
  const isValid = !isNaN(value)

  // Single conversion result
  const singleResult = useMemo(() => {
    if (!isValid) return 0
    return convertUnits(value, fromUnit, toUnit, 'length')
  }, [value, fromUnit, toUnit, isValid])

  // Conversion to all other units
  const allConversions = useMemo(() => {
    if (!isValid) return []
    return units.map(u => {
      const converted = convertUnits(value, fromUnit, u, 'length')
      return {
        unit: u,
        label: unitLabels[u] || u,
        val: converted
      }
    })
  }, [value, fromUnit, isValid])

  // SVG representation: relative gauge comparison (compared to base unit)
  const chartData = useMemo(() => {
    if (!isValid || allConversions.length === 0) return []
    const referenceUnits = units.slice(0, 6)
    const baseVal = 1
    return referenceUnits.map((u) => {
      const baseConvVal = convertUnits(baseVal, u, units[0], 'length')
      return {
        unit: u,
        label: unitLabels[u] || u,
        baseConvVal,
        pct: Math.min(100, Math.max(2, (baseConvVal / 1) * 100))
      }
    })
  }, [isValid])

  const swapUnits = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
  }

  return (
    <FormCalculatorShell title="Length Converter" subtitle="Convert between different units of length" badge="CONVERSION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        
        {/* ── Left Column: Inputs ── */}
        <div className="space-y-4">
          <RetroInput
            label="Value to Convert"
            value={valueStr}
            onChange={setValueStr}
            placeholder="1.0"
            id="len-val"
          />

          <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-end">
            <RetroSelect
              label="From"
              value={fromUnit}
              onChange={setFromUnit}
              options={units.map(u => ({ value: u, label: unitLabels[u] || u }))}
              id="len-from"
            />
            <button
              onClick={swapUnits}
              className="mb-1 p-2.5 bg-neutral-200 hover:bg-neutral-300 rounded-lg border border-neutral-350 transition"
              title="Swap Units"
            >
              <RefreshCw className="w-4 h-4 text-neutral-600" />
            </button>
            <RetroSelect
              label="To"
              value={toUnit}
              onChange={setToUnit}
              options={units.map(u => ({ value: u, label: unitLabels[u] || u }))}
              id="len-to"
            />
          </div>

          {isValid && (
            <div className="mt-2">
              <ResultDisplay
                label={`${value} ${fromUnit} equals`}
                value={`${singleResult.toLocaleString('en-US', { maximumFractionDigits: 6 })} ${toUnit}`}
                large
              />
            </div>
          )}
        </div>

        {/* ── Right Column: All Conversions Table & Visuals ── */}
        <div className="min-h-[440px] space-y-4">
          {isValid && allConversions.length > 0 ? (
            <div className="space-y-4">
              
              {/* Full breakdown table */}
              <div className="overflow-x-auto rounded-xl border border-neutral-300 bg-white/60">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="bg-neutral-200 border-b border-neutral-350 text-[9px] font-bold uppercase tracking-wider text-neutral-600">
                      <th className="px-3 py-2">Unit</th>
                      <th className="px-3 py-2 text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {allConversions.map(item => (
                      <tr key={item.unit} className={item.unit === toUnit ? 'bg-[#cbd8ca]/30' : 'hover:bg-neutral-100'}>
                        <td className="px-3 py-2.5 font-bold text-neutral-800">{item.label}</td>
                        <td className="px-3 py-2.5 text-right font-extrabold text-neutral-900">
                          {item.val.toLocaleString('en-US', { maximumFractionDigits: 8 })} <small className="text-neutral-500">{item.unit}</small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Comparative visual bar chart */}
              {chartData.length > 0 && (
                <div className="rounded-xl border border-neutral-350 bg-[#cbd8ca]/30 p-4">
                  <p className="mb-3 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">
                    Relative Scale (Compared to 1 {units[0]})
                  </p>
                  <div className="space-y-2">
                    {chartData.map((bar, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-neutral-600">
                          <span>1 {bar.unit}</span>
                          <span>{bar.baseConvVal.toLocaleString(undefined, { maximumFractionDigits: 4 })} {units[0]}</span>
                        </div>
                        <div className="h-2 w-full bg-neutral-200 rounded overflow-hidden">
                          <div
                            className="h-full bg-[#4c5c4a] rounded"
                            style={{ width: `${bar.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500 font-mono p-6 text-center">
              Enter a valid number to see conversions to all other units.
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
