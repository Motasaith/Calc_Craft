'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function GolfHandicapCalculator() {
  const [scores, setScores] = useState('85,88,82,90,84')
  const [courseRating, setCourseRating] = useState('72')
  const [slope, setSlope] = useState('113')
  const [result, setResult] = useState('')

  const calculate = () => {
    const cr = parseFloat(courseRating), sl = parseFloat(slope)
    const sc = scores.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n))
    if (sc.length === 0 || isNaN(cr) || isNaN(sl) || sl === 0) { setResult('Invalid'); return }
    const diffs = sc.map(s => ((s - cr) * 113) / sl)
    const best = diffs.sort((a,b) => a-b).slice(0, Math.min(8, diffs.length))
    const avg = best.reduce((a,b) => a+b, 0) / best.length
    setResult(`${avg.toFixed(1)}`)
  }

  return (
    <FormCalculatorShell title="Golf Handicap" badge="MISC">
      <RetroInput label="Scores (comma sep)" value={scores} onChange={setScores} placeholder="85,88,82,90,84" id="golf-sc" />
      <div className="grid grid-cols-2 gap-3"><RetroInput label="Course Rating" value={courseRating} onChange={setCourseRating} placeholder="72" id="golf-cr" /><RetroInput label="Slope" value={slope} onChange={setSlope} placeholder="113" id="golf-sl" /></div>
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Handicap Index" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
