'use client'

import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function QuadraticCalculator() {
  const [a, setA] = useState(''); const [b, setB] = useState(''); const [c, setC] = useState('')
  const [result, setResult] = useState<{ disc: number; x1: string; x2: string; vertex: string } | null>(null)
  const [error, setError] = useState('')

  const calculate = () => {
    setError(''); setResult(null)
    const av = parseFloat(a), bv = parseFloat(b), cv = parseFloat(c)
    if ([av, bv, cv].some(isNaN)) { setError('Enter valid numbers'); return }
    if (av === 0) { setError('Coefficient a cannot be 0 (not quadratic)'); return }

    const disc = bv * bv - 4 * av * cv
    const vx = -bv / (2 * av)
    const vy = av * vx * vx + bv * vx + cv

    let x1: string, x2: string
    if (disc > 0) {
      const sq = Math.sqrt(disc)
      x1 = parseFloat(((-bv + sq) / (2 * av)).toFixed(8)).toString()
      x2 = parseFloat(((-bv - sq) / (2 * av)).toFixed(8)).toString()
    } else if (disc === 0) {
      x1 = x2 = parseFloat(vx.toFixed(8)).toString()
    } else {
      const real = parseFloat((-bv / (2 * av)).toFixed(6))
      const imag = parseFloat((Math.sqrt(-disc) / (2 * av)).toFixed(6))
      x1 = `${real} + ${Math.abs(imag)}i`
      x2 = `${real} - ${Math.abs(imag)}i`
    }

    setResult({
      disc,
      x1,
      x2,
      vertex: `(${parseFloat(vx.toFixed(6))}, ${parseFloat(vy.toFixed(6))})`
    })
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
