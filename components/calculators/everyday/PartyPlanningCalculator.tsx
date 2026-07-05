'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function PartyPlanningCalculator() {
  const [guests, setGuests] = useState('20')
  const [drinks, setDrinks] = useState('3')
  const [food, setFood] = useState('1.5')
  const [result, setResult] = useState<{ totalDrinks: number; totalFood: number; ice: number } | null>(null)

  const calculate = () => {
    const g = parseInt(guests)
    const d = parseFloat(drinks)
    const f = parseFloat(food)
    if (isNaN(g) || isNaN(d) || isNaN(f) || g <= 0 || d < 0 || f < 0) return
    setResult({ totalDrinks: g * d, totalFood: g * f, ice: g * d * 0.5 })
  }

  return (
    <FormCalculatorShell title="Party Planning Calculator" subtitle="Estimate party supplies" badge="EVERYDAY">
      <RetroInput label="Number of Guests" value={guests} onChange={setGuests} id="party-guests" />
      <RetroInput label="Drinks per Person" value={drinks} onChange={setDrinks} id="party-drinks" />
      <RetroInput label="Food Portions / Person" value={food} onChange={setFood} id="party-food" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate Supplies</RetroActionButton></div>
      {result && (
        <div className="mt-4 space-y-2">
          <ResultDisplay label="Total Drinks" value={result.totalDrinks} unit="servings" large />
          <ResultDisplay label="Total Food" value={result.totalFood} unit="portions" />
          <ResultDisplay label="Ice Needed" value={result.ice} unit="lbs" />
          <svg viewBox="0 0 200 50" className="w-full h-12 mt-2">
            <path d={wobblyBar(10, 40 - Math.min(result.totalDrinks / 2, 35), 50, Math.min(result.totalDrinks / 2, 35))} fill="#dfaa44" stroke="#be8b32" strokeWidth="2" />
            <path d={wobblyBar(70, 40 - Math.min(result.totalFood * 5, 35), 50, Math.min(result.totalFood * 5, 35))} fill="#cbd8ca" stroke="#b0bdae" strokeWidth="2" />
            <path d={wobblyBar(130, 40 - Math.min(result.ice * 3, 35), 50, Math.min(result.ice * 3, 35))} fill="#dad6cd" stroke="#b0bdae" strokeWidth="2" />
            <text x="35" y="48" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#4c5c4a">Drinks</text>
            <text x="95" y="48" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#4c5c4a">Food</text>
            <text x="155" y="48" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#4c5c4a">Ice</text>
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}