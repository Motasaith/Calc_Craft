'use client'

import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'
import { evaluate } from '@/lib/calc-engine'

export default function QuadraticCalculator() {
  const [a, setA] = useState(''); const [b, setB] = useState(''); const [c, setC] = useState('')
  const [result, setResult] = useState<{ disc: number; x1: string; x2: string; vertex: string } | null>(null)
  const [error, setError] = useState('')

  const calculate = () => {
    ;(async () => {
      setError(''); setResult(null)
      const av = parseFloat(a), bv = parseFloat(b), cv = parseFloat(c)
      if ([av, bv, cv].some(isNaN)) { setError('Enter valid numbers'); return }
      if (av === 0) { setError('Coefficient a cannot be 0 (not quadratic)'); return }

      try {
        const discExpr = `(${bv})^2 - 4 * (${av}) * (${cv})`
        const discRes = await evaluate(discExpr)
        if (!discRes.ok) { setError(discRes.error); return }
        const disc = discRes.value

        const vxRes = await evaluate(`-(${bv}) / (2 * (${av}))`)
        if (!vxRes.ok) { setError(vxRes.error); return }
        const vx = vxRes.value
        const vyRes = await evaluate(`(${av}) * (${vx})^2 + (${bv}) * (${vx}) + (${cv})`)
        if (!vyRes.ok) { setError(vyRes.error); return }
        const vy = vyRes.value

        const x1Expr = `(-(${bv}) + sqrt(${disc})) / (2 * (${av}))`
        const x2Expr = `(-(${bv}) - sqrt(${disc})) / (2 * (${av}))`
        const x1Res = await evaluate(x1Expr)
        const x2Res = await evaluate(x2Expr)
        if (!x1Res.ok || !x2Res.ok) {
          setError(x1Res.ok ? (x2Res as { error: string }).error : (x1Res as { error: string }).error)
          return
        }

        setResult({
          disc,
          x1: x1Res.formatted,
          x2: x2Res.formatted,
          vertex: `(${parseFloat(vx.toFixed(6))}, ${parseFloat(vy.toFixed(6))})`
        })
      } catch (err) { setError('Error') }
    })()
  }

  return (
    <FormCalculatorShell title="Quadratic Equation Solver" subtitle="ax² + bx + c = 0" badge="MATH">
      <div className="grid grid-cols-3 gap-3">
        <RetroInput label="a" value={a} onChange={setA} placeholder="1" id="quad-a" />
        <RetroInput label="b" value={b} onChange={setB} placeholder="-5" id="quad-b" />
        <RetroInput label="c" value={c} onChange={setC} placeholder="6" id="quad-c" />
      </div>

      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Solve</RetroActionButton></div>
      {error && <div className="mt-3 text-xs font-mono text-red-600 text-center font-bold">{error}</div>}

      {result && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <ResultDisplay label="Root x₁" value={result.x1} large />
          <ResultDisplay label="Root x₂" value={result.x2} large />
          <ResultDisplay label="Discriminant" value={parseFloat(result.disc.toFixed(6)).toString()} />
          <ResultDisplay label="Vertex" value={result.vertex} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
