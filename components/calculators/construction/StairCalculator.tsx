'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function StairCalculator() {
  const [totalRise, setTotalRise] = useState('2.6')
  const [totalRun, setTotalRun] = useState('3.5')
  const [result, setResult] = useState<{risers:number,rise:number,run:number,stringer:number}|null>(null)

  const calculate = () => {
    const tr = parseFloat(totalRise), tRun = parseFloat(totalRun)
    if (isNaN(tr)||isNaN(tRun) || tr <= 0 || tRun <= 0) { setResult(null); return }
    let risers = Math.round(tr / 0.18)
    if (risers < 1) risers = 1
    const rise = tr / risers
    const run = tRun / risers
    const stringer = Math.sqrt(Math.pow(tr, 2) + Math.pow(tRun, 2))
    setResult({ risers, rise, run, stringer })
  }

  return (
    <FormCalculatorShell title="Stair Calculator" badge="CONSTRUCTION">
      <RetroInput label="Total Rise (m)" value={totalRise} onChange={setTotalRise} placeholder="2.6" id="stair-rise" />
      <RetroInput label="Total Run (m)" value={totalRun} onChange={setTotalRun} placeholder="3.5" id="stair-run" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="Risers" value={result.risers} />
          <ResultDisplay label="Rise Height" value={`${result.rise.toFixed(3)} m`} />
          <ResultDisplay label="Tread Depth" value={`${result.run.toFixed(3)} m`} />
          <ResultDisplay label="Stringer Length" value={`${result.stringer.toFixed(3)} m`} large />
        </div>
      )}
    </FormCalculatorShell>
  )
}
