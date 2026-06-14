'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function AnovaCalculator() {
  const [groups, setGroups] = useState('12,14,16\n10,12,14\n15,17,19')
  const [result, setResult] = useState<{f:number,ssb:number,ssw:number}|null>(null)

  const calculate = () => {
    const lines = groups.split('\n').map(l => l.split(',').map(Number).filter(n => !isNaN(n))).filter(g => g.length > 0)
    if (lines.length < 2) { setResult(null); return }
    const all = lines.flat()
    const grandMean = all.reduce((a,b) => a+b,0) / all.length
    let ssb = 0, ssw = 0
    for (const g of lines) {
      const gm = g.reduce((a,b) => a+b,0) / g.length
      ssb += g.length * Math.pow(gm - grandMean, 2)
      ssw += g.reduce((s,x) => s + Math.pow(x - gm, 2), 0)
    }
    const dfb = lines.length - 1
    const dfw = all.length - lines.length
    const f = (ssb / dfb) / (ssw / dfw)
    setResult({ f, ssb, ssw })
  }

  return (
    <FormCalculatorShell title="One-Way ANOVA" badge="STATISTICS">
      <RetroInput label="Groups (one per line, comma sep)" value={groups} onChange={setGroups} placeholder="12,14,16\n10,12,14\n15,17,19" id="ano-groups" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          <ResultDisplay label="F-statistic" value={result.f.toFixed(4)} large />
          <ResultDisplay label="SS Between" value={result.ssb.toFixed(2)} />
          <ResultDisplay label="SS Within" value={result.ssw.toFixed(2)} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
