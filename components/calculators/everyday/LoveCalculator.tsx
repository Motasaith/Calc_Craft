'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function LoveCalculator() {
  const [name1, setName1] = useState('Romeo')
  const [name2, setName2] = useState('Juliet')
  const [result, setResult] = useState('')

  const calculate = () => {
    const combined = (name1 + name2).toLowerCase().replace(/[^a-z]/g, '')
    let hash = 0
    for (let i = 0; i < combined.length; i++) {
      hash = ((hash << 5) - hash) + combined.charCodeAt(i)
      hash = hash & hash
    }
    const score = Math.abs(hash) % 101
    let msg = 'Keep looking...'
    if (score > 80) msg = 'Perfect match! 💕'
    else if (score > 60) msg = 'Great compatibility! ❤️'
    else if (score > 40) msg = 'Not bad! 💛'
    else if (score > 20) msg = 'Could work... 💚'
    setResult(`${score}% — ${msg}`)
  }

  return (
    <FormCalculatorShell title="Love Calculator" badge="EVERYDAY">
      <RetroInput label="Your Name" value={name1} onChange={setName1} placeholder="Romeo" id="love-n1" />
      <RetroInput label="Their Name" value={name2} onChange={setName2} placeholder="Juliet" id="love-n2" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate Compatibility</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Compatibility" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
