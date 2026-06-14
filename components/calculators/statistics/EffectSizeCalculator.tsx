'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function EffectSizeCalculator() {
  const [mode, setMode] = useState<'cohensd' | 'correlation'>('cohensd')
  const [mean1, setMean1] = useState('100')
  const [mean2, setMean2] = useState('110')
  const [std, setStd] = useState('15')
  const [r, setR] = useState('0.5')
  const [result, setResult] = useState('')

  const calculate = () => {
    if (mode === 'cohensd') {
      const m1 = parseFloat(mean1), m2 = parseFloat(mean2), s = parseFloat(std)
      if (isNaN(m1)||isNaN(m2)||isNaN(s) || s===0) { setResult('Invalid'); return }
      const d = Math.abs(m1 - m2) / s
      let size = d < 0.2 ? 'Negligible' : d < 0.5 ? 'Small' : d < 0.8 ? 'Medium' : 'Large'
      setResult(`d = ${d.toFixed(3)} (${size})`)
    } else {
      const rv = parseFloat(r)
      if (isNaN(rv)) { setResult('Invalid'); return }
      const d = (2 * rv) / Math.sqrt(1 - rv*rv)
      setResult(`d = ${d.toFixed(3)}`)
    }
  }

  return (
    <FormCalculatorShell title="Effect Size" badge="STATISTICS">
      <RetroSelect label="Method" value={mode} onChange={(v) => { setMode(v as any); setResult('') }} options={[{value:'cohensd',label:"Cohen's d"},{value:'correlation',label:'r → d'}]} id="es-mode" />
      {mode === 'cohensd' && <>
        <div className="grid grid-cols-2 gap-3"><RetroInput label="Mean 1" value={mean1} onChange={setMean1} placeholder="100" id="es-m1" /><RetroInput label="Mean 2" value={mean2} onChange={setMean2} placeholder="110" id="es-m2" /></div>
        <RetroInput label="Pooled Std Dev" value={std} onChange={setStd} placeholder="15" id="es-s" />
      </>}
      {mode === 'correlation' && <RetroInput label="Correlation (r)" value={r} onChange={setR} placeholder="0.5" id="es-r" />}
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Effect Size" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
