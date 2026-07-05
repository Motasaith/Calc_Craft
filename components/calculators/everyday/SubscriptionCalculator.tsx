'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function SubscriptionCalculator() {
  const [subs, setSubs] = useState([{ name: 'Netflix', cost: '15.99' }, { name: 'Spotify', cost: '9.99' }, { name: 'Gym', cost: '30' }])
  const [result, setResult] = useState<{ monthly: number; yearly: number; count: number } | null>(null)

  const add = () => setSubs([...subs, { name: '', cost: '0' }])
  const remove = (i: number) => { if (subs.length > 1) setSubs(subs.filter((_, idx) => idx !== i)) }
  const update = (i: number, field: 'name' | 'cost', val: string) => {
    const c = [...subs]; c[i] = { ...c[i], [field]: val }; setSubs(c)
  }

  const calculate = () => {
    let monthly = 0
    let count = 0
    for (const s of subs) {
      const c = parseFloat(s.cost)
      if (!isNaN(c) && c > 0) { monthly += c; count++ }
    }
    if (count === 0) return
    setResult({ monthly, yearly: monthly * 12, count })
  }

  return (
    <FormCalculatorShell title="Subscription Calculator" subtitle="Total monthly subscription cost" badge="EVERYDAY">
      <div className="space-y-2 mb-3">
        {subs.map((s, i) => (
          <div key={i} className="flex gap-2 items-end">
            <div className="flex-1">
              <RetroInput label={i === 0 ? 'Name' : ''} value={s.name} onChange={(v) => update(i, 'name', v)} type="text" placeholder="Service" id={`sub-n-${i}`} />
            </div>
            <div className="w-24">
              <RetroInput label={i === 0 ? 'Cost/mo' : ''} value={s.cost} onChange={(v) => update(i, 'cost', v)} unit="$" id={`sub-c-${i}`} />
            </div>
            {subs.length > 1 && (
              <button onClick={() => remove(i)} className="h-10 w-10 text-xs font-bold bg-[#ab3232] text-white rounded border border-red-800 active:scale-95 transition-all mb-3">✕</button>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mb-4">
        <button onClick={add} className="flex-1 h-9 text-xs font-bold font-mono bg-neutral-300 text-neutral-800 rounded border border-neutral-400 hover:bg-neutral-250 transition-all">+ Add Subscription</button>
        <RetroActionButton onClick={calculate} variant="primary">Calculate</RetroActionButton>
      </div>
      {result && (
        <div className="space-y-2">
          <ResultDisplay label={`Monthly Total (${result.count} subs)`} value={`$${result.monthly.toFixed(2)}`} large />
          <ResultDisplay label="Yearly Total" value={`$${result.yearly.toFixed(2)}`} />
          <svg viewBox="0 0 200 50" className="w-full h-12 mt-2">
            <path d={wobblyBar(10, 40 - Math.min(result.monthly, 35), 80, Math.min(result.monthly, 35))} fill="#dfaa44" stroke="#be8b32" strokeWidth="2" />
            <path d={wobblyBar(110, 40 - Math.min(result.yearly / 12, 35), 80, Math.min(result.yearly / 12, 35))} fill="#cbd8ca" stroke="#b0bdae" strokeWidth="2" />
            <text x="50" y="48" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#4c5c4a">Monthly</text>
            <text x="150" y="48" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#4c5c4a">Yearly</text>
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}