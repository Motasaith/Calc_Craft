'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function EVSavingsCalculator() {
  const [gasMpg, setGasMpg] = useState('25')
  const [gasPrice, setGasPrice] = useState('3.5')
  const [evMpkwh, setEvMpkwh] = useState('3.5')
  const [elecPrice, setElecPrice] = useState('0.15')
  const [miles, setMiles] = useState('12000')

  const gmpg = parseFloat(gasMpg), gp = parseFloat(gasPrice), empkwh = parseFloat(evMpkwh), ep = parseFloat(elecPrice), m = parseFloat(miles)
  const valid = !isNaN(gmpg) && !isNaN(gp) && !isNaN(empkwh) && !isNaN(ep) && !isNaN(m) && gmpg > 0 && empkwh > 0
  const gasCost = valid ? (m / gmpg) * gp : 0
  const evCost = valid ? (m / empkwh) * ep : 0
  const savings = valid ? gasCost - evCost : 0

  return (
    <FormCalculatorShell title="EV Savings" subtitle="Gas cost - EV cost" badge="ENVIRONMENT">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Gas MPG" value={gasMpg} onChange={setGasMpg} placeholder="25" id="ev-gmpg" unit="mpg" />
        <RetroInput label="Gas Price" value={gasPrice} onChange={setGasPrice} placeholder="3.5" id="ev-gp" unit="$/gal" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="EV mi/kWh" value={evMpkwh} onChange={setEvMpkwh} placeholder="3.5" id="ev-emp" unit="mi/kWh" />
        <RetroInput label="Elec Price" value={elecPrice} onChange={setElecPrice} placeholder="0.15" id="ev-ep" unit="$/kWh" />
      </div>
      <RetroInput label="Annual Miles" value={miles} onChange={setMiles} placeholder="12000" id="ev-m" unit="mi" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <ResultDisplay label="Gas Cost" value={`$${gasCost.toFixed(0)}`} />
            <ResultDisplay label="EV Cost" value={`$${evCost.toFixed(0)}`} />
            <ResultDisplay label="Savings" value={`$${savings.toFixed(0)}`} />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Cost Comparison</span>
            <svg width="160" height="70" viewBox="0 0 160 70" className="select-none">
              <defs>
                <pattern id="evGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="70" fill="url(#evGrid)" rx="8" />
              <path d={wobblyBar(25, 15, 40, Math.min(40, gasCost / 50))} fill="#f97316" fillOpacity="0.3" stroke="#ea580c" strokeWidth="2" />
              <text x="45" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#ea580c">Gas</text>
              <path d={wobblyBar(95, 15 + 40 - Math.min(40, evCost / 50), 40, Math.min(40, evCost / 50))} fill="#22c55e" fillOpacity="0.3" stroke="#16a34a" strokeWidth="2" />
              <text x="115" y="65" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#16a34a">EV</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}