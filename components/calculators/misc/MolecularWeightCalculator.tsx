'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

const ATOMIC_MASS: Record<string,number> = { H:1.008, He:4.003, Li:6.941, Be:9.012, B:10.811, C:12.011, N:14.007, O:15.999, F:18.998, Ne:20.180, Na:22.990, Mg:24.305, Al:26.982, Si:28.086, P:30.974, S:32.065, Cl:35.453, K:39.098, Ca:40.078, Fe:55.845, Cu:63.546, Zn:65.380, Ag:107.868, Au:196.967 }

export default function MolecularWeightCalculator() {
  const [formula, setFormula] = useState('H2O')
  const [result, setResult] = useState('')

  const calculate = () => {
    let total = 0
    const regex = /([A-Z][a-z]?)(\d*)/g
    let match
    const used = new Set<string>()
    while ((match = regex.exec(formula)) !== null) {
      const el = match[1]
      const count = match[2] ? parseInt(match[2]) : 1
      const mass = ATOMIC_MASS[el]
      if (mass === undefined) { setResult(`Unknown element: ${el}`); return }
      total += mass * count
      used.add(el)
    }
    if (used.size === 0) { setResult('Invalid formula'); return }
    setResult(`${total.toFixed(3)} g/mol`)
  }

  return (
    <FormCalculatorShell title="Molecular Weight" badge="MISC">
      <RetroInput label="Formula" value={formula} onChange={setFormula} placeholder="H2O, C6H12O6" id="mol-f" />
      <div className="text-[10px] text-neutral-500 font-mono mt-1">Examples: H2O, CO2, NaCl, C6H12O6</div>
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Molar Mass" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
