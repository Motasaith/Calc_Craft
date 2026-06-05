'use client'

import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'
import { evaluate } from '@/lib/calc-engine'

const shapes = [
  { value: 'rectangle', label: 'Rectangle' },
  { value: 'circle', label: 'Circle' },
  { value: 'triangle', label: 'Triangle' },
  { value: 'trapezoid', label: 'Trapezoid' },
  { value: 'ellipse', label: 'Ellipse' },
  { value: 'parallelogram', label: 'Parallelogram' },
  { value: 'rhombus', label: 'Rhombus' },
]

export default function AreaCalculator() {
  const [shape, setShape] = useState('rectangle')
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
          case 'rectangle': {
            const l = g('length'), w = g('width')
            if (l <= 0 || w <= 0) { setError('Dimensions must be positive'); return }
            expr = `${l} * ${w}`; break
          }
          case 'circle': {
            const r = g('radius')
            if (r <= 0) { setError('Radius must be positive'); return }
            expr = `pi * (${r})^2`; break
          }
          case 'triangle': {
            const b = g('base'), h = g('height')
            if (b <= 0 || h <= 0) { setError('Dimensions must be positive'); return }
            expr = `0.5 * (${b}) * (${h})`; break
          }
          case 'trapezoid': {
            const a = g('sideA'), b = g('sideB'), h = g('height')
            if (a <= 0 || b <= 0 || h <= 0) { setError('Dimensions must be positive'); return }
            expr = `0.5 * (${a} + ${b}) * (${h})`; break
          }
          case 'ellipse': {
            const a = g('semiA'), b = g('semiB')
            if (a <= 0 || b <= 0) { setError('Dimensions must be positive'); return }
            expr = `pi * (${a}) * (${b})`; break
          }
          case 'parallelogram': {
            const b = g('base'), h = g('height')
            if (b <= 0 || h <= 0) { setError('Dimensions must be positive'); return }
            expr = `(${b}) * (${h})`; break
          }
          case 'rhombus': {
            const d1 = g('diag1'), d2 = g('diag2')
            if (d1 <= 0 || d2 <= 0) { setError('Diagonals must be positive'); return }
            expr = `0.5 * (${d1}) * (${d2})`; break
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
      case 'rectangle': return (<><RetroInput label="Length" value={vals.length || ''} onChange={(v) => set('length', v)} id="area-l" /><RetroInput label="Width" value={vals.width || ''} onChange={(v) => set('width', v)} id="area-w" /></>)
      case 'circle': return <RetroInput label="Radius" value={vals.radius || ''} onChange={(v) => set('radius', v)} id="area-r" />
      case 'triangle': return (<><RetroInput label="Base" value={vals.base || ''} onChange={(v) => set('base', v)} id="area-b" /><RetroInput label="Height" value={vals.height || ''} onChange={(v) => set('height', v)} id="area-h" /></>)
      case 'trapezoid': return (<><RetroInput label="Side A (top)" value={vals.sideA || ''} onChange={(v) => set('sideA', v)} id="area-a" /><RetroInput label="Side B (bottom)" value={vals.sideB || ''} onChange={(v) => set('sideB', v)} id="area-b2" /><RetroInput label="Height" value={vals.height || ''} onChange={(v) => set('height', v)} id="area-h2" /></>)
      case 'ellipse': return (<><RetroInput label="Semi-major axis (a)" value={vals.semiA || ''} onChange={(v) => set('semiA', v)} id="area-sa" /><RetroInput label="Semi-minor axis (b)" value={vals.semiB || ''} onChange={(v) => set('semiB', v)} id="area-sb" /></>)
      case 'parallelogram': return (<><RetroInput label="Base" value={vals.base || ''} onChange={(v) => set('base', v)} id="area-pb" /><RetroInput label="Height" value={vals.height || ''} onChange={(v) => set('height', v)} id="area-ph" /></>)
      case 'rhombus': return (<><RetroInput label="Diagonal 1" value={vals.diag1 || ''} onChange={(v) => set('diag1', v)} id="area-d1" /><RetroInput label="Diagonal 2" value={vals.diag2 || ''} onChange={(v) => set('diag2', v)} id="area-d2" /></>)
    }
  }

  return (
    <FormCalculatorShell title="Area Calculator" badge="MATH">
      <RetroSelect label="Shape" value={shape} onChange={(v) => { setShape(v); setVals({}); setResult(null) }} options={shapes} id="area-shape" />
      {renderInputs()}
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate Area</RetroActionButton></div>
      {error && <div className="mt-3 text-xs font-mono text-red-600 text-center font-bold">{error}</div>}
      {result && <div className="mt-4"><ResultDisplay label={`Area of ${shape}`} value={result} unit="sq units" large /></div>}
    </FormCalculatorShell>
  )
}
