'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function MatrixDeterminantCalculator() {
  const [a, setA] = useState('1')
  const [b, setB] = useState('2')
  const [c, setC] = useState('3')
  const [d, setD] = useState('0')
  const [e, setE] = useState('1')
  const [f, setF] = useState('4')
  const [g, setG] = useState('5')
  const [h, setH] = useState('6')
  const [i, setI] = useState('0')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, det: 0 }
    const vA = parseFloat(a)
    const vB = parseFloat(b)
    const vC = parseFloat(c)
    const vD = parseFloat(d)
    const vE = parseFloat(e)
    const vF = parseFloat(f)
    const vG = parseFloat(g)
    const vH = parseFloat(h)
    const vI = parseFloat(i)

    if ([vA, vB, vC, vD, vE, vF, vG, vH, vI].some(isNaN)) {
      return { ...defaultObj, error: 'Please enter valid numerical entries.' }
    }

    const det = vA * (vE * vI - vF * vH) - vB * (vD * vI - vF * vG) + vC * (vD * vH - vE * vG)
    return { error: null, det }
  }, [a, b, c, d, e, f, g, h, i])

  return (
    <FormCalculatorShell title="3x3 Matrix Determinant Solver" subtitle="Calculate determinants of 3x3 square matrices" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-neutral-600 font-mono">Matrix Entries</p>
          <div className="grid grid-cols-3 gap-2 border border-neutral-300 rounded p-3 bg-neutral-50/50">
            <RetroInput label="a" value={a} onChange={setA} id="md-a" />
            <RetroInput label="b" value={b} onChange={setB} id="md-b" />
            <RetroInput label="c" value={c} onChange={setC} id="md-c" />
            <RetroInput label="d" value={d} onChange={setD} id="md-d" />
            <RetroInput label="e" value={e} onChange={setE} id="md-e" />
            <RetroInput label="f" value={f} onChange={setF} id="md-f" />
            <RetroInput label="g" value={g} onChange={setG} id="md-g" />
            <RetroInput label="h" value={h} onChange={setH} id="md-h" />
            <RetroInput label="i" value={i} onChange={setI} id="md-i" />
          </div>
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Determinant (det A)" value={results.det.toString()} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
