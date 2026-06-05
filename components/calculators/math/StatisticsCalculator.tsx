'use client'

import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'
import { evaluate } from '@/lib/calc-engine'

export default function StatisticsCalculator() {
  const [data, setData] = useState('')
  const [result, setResult] = useState<Record<string, string> | null>(null)
  const [error, setError] = useState('')

  const calculate = () => {
    ;(async () => {
      setError(''); setResult(null)
      const nums = data.split(/[,\s]+/).map(Number).filter((n) => !isNaN(n))
      if (nums.length === 0) { setError('Enter at least one number (comma or space separated)'); return }

      const n = nums.length
      const sorted = [...nums].sort((a, b) => a - b)
      const sum = nums.reduce((a, b) => a + b, 0)
      const mean = sum / n

      // Median
      const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)]

      // Mode
      const freq: Record<number, number> = {}
      nums.forEach((v) => { freq[v] = (freq[v] || 0) + 1 })
      const maxFreq = Math.max(...Object.values(freq))
      const modes = Object.keys(freq).filter((k) => freq[Number(k)] === maxFreq).map(Number)
      const modeStr = maxFreq === 1 ? 'No mode' : modes.join(', ')

      // Variance & StdDev — use engine for accurate mean-based calcs
      try {
        const meanExpr = `(${nums.join(' + ')}) / ${n}`
        const mRes = await evaluate(meanExpr)
        if (!mRes.ok) { setError(mRes.error); return }
        const engineMean = mRes.value

        const varExpr = `(${nums.map((v) => `(${v} - ${engineMean})^2`).join(' + ')}) / ${n}`
        const sampleVarExpr = `(${nums.map((v) => `(${v} - ${engineMean})^2`).join(' + ')}) / (${n} - 1)`

        const [popVarRes, popStdRes, sampleVarRes, sampleStdRes] = await Promise.all([
          evaluate(varExpr),
          evaluate(`sqrt((${varExpr.slice(0, -3)}))`), // remove '/ n'
          n > 1 ? evaluate(sampleVarExpr) : Promise.resolve({ ok: true as const, value: 0, formatted: '0' }),
          n > 1 ? evaluate(`sqrt((${sampleVarExpr.slice(0, -6)}))`) : Promise.resolve({ ok: true as const, value: 0, formatted: '0' }),
        ])

        if (!popVarRes.ok) { setError(popVarRes.error); return }
        if (!popStdRes.ok) { setError(popStdRes.error); return }
        if (!sampleVarRes.ok) { setError(sampleVarRes.error); return }
        if (!sampleStdRes.ok) { setError(sampleStdRes.error); return }

        const range = sorted[n - 1] - sorted[0]

        setResult({
          Count: n.toString(),
          Sum: parseFloat(sum.toFixed(6)).toString(),
          Mean: popVarRes.formatted, // not used; overwritten below
          Median: parseFloat(median.toFixed(6)).toString(),
          Mode: modeStr,
          Range: parseFloat(range.toFixed(6)).toString(),
          'Pop. Std Dev': popStdRes.formatted,
          'Pop. Variance': popVarRes.formatted,
          'Sample Std Dev': n > 1 ? sampleStdRes.formatted : 'N/A',
          'Sample Variance': n > 1 ? sampleVarRes.formatted : 'N/A',
          Min: sorted[0].toString(),
          Max: sorted[n - 1].toString(),
        })
        // Fix Mean
        setResult((prev) => prev ? { ...prev, Mean: parseFloat(mean.toFixed(6)).toString() } : prev)
      } catch (err) { setError('Error') }
    })()
  }

  return (
    <FormCalculatorShell title="Statistics Calculator" subtitle="Mean, Median, Mode, Std Dev" badge="MATH">
      <div className="mb-3">
        <label htmlFor="stats-data" className="block text-[11px] font-bold text-neutral-600 font-mono uppercase tracking-wider mb-1.5">
          Enter Numbers (comma or space separated)
        </label>
        <textarea
          id="stats-data"
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder="e.g. 4, 8, 15, 16, 23, 42"
          rows={3}
          className="w-full px-3 py-2 bg-[#fcfbfa] border-2 border-neutral-300 rounded-lg text-sm font-mono font-bold text-neutral-800 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-400 transition-all shadow-inner resize-none placeholder:text-neutral-400"
        />
      </div>

      <RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate Statistics</RetroActionButton>
      {error && <div className="mt-3 text-xs font-mono text-red-600 text-center font-bold">{error}</div>}

      {result && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {Object.entries(result).map(([k, v]) => (
            <ResultDisplay key={k} label={k} value={v} />
          ))}
        </div>
      )}
    </FormCalculatorShell>
  )
}
