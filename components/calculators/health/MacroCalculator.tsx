'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'
import { calculateMacros } from '@/lib/calc-engine'

export default function MacroCalculator() {
  const [calories, setCalories] = useState('')
  const [goal, setGoal] = useState('maintain')

  const c = parseFloat(calories)
  const valid = !isNaN(c) && c > 0

  // Macro ratios per goal (carbs / protein / fat)
  const ratios: Record<string, { p: number; c_: number; f: number }> = {
    lose: { p: 40, c_: 30, f: 30 },
    maintain: { p: 30, c_: 40, f: 30 },
    gain: { p: 30, c_: 45, f: 25 },
    keto: { p: 25, c_: 5, f: 70 },
  }

  const r = ratios[goal]
  const m = valid ? calculateMacros(c, { carbs: r.c_ / 100, protein: r.p / 100, fat: r.f / 100 }) : { carbs: 0, protein: 0, fat: 0 }

  return (
    <FormCalculatorShell title="Macronutrient Calculator" badge="HEALTH">
      <RetroInput label="Daily Calories" value={calories} onChange={setCalories} placeholder="2000" id="macro-cal" unit="cal" />
      <RetroSelect label="Goal" value={goal} onChange={setGoal} id="macro-goal"
        options={[
          { value: 'lose', label: 'Weight Loss' },
          { value: 'maintain', label: 'Maintenance' },
          { value: 'gain', label: 'Muscle Gain' },
          { value: 'keto', label: 'Keto' },
        ]} />

      {valid && (
        <div className="mt-4">
          <div className="grid grid-cols-3 gap-2">
            <ResultDisplay label={`Protein (${r.p}%)`} value={`${m.protein}g`} large />
            <ResultDisplay label={`Carbs (${r.c_}%)`} value={`${m.carbs}g`} large />
            <ResultDisplay label={`Fat (${r.f}%)`} value={`${m.fat}g`} large />
          </div>
          {/* Visual bar */}
          <div className="mt-3 h-4 rounded-full overflow-hidden bg-neutral-200 border border-neutral-300 flex">
            <div className="bg-[#4c5c4a] h-full" style={{ width: `${r.p}%` }} />
            <div className="bg-[#dfaa44] h-full" style={{ width: `${r.c_}%` }} />
            <div className="bg-[#cc6666] h-full" style={{ width: `${r.f}%` }} />
          </div>
          <div className="flex justify-between mt-1 text-[8px] font-mono font-bold text-neutral-600">
            <span>■ Protein</span><span>■ Carbs</span><span>■ Fat</span>
          </div>
        </div>
      )}
    </FormCalculatorShell>
  )
}
