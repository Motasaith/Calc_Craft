'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PartyPlanningCalculator() {
  const [guestsStr, setGuestsStr] = useState('20')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, pizza: 0, drinks: 0 }
    const g = parseInt(guestsStr)
    if (isNaN(g) || g <= 0) return { ...defaultObj, error: 'Please enter valid guest counts.' }
    // Assume 3 pizza slices per guest, 8 slices per large pizza
    const pizza = Math.ceil((g * 3) / 8)
    // Assume 2 drinks per guest
    const drinks = g * 2
    return { error: null, pizza, drinks }
  }, [guestsStr])

  return (
    <FormCalculatorShell title="Party Catering Solver" subtitle="Estimate quantity of food and drinks needed for custom guest lists" badge="EVERYDAY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Number of Guests" value={guestsStr} onChange={setGuestsStr} id="pp-g" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Large Pizzas Needed" value={results.pizza.toString()} large />
              <ResultDisplay label="Total Beverages Needed" value={results.drinks.toString()} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
