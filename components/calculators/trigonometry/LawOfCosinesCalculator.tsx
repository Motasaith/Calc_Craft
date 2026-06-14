'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function LawOfCosinesCalculator() {
  const [mode, setMode] = useState<'sas' | 'sss'>('sas')
  const [a, setA] = useState('5')
  const [b, setB] = useState('7')
  const [c, setC] = useState('8')
  const [angle, setAngle] = useState('60')
  const [result, setResult] = useState('')

  const calculate = () => {
    if (mode === 'sas') {
      const av = parseFloat(a), bv = parseFloat(b), ang = parseFloat(angle)
      if (isNaN(av)||isNaN(bv)||isNaN(ang)) { setResult('Invalid'); return }
      const rad = ang * Math.PI / 180
      const cv = Math.sqrt(av*av + bv*bv - 2*av*bv*Math.cos(rad))
      setResult(`c = ${cv.toFixed(4)}`)
    } else {
      const av = parseFloat(a), bv = parseFloat(b), cv = parseFloat(c)
      if (isNaN(av)||isNaN(bv)||isNaN(cv) || av<=0||bv<=0||cv<=0) { setResult('Invalid'); return }
      const C = Math.acos((av*av + bv*bv - cv*cv) / (2*av*bv)) * 180 / Math.PI
      setResult(`Angle C = ${C.toFixed(2)}°`)
    }
  }

  return (
    <FormCalculatorShell title="Law of Cosines" badge="TRIGONOMETRY">
      <RetroSelect label="Given" value={mode} onChange={(v) => { setMode(v as any); setResult('') }} options={[{value:'sas',label:'SAS (2 sides + included angle)'},{value:'sss',label:'SSS (3 sides)'}]} id="loc-mode" />
      <div className="grid grid-cols-2 gap-3"><RetroInput label="Side a" value={a} onChange={setA} placeholder="5" id="loc-a" /><RetroInput label="Side b" value={b} onChange={setB} placeholder="7" id="loc-b" /></div>
      {mode === 'sas' ? <RetroInput label="Included Angle (°)" value={angle} onChange={setAngle} placeholder="60" id="loc-ang" /> :
      <RetroInput label="Side c" value={c} onChange={setC} placeholder="8" id="loc-c" />}
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Solve</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Result" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
