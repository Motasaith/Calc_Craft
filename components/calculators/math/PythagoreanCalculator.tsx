'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function PythagoreanCalculator() {
  const [mode, setMode] = useState<'hypotenuse' | 'leg'>('hypotenuse')
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [c, setC] = useState('')
  const [result, setResult] = useState('')

  const calculate = () => {
    if (mode === 'hypotenuse') {
      const av = parseFloat(a), bv = parseFloat(b)
      if (isNaN(av) || isNaN(bv) || av <= 0 || bv <= 0) { setResult('Enter valid positive numbers'); return }
      const hyp = Math.sqrt(av * av + bv * bv)
      setResult(`c = ${hyp.toFixed(4)}`)
    } else {
      const cv = parseFloat(c), av = parseFloat(a)
      if (isNaN(cv) || isNaN(av) || cv <= 0 || av <= 0) { setResult('Enter valid positive numbers'); return }
      if (av >= cv) { setResult('Leg must be shorter than hypotenuse'); return }
      const leg = Math.sqrt(cv * cv - av * av)
      setResult(`b = ${leg.toFixed(4)}`)
    }
  }

  return (
    <FormCalculatorShell title="Pythagorean Theorem" badge="MATH">
      <div className="flex gap-1 mb-4 bg-neutral-200 p-1 rounded-lg border border-neutral-300">
        <button onClick={() => { setMode('hypotenuse'); setResult('') }} className={`flex-1 py-1.5 text-[10px] font-bold font-mono rounded-md transition-all ${mode === 'hypotenuse' ? 'bg-[#fcfbfa] shadow text-neutral-800 border border-neutral-300' : 'text-neutral-500'}`}>Find Hypotenuse</button>
        <button onClick={() => { setMode('leg'); setResult('') }} className={`flex-1 py-1.5 text-[10px] font-bold font-mono rounded-md transition-all ${mode === 'leg' ? 'bg-[#fcfbfa] shadow text-neutral-800 border border-neutral-300' : 'text-neutral-500'}`}>Find Leg</button>
      </div>
      {mode === 'hypotenuse' ? (
        <>
          <RetroInput label="Side a" value={a} onChange={setA} placeholder="3" id="py-a" />
          <RetroInput label="Side b" value={b} onChange={setB} placeholder="4" id="py-b" />
        </>
      ) : (
        <>
          <RetroInput label="Hypotenuse c" value={c} onChange={setC} placeholder="5" id="py-c" />
          <RetroInput label="Known Leg a" value={a} onChange={setA} placeholder="3" id="py-a2" />
        </>
      )}
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Result" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
