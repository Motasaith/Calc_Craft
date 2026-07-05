'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

const AWG_TABLE = [
  { awg: 0, ampacity: 150 },
  { awg: 2, ampacity: 95 },
  { awg: 4, ampacity: 70 },
  { awg: 6, ampacity: 55 },
  { awg: 8, ampacity: 40 },
  { awg: 10, ampacity: 30 },
  { awg: 12, ampacity: 20 },
  { awg: 14, ampacity: 15 },
]

export default function WireSizeCalculator() {
  const [current, setCurrent] = useState('15')
  const [distance, setDistance] = useState('30')
  const [voltage, setVoltage] = useState('120')

  const amps = parseFloat(current) || 0
  const dist = parseFloat(distance) || 0
  const volts = parseFloat(voltage) || 0

  // Voltage drop allowance 3%
  const maxDrop = volts * 0.03
  // Approx circular mils needed: cmil = (2 * K * I * D) / VD, K=12 for copper
  const cmil = volts > 0 ? (2 * 12 * amps * dist) / maxDrop : 0
  // Find smallest AWG that satisfies ampacity
  const byAmpacity = AWG_TABLE.find((a) => a.ampacity >= amps)
  const recommended = byAmpacity ? byAmpacity.awg : 0

  const valid = amps > 0 && dist > 0 && volts > 0

  // Visualizer: bar height proportional to current
  const barH = Math.min(80, amps * 1.2)

  return (
    <FormCalculatorShell
      title="Wire Size Calculator"
      subtitle="Find the right AWG gauge for your circuit"
      badge="ELECTRICAL"
    >
      <div>
        <RetroInput label="Current" value={current} onChange={setCurrent} unit="amps" min={0} />
        <RetroInput label="Distance" value={distance} onChange={setDistance} unit="ft" min={0} />
        <RetroInput label="Voltage" value={voltage} onChange={setVoltage} unit="V" min={0} />
      </div>

      <div className="space-y-2 mt-2">
        {valid && (
          <>
            <ResultDisplay label="Recommended Wire Size" value={`AWG ${recommended}`} large />
            <ResultDisplay label="Max Voltage Drop" value={maxDrop.toFixed(2)} unit="V" />
            <ResultDisplay label="Circular Mils Needed" value={Math.round(cmil).toLocaleString()} unit="cmil" />
          </>
        )}
      </div>

      {valid && (
        <div className="mt-3 flex justify-center">
          <svg width="120" height="100" viewBox="0 0 120 100">
            <path d={wobblyBar(20, 90 - barH, 30, barH)} fill="#dfaa44" stroke="#be8b32" strokeWidth="2" />
            <path d={wobblyBar(60, 90 - barH * 0.7, 30, barH * 0.7)} fill="#cbd8ca" stroke="#b0bdae" strokeWidth="2" />
            <line x1="10" y1="90" x2="110" y2="90" stroke="#888" strokeWidth="1.5" />
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}