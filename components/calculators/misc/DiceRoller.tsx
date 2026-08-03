'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function DiceRoller() {
  const [diceStr, setDiceStr] = useState('2') // number of dice
  const [sidesStr, setSidesStr] = useState('6') // sides
  const [trigger, setTrigger] = useState(0)

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, total: 0, rolls: [] as number[] }
    const d = parseInt(diceStr)
    const s = parseInt(sidesStr)

    if (isNaN(d) || isNaN(s) || d <= 0 || s <= 1 || d > 20 || s > 100) {
      return { ...defaultObj, error: 'Max 20 dice and 100 sides.' }
    }

    let rolls: number[] = []
    let total = 0
    for (let i = 0; i < d; i++) {
      const roll = Math.floor(Math.random() * s) + 1
      rolls.push(roll)
      total += roll
    }

    return { error: null, total, rolls }
  }, [diceStr, sidesStr, trigger])

  return (
    <FormCalculatorShell title="Random Dice Roll Solver" subtitle="Roll multiple custom multi-sided dice distributions" badge="MISCELLANEOUS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Number of Dice" value={diceStr} onChange={setDiceStr} id="dr-d" />
          <RetroInput label="Dice Sides" value={sidesStr} onChange={setSidesStr} id="dr-s" />
          <button
            onClick={() => setTrigger(p => p + 1)}
            className="w-full bg-neutral-900 text-white font-mono p-3 rounded hover:bg-neutral-800 transition"
          >
            Roll Dice
          </button>
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="space-y-4">
              <ResultDisplay label="Total Sum" value={results.total.toString()} large />
              <div className="font-mono text-xs text-neutral-600 bg-neutral-50 p-3 rounded border border-neutral-300">
                Rolls: {results.rolls.join(', ')}
              </div>
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
