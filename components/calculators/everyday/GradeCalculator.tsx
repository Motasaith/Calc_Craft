'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function GradeCalculator() {
  const [grades, setGrades] = useState('90,85,78,92,88')
  const [weights, setWeights] = useState('20,20,20,20,20')
  const [result, setResult] = useState<{average:number,weighted:number,letter:string}|null>(null)

  const calculate = () => {
    const g = grades.split(/[,\s]+/).map(Number).filter(n=>!isNaN(n))
    const w = weights.split(/[,\s]+/).map(Number).filter(n=>!isNaN(n))
    if (g.length === 0) { setResult(null); return }
    const avg = g.reduce((a,b)=>a+b,0)/g.length
    let weighted = avg
    if (w.length === g.length) {
      const totalW = w.reduce((a,b)=>a+b,0)
      weighted = g.reduce((sum,gr,i)=>sum+gr*(w[i]||0),0)/totalW
    }
    let letter = 'F'
    if (weighted >= 90) letter = 'A'
    else if (weighted >= 80) letter = 'B'
    else if (weighted >= 70) letter = 'C'
    else if (weighted >= 60) letter = 'D'
    setResult({ average: avg, weighted, letter })
  }

  return (
    <FormCalculatorShell title="Grade Calculator" badge="EVERYDAY">
      <RetroInput label="Grades (comma separated)" value={grades} onChange={setGrades} placeholder="90,85,78,92,88" id="grade-grades" />
      <RetroInput label="Weights (comma separated, optional)" value={weights} onChange={setWeights} placeholder="20,20,20,20,20" id="grade-weights" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          <ResultDisplay label="Average" value={result.average.toFixed(2)} />
          <ResultDisplay label="Weighted" value={result.weighted.toFixed(2)} large />
          <ResultDisplay label="Letter Grade" value={result.letter} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
