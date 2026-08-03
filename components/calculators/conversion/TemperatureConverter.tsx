'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'
import { convertTemperature } from '@/lib/calc-engine'

type TempUnit = 'C' | 'F' | 'K'

export default function TemperatureConverter() {
  const [valueStr, setValueStr] = useState('100')
  const [fromUnit, setFromUnit] = useState<TempUnit>('C')

  const value = parseFloat(valueStr)
  const isValid = !isNaN(value)

  // Convert to all units
  const results = useMemo(() => {
    if (!isValid) return null

    const celsius = convertTemperature(value, fromUnit, 'C')
    const fahrenheit = convertTemperature(value, fromUnit, 'F')
    const kelvin = convertTemperature(value, fromUnit, 'K')

    // Map Celsius value to a thermometer percentage (range: -50°C to 150°C)
    // absolute zero will clamp at 0%
    const minC = -50
    const maxC = 150
    const rawPct = ((celsius - minC) / (maxC - minC)) * 100
    const pct = Math.min(100, Math.max(0, rawPct))

    return {
      celsius,
      fahrenheit,
      kelvin,
      pct
    }
  }, [value, fromUnit, isValid])

  return (
    <FormCalculatorShell title="Temperature Unit Converter" subtitle="Convert between Celsius, Fahrenheit, and Kelvin scales" badge="CONVERSION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        
        {/* ── Left Column: Inputs ── */}
        <div className="space-y-4">
          <RetroInput
            label="Value to Convert"
            value={valueStr}
            onChange={setValueStr}
            placeholder="100.0"
            id="temp-val"
          />

          <RetroSelect
            label="From Scale"
            value={fromUnit}
            onChange={(v) => setFromUnit(v as TempUnit)}
            id="temp-from"
            options={[
              { value: 'C', label: 'Celsius (°C)' },
              { value: 'F', label: 'Fahrenheit (°F)' },
              { value: 'K', label: 'Kelvin (K)' }
            ]}
          />
        </div>

        {/* ── Right Column: Results & Thermometer Visual ── */}
        <div className="min-h-[440px]">
          {isValid && results ? (
            <div className="space-y-4">
              
              {/* Output grid */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                <ResultDisplay
                  label="Celsius"
                  value={`${results.celsius.toFixed(2)} °C`}
                  large={fromUnit !== 'C'}
                />
                <ResultDisplay
                  label="Fahrenheit"
                  value={`${results.fahrenheit.toFixed(2)} °F`}
                  large={fromUnit !== 'F'}
                />
                <ResultDisplay
                  label="Kelvin"
                  value={`${results.kelvin.toFixed(2)} K`}
                  large={fromUnit !== 'K'}
                />
              </div>

              {/* Thermometer SVG Widget */}
              <div className="rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-4 flex gap-6 items-center">
                {/* Visual Thermometer */}
                <div className="relative flex items-center justify-center pt-2">
                  <svg viewBox="0 0 50 150" className="w-16 h-48" role="img" aria-label="A thermometer illustrating the relative hot/cold level of the converted temperature.">
                    {/* Thermometer tube background */}
                    <rect x="21" y="10" width="8" height="110" rx="4" fill="#cbd8ca" stroke="#b0bdae" strokeWidth="1.5" />
                    {/* Bulb background */}
                    <circle cx="25" cy="125" r="14" fill="#cbd8ca" stroke="#b0bdae" strokeWidth="1.5" />

                    {/* Active mercury column (mapped level) */}
                    {/* height is y-axis based: y goes from 110 (0% or -50C) to 10 (100% or 150C) */}
                    {/* y coordinate = 110 - (results.pct * 1.0) */}
                    <rect
                      x="23"
                      y={110 - results.pct}
                      width="4"
                      height={results.pct + 10}
                      fill="#b5655c"
                    />
                    <circle cx="25" cy="125" r="11" fill="#b5655c" />
                  </svg>
                </div>

                {/* Benchmarks List */}
                <div className="flex-1 space-y-2.5 font-mono text-xs text-neutral-700">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">
                    Physical Benchmarks
                  </p>
                  <div className="flex justify-between border-b border-neutral-300/40 pb-1">
                    <span>Absolute Zero</span>
                    <span className="font-bold text-neutral-900">-273.15 °C</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-300/40 pb-1">
                    <span>Water Freezing</span>
                    <span className="font-bold text-neutral-900">0 °C</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-300/40 pb-1">
                    <span>Body Temp</span>
                    <span className="font-bold text-neutral-900">37 °C</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-300/40 pb-1">
                    <span>Water Boiling</span>
                    <span className="font-bold text-neutral-900">100 °C</span>
                  </div>
                </div>
              </div>

              {/* Conversion Formulas Details */}
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">
                  Scale Conversion Formulas
                </p>
                <div className="p-3 bg-neutral-50/50 space-y-2 font-mono text-[11px] text-neutral-800">
                  <div>
                    <span className="font-bold text-neutral-750">Fahrenheit to Celsius:</span>
                    <div className="text-neutral-600">°C = (°F - 32) × 5/9</div>
                  </div>
                  <div>
                    <span className="font-bold text-neutral-750">Celsius to Fahrenheit:</span>
                    <div className="text-neutral-600">°F = (°C × 9/5) + 32</div>
                  </div>
                  <div>
                    <span className="font-bold text-neutral-750">Celsius to Kelvin:</span>
                    <div className="text-neutral-600">K = °C + 273.15</div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500 font-mono p-6 text-center">
              Enter a valid temperature value to see conversions.
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
