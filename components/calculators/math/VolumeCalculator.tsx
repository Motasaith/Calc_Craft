'use client'

import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'
import { evaluate } from '@/lib/calc-engine'

const shapes = [
  { value: 'cube', label: 'Cube' },
  { value: 'sphere', label: 'Sphere' },
  { value: 'cylinder', label: 'Cylinder' },
  { value: 'cone', label: 'Cone' },
  { value: 'pyramid', label: 'Rectangular Pyramid' },
  { value: 'prism', label: 'Rectangular Prism' },
]

export default function VolumeCalculator() {
  const [shape, setShape] = useState('cube')
  const [vals, setVals] = useState<Record<string, string>>({})
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setVals({ ...vals, [k]: v })
  const g = (k: string) => parseFloat(vals[k] || '0')

  const calculate = () => {
    ;(async () => {
      setError(''); setResult(null)
      try {
        let expr = '0'
        switch (shape) {
          case 'cube': {
            const s = g('side')
            if (s <= 0) { setError('Side must be positive'); return }
            expr = `(${s})^3`
            break
          }
          case 'sphere': {
            const r = g('radius')
            if (r <= 0) { setError('Radius must be positive'); return }
            expr = `(4/3) * pi * (${r})^3`
            break
          }
          case 'cylinder': {
            const r = g('radius'), h = g('height')
            if (r <= 0 || h <= 0) { setError('Dimensions must be positive'); return }
            expr = `pi * (${r})^2 * (${h})`
            break
          }
          case 'cone': {
            const r = g('radius'), h = g('height')
            if (r <= 0 || h <= 0) { setError('Dimensions must be positive'); return }
            expr = `(1/3) * pi * (${r})^2 * (${h})`
            break
          }
          case 'pyramid': {
            const l = g('length'), w = g('width'), h = g('height')
            if (l <= 0 || w <= 0 || h <= 0) { setError('Dimensions must be positive'); return }
            expr = `(1/3) * (${l}) * (${w}) * (${h})`
            break
          }
          case 'prism': {
            const l = g('length'), w = g('width'), h = g('height')
            if (l <= 0 || w <= 0 || h <= 0) { setError('Dimensions must be positive'); return }
            expr = `(${l}) * (${w}) * (${h})`
            break
          }
        }
        const res = await evaluate(expr)
        if (!res.ok) { setError(res.error); return }
        setResult(res.formatted)
      } catch (err) { setError('Error') }
    })()
  }

  const renderInputs = () => {
    switch (shape) {
      case 'cube': return <RetroInput label="Side Length" value={vals.side || ''} onChange={(v) => set('side', v)} id="vol-s" />
      case 'sphere': return <RetroInput label="Radius" value={vals.radius || ''} onChange={(v) => set('radius', v)} id="vol-r" />
      case 'cylinder': case 'cone': return (<><RetroInput label="Radius" value={vals.radius || ''} onChange={(v) => set('radius', v)} id="vol-r2" /><RetroInput label="Height" value={vals.height || ''} onChange={(v) => set('height', v)} id="vol-h" /></>)
      case 'pyramid': case 'prism': return (<><RetroInput label="Length" value={vals.length || ''} onChange={(v) => set('length', v)} id="vol-l" /><RetroInput label="Width" value={vals.width || ''} onChange={(v) => set('width', v)} id="vol-w" /><RetroInput label="Height" value={vals.height || ''} onChange={(v) => set('height', v)} id="vol-h2" /></>)
    }
  }

  return (
    <FormCalculatorShell title="Volume Calculator" badge="MATH">
      <RetroSelect label="Shape" value={shape} onChange={(v) => { setShape(v); setVals({}); setResult(null) }} options={shapes} id="vol-shape" />
      {renderInputs()}
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate Volume</RetroActionButton></div>
      {error && <div className="mt-3 text-xs font-mono text-red-600 text-center font-bold">{error}</div>}
      {result && <div className="mt-4"><ResultDisplay label={`Volume of ${shape}`} value={result} unit="cu units" large /></div>}
    </FormCalculatorShell>
  )
}
