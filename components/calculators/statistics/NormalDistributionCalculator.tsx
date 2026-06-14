'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

function erf(x: number): number {
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911
  const sign = x >= 0 ? 1 : -1
  x = Math.abs(x)
  const t = 1 / (1 + p*x)
  const y = 1 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*Math.exp(-x*x)
  return sign * y
}

function normalCDF(z: number): number { return 0.5 * (1 + erf(z / Math.sqrt(2))) }

export default function NormalDistributionCalculator() {
  const [mode, setMode] = useState<'zscore' | 'prob'>('zscore')
  const [mean, setMean] = useState('0')
  const [std, setStd] = useState('1')
  const [x, setX] = useState('1.96')
  const [result, setResult] = useState('')

  const calculate = () => {
    const m = parseFloat(mean), s = parseFloat(std), xv = parseFloat(x)
    if (isNaN(m)||isNaN(s)||isNaN(xv) || s<=0) { setResult('Invalid'); return }
    if (mode === 'zscore') {
      const z = (xv - m) / s
      const prob = normalCDF(z)
      setResult(`z = ${z.toFixed(4)}, P(Z≤z) = ${prob.toFixed(6)}`)
    } else {
      const z = xv
      const prob = normalCDF(z)
      setResult(`P(Z≤${z}) = ${prob.toFixed(6)}`)
    }
  }

  return (
    <FormCalculatorShell title="Normal Distribution" badge="STATISTICS">
      <RetroSelect label="Mode" value={mode} onChange={(v) => { setMode(v as any); setResult('') }} options={[{value:'zscore',label:'X → Z-Score & Prob'},{value:'prob',label:'Z → Probability'}]} id="norm-mode" />
      {mode === 'zscore' && <><RetroInput label="Mean (μ)" value={mean} onChange={setMean} placeholder="0" id="norm-m" /><RetroInput label="Std Dev (σ)" value={std} onChange={setStd} placeholder="1" id="norm-s" /></>}
      <RetroInput label={mode==='zscore' ? 'X value' : 'Z value'} value={x} onChange={setX} placeholder={mode==='zscore'?'1.96':'1.96'} id="norm-x" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Result" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
