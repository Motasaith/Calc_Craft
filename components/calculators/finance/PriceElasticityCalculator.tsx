'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'
import { formatNumber } from '@/lib/calc-engine'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function PriceElasticityCalculator() {
  const [oldPrice, setOldPrice] = useState('10')
  const [newPrice, setNewPrice] = useState('12')
  const [oldQty, setOldQty] = useState('1000')
  const [newQty, setNewQty] = useState('800')

  const p1 = parseFloat(oldPrice)
  const p2 = parseFloat(newPrice)
  const q1 = parseFloat(oldQty)
  const q2 = parseFloat(newQty)
  const valid = !isNaN(p1) && !isNaN(p2) && !isNaN(q1) && !isNaN(q2) && p1 > 0 && p2 > 0 && q1 > 0 && q2 > 0

  const elasticity = valid ? ((q2 - q1) / ((q1 + q2) / 2)) / ((p2 - p1) / ((p1 + p2) / 2)) : 0
  const absE = Math.abs(elasticity)
  const classification = absE > 1 ? 'Elastic' : absE === 1 ? 'Unit Elastic' : 'Inelastic'
  const barW = valid ? Math.min(absE * 60, 140) : 0

  return (
    <FormCalculatorShell
      title="Price Elasticity Calculator"
      subtitle="Elasticity of demand (midpoint)"
      badge="FINANCE"
    >
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Old Price" value={oldPrice} onChange={setOldPrice} placeholder="e.g. 10" id="pe-p1" unit="$" />
        <RetroInput label="New Price" value={newPrice} onChange={setNewPrice} placeholder="e.g. 12" id="pe-p2" unit="$" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Old Quantity" value={oldQty} onChange={setOldQty} placeholder="e.g. 1000" id="pe-q1" />
        <RetroInput label="New Quantity" value={newQty} onChange={setNewQty} placeholder="e.g. 800" id="pe-q2" />
      </div>

      {valid && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <ResultDisplay label="Elasticity" value={formatNumber(elasticity, 3)} large />
            <ResultDisplay label="Classification" value={classification} />
          </div>
          <svg viewBox="0 0 200 60" className="w-full h-16 mt-2">
            <path d={wobblyBar(20, 15, barW, 30)} fill="#dfaa44" stroke="#be8b32" strokeWidth="1.5" />
            <line x1="20" y1="45" x2="180" y2="45" stroke="#888" strokeWidth="1" />
            <text x="20" y="58" fontSize="8" fontFamily="monospace" fill="#555">0</text>
            <text x="150" y="58" fontSize="8" fontFamily="monospace" fill="#555">|E|</text>
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}