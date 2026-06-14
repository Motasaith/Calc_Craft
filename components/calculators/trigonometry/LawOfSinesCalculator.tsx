'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function LawOfSinesCalculator() {
  const [mode, setMode] = useState<'asa' | 'aas'>('asa')
  const [a, setA] = useState('5')
  const [A, setAA] = useState('30')
  const [B, setBB] = useState('60')
  const [result, setResult] = useState<{b:number,c:number,C:number}|null>(null)

  const calculate = () => {
    const av = parseFloat(a), Av = parseFloat(A), Bv = parseFloat(B)
    if (isNaN(av)||isNaN(Av)||isNaN(Bv) || Av<=0 || Bv<=0 || Av+Bv >= 180) { setResult(null); return }
    const Ar = Av * Math.PI / 180, Br = Bv * Math.PI / 180, Cr = Math.PI - Ar - Br
    const b = av * Math.sin(Br) / Math.sin(Ar)
    const c = av * Math.sin(Cr) / Math.sin(Ar)
    setResult({ b, c, C: Cr * 180 / Math.PI })
  }

  return (
    <FormCalculatorShell title="Law of Sines" badge="TRIGONOMETRY">
      <RetroSelect label="Given" value={mode} onChange={(v) => { setMode(v as any); setResult(null) }} options={[{value:'asa',label:'Side a + Angle A + Angle B'},{value:'aas',label:'Angle A + Angle B + Side a'}]} id="los-mode" />
      <RetroInput label="Side a" value={a} onChange={setA} placeholder="5" id="los-a" />
      <div className="grid grid-cols-2 gap-3"><RetroInput label="Angle A (°)" value={A} onChange={setAA} placeholder="30" id="los-A" /><RetroInput label="Angle B (°)" value={B} onChange={setBB} placeholder="60" id="los-B" /></div>
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Solve Triangle</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          <ResultDisplay label="Side b" value={result.b.toFixed(3)} />
          <ResultDisplay label="Side c" value={result.c.toFixed(3)} />
          <ResultDisplay label="Angle C" value={`${result.C.toFixed(2)}°`} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
