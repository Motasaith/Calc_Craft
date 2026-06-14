'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function DiceRollerCalculator() {
  const [count, setCount] = useState('2')
  const [sides, setSides] = useState('6')
  const [modifier, setModifier] = useState('0')
  const [result, setResult] = useState<{rolls:number[],total:number}|null>(null)

  const roll = () => {
    const c = parseInt(count), s = parseInt(sides), m = parseInt(modifier)
    if (isNaN(c)||isNaN(s)||isNaN(m) || c<1 || s<2) { setResult(null); return }
    const rolls = Array.from({length:c}, () => Math.floor(Math.random() * s) + 1)
    setResult({ rolls, total: rolls.reduce((a,b) => a+b, 0) + m })
  }

  return (
    <FormCalculatorShell title="Dice Roller" badge="MISC">
      <div className="grid grid-cols-3 gap-3"><RetroInput label="Dice" value={count} onChange={setCount} placeholder="2" id="dice-c" /><RetroInput label="Sides" value={sides} onChange={setSides} placeholder="6" id="dice-s" /><RetroInput label="Modifier" value={modifier} onChange={setModifier} placeholder="0" id="dice-m" /></div>
      <div className="mt-4"><RetroActionButton onClick={roll} variant="primary" fullWidth>Roll</RetroActionButton></div>
      {result && (
        <div className="mt-4">
          <div className="text-[10px] font-bold text-neutral-500 font-mono uppercase mb-1">Rolls: {result.rolls.join(', ')}</div>
          <ResultDisplay label="Total" value={result.total} large />
        </div>
      )}
    </FormCalculatorShell>
  )
}
