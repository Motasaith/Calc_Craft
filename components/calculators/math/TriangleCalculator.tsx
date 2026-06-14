'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function TriangleCalculator() {
  const [method, setMethod] = useState<'base-height' | 'three-sides' | 'two-sides-angle'>('base-height')
  const [a, setA] = useState(''); const [b, setB] = useState(''); const [c, setC] = useState('')
  const [h, setH] = useState(''); const [angle, setAngle] = useState('')
  const [result, setResult] = useState('')

  const calculate = () => {
    let area = 0
    if (method === 'base-height') {
      const base = parseFloat(a), height = parseFloat(h)
      if (isNaN(base) || isNaN(height) || base <= 0 || height <= 0) { setResult('Invalid input'); return }
      area = 0.5 * base * height
    } else if (method === 'three-sides') {
      const av = parseFloat(a), bv = parseFloat(b), cv = parseFloat(c)
      if (isNaN(av)||isNaN(bv)||isNaN(cv) || av<=0||bv<=0||cv<=0) { setResult('Invalid input'); return }
      if (av+bv<=cv || av+cv<=bv || bv+cv<=av) { setResult('Invalid triangle sides'); return }
      const s = (av+bv+cv)/2
      area = Math.sqrt(s*(s-av)*(s-bv)*(s-cv))
    } else {
      const av = parseFloat(a), bv = parseFloat(b), ang = parseFloat(angle)
      if (isNaN(av)||isNaN(bv)||isNaN(ang) || av<=0||bv<=0) { setResult('Invalid input'); return }
      area = 0.5 * av * bv * Math.sin(ang * Math.PI / 180)
    }
    setResult(`Area = ${area.toFixed(4)}`)
  }

  return (
    <FormCalculatorShell title="Triangle Calculator" badge="MATH">
      <RetroSelect label="Method" value={method} onChange={(v) => { setMethod(v as any); setResult('') }} options={[{value:'base-height',label:'Base × Height'},{value:'three-sides',label:'3 Sides (Heron)'},{value:'two-sides-angle',label:'2 Sides + Angle'}]} id="tri-method" />
      {method === 'base-height' && <><RetroInput label="Base" value={a} onChange={setA} placeholder="10" id="tri-base" /><RetroInput label="Height" value={h} onChange={setH} placeholder="5" id="tri-h" /></>}
      {method === 'three-sides' && <><RetroInput label="Side a" value={a} onChange={setA} placeholder="3" id="tri-a" /><RetroInput label="Side b" value={b} onChange={setB} placeholder="4" id="tri-b" /><RetroInput label="Side c" value={c} onChange={setC} placeholder="5" id="tri-c" /></>}
      {method === 'two-sides-angle' && <><RetroInput label="Side a" value={a} onChange={setA} placeholder="5" id="tri-a2" /><RetroInput label="Side b" value={b} onChange={setB} placeholder="7" id="tri-b2" /><RetroInput label="Included Angle (°)" value={angle} onChange={setAngle} placeholder="60" id="tri-ang" /></>}
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Result" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
