'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function SamplingCalculator() {
  const [population, setPopulation] = useState('10000')
  const [confidence, setConfidence] = useState('95')
  const [margin, setMargin] = useState('5')
  const [p, setP] = useState('0.5')
  const [result, setResult] = useState('')

  const zMap: Record<string,number> = { '90':1.645, '95':1.96, '99':2.576 }

  const calculate = () => {
    const N = parseFloat(population), m = parseFloat(margin)/100, pv = parseFloat(p)
    const z = zMap[confidence] || 1.96
    if (isNaN(N)||isNaN(m)||isNaN(pv) || m<=0 || m>=1) { setResult('Invalid'); return }
    const n0 = (z*z * pv * (1-pv)) / (m*m)
    const n = N > 0 ? Math.ceil((n0 * N) / (n0 + N - 1)) : Math.ceil(n0)
    setResult(`${n.toLocaleString()}`)
  }

  return (
    <FormCalculatorShell title="Sample Size" badge="STATISTICS">
      <RetroInput label="Population (0 = infinite)" value={population} onChange={setPopulation} placeholder="10000" id="sam-n" />
      <RetroSelect label="Confidence" value={confidence} onChange={setConfidence} options={[{value:'90',label:'90%'},{value:'95',label:'95%'},{value:'99',label:'99%'}]} id="sam-c" />
      <RetroInput label="Margin of Error (%)" value={margin} onChange={setMargin} placeholder="5" id="sam-m" />
      <RetroInput label="Expected Proportion" value={p} onChange={setP} placeholder="0.5" id="sam-p" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Required Sample Size" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
