'use client'

import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'
import { calculateCompoundInterest, formatCurrency } from '@/lib/calc-engine'

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('10000')
  const [rate, setRate] = useState('5')
  const [time, setTime] = useState('10')
  const [compound, setCompound] = useState('12')
  const [result, setResult] = useState<{ amount: number; interest: number } | null>(null)

  const calculate = async () => {
    const P = parseFloat(principal), r = parseFloat(rate), t = parseFloat(time), n = parseInt(compound)
    if ([P, r, t, n].some(isNaN) || P <= 0 || r < 0 || t <= 0 || n <= 0) {
      setResult(null); return
    }
    setResult(await calculateCompoundInterest(P, r, t, n))
  }

  // Calculate year-by-year values for dynamic area chart projection
  const chartPoints = React.useMemo(() => {
    const P = parseFloat(principal)
    const r = (parseFloat(rate) || 0) / 100
    const t = parseInt(time) || 0
    const n = parseInt(compound) || 12

    if (isNaN(P) || P <= 0 || isNaN(t) || t <= 0) return []

    const points = []
    for (let y = 0; y <= t; y++) {
      const amt = P * Math.pow(1 + r / n, n * y)
      const interest = amt - P
      points.push({ year: y, amount: amt, interest })
    }
    return points
  }, [principal, rate, time, compound])

  // SVG Chart Projection Coordinates
  const width = 220
  const height = 150
  const paddingLeft = 35
  const paddingRight = 10
  const paddingTop = 15
  const paddingBottom = 20

  const maxVal = chartPoints.length > 0 ? Math.max(...chartPoints.map(p => p.amount)) : 15000
  const minVal = 0

  const getX = (idx: number) => {
    if (chartPoints.length <= 1) return paddingLeft
    return paddingLeft + (idx / (chartPoints.length - 1)) * (width - paddingLeft - paddingRight)
  }

  const getY = (val: number) => {
    return height - paddingBottom - (val / maxVal) * (height - paddingTop - paddingBottom)
  }

  let pathD = ''
  let areaD = ''
  if (chartPoints.length > 0) {
    pathD = `M ${getX(0)} ${getY(chartPoints[0].amount)}`
    areaD = `M ${getX(0)} ${height - paddingBottom}`
    chartPoints.forEach((p, idx) => {
      const x = getX(idx)
      const y = getY(p.amount)
      pathD += ` L ${x} ${y}`
      areaD += ` L ${x} ${y}`
    })
    areaD += ` L ${getX(chartPoints.length - 1)} ${height - paddingBottom} Z`
  }

  return (
    <FormCalculatorShell title="Compound Interest Calculator" badge="FINANCE">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="space-y-3">
          <RetroInput label="Principal Amount" value={principal} onChange={setPrincipal} placeholder="10000" id="ci-p" unit="$" />
          <div className="grid grid-cols-2 gap-3">
            <RetroInput label="Annual Rate" value={rate} onChange={setRate} placeholder="5" id="ci-r" unit="%" />
            <RetroInput label="Time Period" value={time} onChange={setTime} placeholder="10" id="ci-t" unit="years" />
          </div>
          <RetroSelect label="Compounding" value={compound} onChange={setCompound} id="ci-c"
            options={[{ value: '1', label: 'Annually' }, { value: '2', label: 'Semi-Annually' }, { value: '4', label: 'Quarterly' }, { value: '12', label: 'Monthly' }, { value: '365', label: 'Daily' }]} />
          <div className="pt-2">
            <RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton>
          </div>
        </div>

        {/* Dynamic Area growth projection chart */}
        <div className="flex flex-col justify-center items-center bg-[#cbd8ca]/30 border border-neutral-300 rounded-xl p-2 h-[210px] w-full">
          <span className="text-[9px] font-bold text-neutral-600 font-mono mb-1 uppercase tracking-wider">Growth Projection</span>
          <svg width="100%" height="150" viewBox={`0 0 ${width} ${height}`} className="drop-shadow-sm select-none">
            <defs>
              <pattern id="chartGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
              </pattern>
              <linearGradient id="growthGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4c5c4a" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#cbd8ca" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <rect width={width} height={height} fill="url(#chartGrid)" rx="6" />

            {/* Y Axis Gridlines & Labels */}
            <line x1={paddingLeft} y1={paddingTop} x2={paddingLeft} y2={height - paddingBottom} stroke="#9ca3af" strokeWidth="1.5" />
            <line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} stroke="#9ca3af" strokeWidth="1.5" />
            
            <text x={paddingLeft - 5} y={getY(maxVal)} fill="#4b5563" fontSize="8" fontFamily="monospace" textAnchor="end" dominantBaseline="middle">
              ${Math.round(maxVal / 1000)}k
            </text>
            <text x={paddingLeft - 5} y={getY(maxVal / 2)} fill="#4b5563" fontSize="8" fontFamily="monospace" textAnchor="end" dominantBaseline="middle">
              ${Math.round(maxVal / 2000)}k
            </text>
            <text x={paddingLeft - 5} y={height - paddingBottom} fill="#4b5563" fontSize="8" fontFamily="monospace" textAnchor="end" dominantBaseline="middle">
              $0
            </text>

            {/* Area & Line */}
            {chartPoints.length > 0 && (
              <>
                <path d={areaD} fill="url(#growthGrad)" />
                <path d={pathD} fill="none" stroke="#4c5c4a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* End Point Indicator */}
                <circle cx={getX(chartPoints.length - 1)} cy={getY(chartPoints[chartPoints.length - 1].amount)} r="4.5" fill="#4c5c4a" stroke="white" strokeWidth="1.5" />
              </>
            )}

            {/* X Axis Labels */}
            {chartPoints.length > 0 && (
              <>
                <text x={getX(0)} y={height - 6} fill="#4b5563" fontSize="8" fontFamily="monospace" textAnchor="middle">
                  Yr 0
                </text>
                <text x={getX(chartPoints.length - 1)} y={height - 6} fill="#4b5563" fontSize="8" fontFamily="monospace" textAnchor="middle">
                  Yr {chartPoints[chartPoints.length - 1].year}
                </text>
              </>
            )}
          </svg>
        </div>
      </div>

      {result && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <ResultDisplay label="Final Amount" value={formatCurrency(result.amount)} large />
          <ResultDisplay label="Interest Earned" value={formatCurrency(result.interest)} large />
        </div>
      )}
    </FormCalculatorShell>
  )
}
