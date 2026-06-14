'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

const BANDS: Record<string,number> = { black:0, brown:1, red:2, orange:3, yellow:4, green:5, blue:6, violet:7, grey:8, white:9 }
const MULTIPLIERS: Record<string,number> = { black:1, brown:10, red:100, orange:1000, yellow:10000, green:100000, blue:1000000, gold:0.1, silver:0.01 }
const TOLERANCES: Record<string,string> = { brown:'±1%', red:'±2%', green:'±0.5%', blue:'±0.25%', violet:'±0.1%', grey:'±0.05%', gold:'±5%', silver:'±10%', none:'±20%' }

export default function ResistorCalculator() {
  const [band1, setBand1] = useState('brown')
  const [band2, setBand2] = useState('black')
  const [band3, setBand3] = useState('red')
  const [tolerance, setTolerance] = useState('gold')
  const [result, setResult] = useState('')

  const calculate = () => {
    const val = (BANDS[band1] * 10 + BANDS[band2]) * MULTIPLIERS[band3]
    const tol = TOLERANCES[tolerance]
    if (val >= 1000000) setResult(`${(val/1000000).toFixed(2)} MΩ ${tol}`)
    else if (val >= 1000) setResult(`${(val/1000).toFixed(2)} kΩ ${tol}`)
    else setResult(`${val.toFixed(2)} Ω ${tol}`)
  }

  const colors = Object.keys(BANDS).map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))
  const tolColors = Object.keys(TOLERANCES).map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))

  return (
    <FormCalculatorShell title="Resistor Color Code" badge="ENGINEERING">
      <RetroSelect label="1st Band" value={band1} onChange={setBand1} options={colors} id="res-b1" />
      <RetroSelect label="2nd Band" value={band2} onChange={setBand2} options={colors} id="res-b2" />
      <RetroSelect label="Multiplier" value={band3} onChange={setBand3} options={colors} id="res-b3" />
      <RetroSelect label="Tolerance" value={tolerance} onChange={setTolerance} options={tolColors} id="res-tol" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Decode</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Resistance" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
