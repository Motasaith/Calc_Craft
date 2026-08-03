'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PHCalculator() {
  const [concStr, setConcStr] = useState('0.001')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      ph: 0,
      poh: 0,
      classification: '',
      color: '#22c55e',
      steps: [] as string[]
    }

    const c = parseFloat(concStr)
    if (isNaN(c) || c <= 0) {
      return { ...defaultObj, error: 'Please enter a valid positive H⁺ concentration.' }
    }

    const ph = -Math.log10(c)
    const poh = 14 - ph
    const isAcid = ph < 6.5
    const isNeutral = ph >= 6.5 && ph <= 7.5
    const classification = isNeutral ? 'Neutral' : isAcid ? 'Acidic' : 'Basic (Alkaline)'
    const color = isNeutral ? '#22c55e' : isAcid ? '#ef4444' : '#3b82f6'

    const steps = [
      `Formula: pH = -log₁₀[H⁺]`,
      `pH = -log₁₀(${c}) = ${ph.toFixed(4)}`,
      `pOH = 14 - pH = 14 - ${ph.toFixed(2)} = ${poh.toFixed(4)}`,
      `Classification: ${classification}`
    ]

    return {
      error: null,
      ph,
      poh,
      classification,
      color,
      steps
    }
  }, [concStr])

  return (
    <FormCalculatorShell title="pH Calculator" subtitle="Solve pH, pOH, and acidic/basic properties from H⁺ concentration" badge="CHEMISTRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="H⁺ Concentration (mol/L)" value={concStr} onChange={setConcStr} id="ph-c" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                <ResultDisplay label="pH" value={results.ph.toFixed(2)} large />
                <ResultDisplay label="pOH" value={results.poh.toFixed(2)} />
                <ResultDisplay label="Nature" value={results.classification} />
              </div>

              <div className="rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-4 flex flex-col items-center">
                <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 self-start font-mono">pH Scale Indicator</p>
                <svg
                  width="200"
                  height="60"
                  viewBox="0 0 200 60"
                  className="bg-white rounded-lg p-2 border border-neutral-300"
                  role="img"
                  aria-label={`pH scale from 0 to 14. A pH of ${results.ph.toFixed(2)} is marked, classified as ${results.classification.toLowerCase()}.`}
                >
                  <linearGradient id="phGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#dc2626" />
                    <stop offset="50%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                  <rect x="15" y="20" width="170" height="15" fill="url(#phGrad)" rx="3" />
                  {/* Concentrations above 1 mol/L give a negative pH, which is
                      real — clamp both ends or the marker leaves the bar. */}
                  <circle cx={15 + Math.max(0, Math.min(170, (results.ph / 14) * 170))} cy="27" r="6" fill={results.color} stroke="#fff" strokeWidth="2" />
                  <text x="15" y="47" fontSize="7" fontFamily="monospace" fill="#6b7280">0 (Acid)</text>
                  <text x="100" y="47" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#6b7280">7 (Neutral)</text>
                  <text x="185" y="47" textAnchor="end" fontSize="7" fontFamily="monospace" fill="#6b7280">14 (Base)</text>
                </svg>
              </div>

              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Chemical Steps</p>
                <div className="p-3 bg-neutral-50/50 space-y-1.5 font-mono text-xs text-neutral-800">
                  {results.steps.map((s, i) => <div key={i}>[{i + 1}] {s}</div>)}
                </div>
              </div>
            </>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500 font-mono p-6 text-center">
              {results.error}
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
