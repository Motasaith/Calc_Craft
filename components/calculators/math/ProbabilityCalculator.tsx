'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

function factorial(n: number): number { return n <= 1 ? 1 : n * factorial(n - 1) }
function nCr(n: number, r: number): number { return factorial(n) / (factorial(r) * factorial(n - r)) }

export default function ProbabilityCalculator() {
  const [mode, setMode] = useState<'single' | 'combined' | 'binomial'>('single')
  const [a, setA] = useState(''); const [b, setB] = useState('')
  const [n, setN] = useState(''); const [k, setK] = useState(''); const [p, setP] = useState('')
  const [result, setResult] = useState('')

  const calculate = () => {
    if (mode === 'single') {
      const fav = parseFloat(a), total = parseFloat(b)
      if (isNaN(fav)||isNaN(total) || total <= 0 || fav < 0 || fav > total) { setResult('Invalid'); return }
      setResult(`P = ${(fav/total).toFixed(6)} (${((fav/total)*100).toFixed(2)}%)`)
    } else if (mode === 'combined') {
      const pa = parseFloat(a), pb = parseFloat(b)
      if (isNaN(pa)||isNaN(pb)) { setResult('Invalid'); return }
      const andProb = pa * pb
      const orProb = pa + pb - andProb
      setResult(`P(A∩B) = ${andProb.toFixed(6)}, P(A∪B) = ${orProb.toFixed(6)}`)
    } else {
      const nv = parseInt(n), kv = parseInt(k), pv = parseFloat(p)
      if (isNaN(nv)||isNaN(kv)||isNaN(pv) || nv < 0 || kv < 0 || kv > nv || pv < 0 || pv > 1) { setResult('Invalid'); return }
      const prob = nCr(nv, kv) * Math.pow(pv, kv) * Math.pow(1 - pv, nv - kv)
      setResult(`P(X=${kv}) = ${prob.toFixed(6)} (${(prob*100).toFixed(4)}%)`)
    }
  }

  return (
    <FormCalculatorShell title="Probability Calculator" badge="MATH">
      <RetroSelect label="Mode" value={mode} onChange={(v) => { setMode(v as any); setResult('') }} options={[{value:'single',label:'Single Event'},{value:'combined',label:'Two Events'},{value:'binomial',label:'Binomial'}]} id="prob-mode" />
      {mode === 'single' && <><RetroInput label="Favorable Outcomes" value={a} onChange={setA} placeholder="1" id="prob-fav" /><RetroInput label="Total Outcomes" value={b} onChange={setB} placeholder="6" id="prob-tot" /></>}
      {mode === 'combined' && <><RetroInput label="P(A)" value={a} onChange={setA} placeholder="0.5" id="prob-a" /><RetroInput label="P(B)" value={b} onChange={setB} placeholder="0.3" id="prob-b" /></>}
      {mode === 'binomial' && <><RetroInput label="Trials (n)" value={n} onChange={setN} placeholder="10" id="prob-n" /><RetroInput label="Successes (k)" value={k} onChange={setK} placeholder="3" id="prob-k" /><RetroInput label="P(success)" value={p} onChange={setP} placeholder="0.5" id="prob-p" /></>}
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Probability" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
