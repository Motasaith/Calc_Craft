'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function HeartRateCalculator() {
  const [age, setAge] = useState('')
  const [restHR, setRestHR] = useState('')

  const a = parseFloat(age), rhr = parseFloat(restHR)
  const valid = !isNaN(a) && a > 0 && a <= 120
  const maxHR = valid ? 220 - a : 0
  const hasRest = !isNaN(rhr) && rhr > 30 && rhr < maxHR

  const zones = [
    { name: 'Recovery', min: 50, max: 60, desc: 'Warm-up, cool-down' },
    { name: 'Fat Burn', min: 60, max: 70, desc: 'Fat burning zone' },
    { name: 'Aerobic', min: 70, max: 80, desc: 'Cardio fitness' },
    { name: 'Anaerobic', min: 80, max: 90, desc: 'Performance' },
    { name: 'VO2 Max', min: 90, max: 100, desc: 'Maximum effort' },
  ]

  // Karvonen formula if resting HR available, else simple percentage
  const getZoneHR = (pct: number) => {
    if (hasRest) return Math.round((maxHR - rhr) * (pct / 100) + rhr)
    return Math.round(maxHR * (pct / 100))
  }

  return (
    <FormCalculatorShell title="Heart Rate Zone Calculator" badge="HEALTH">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Age" value={age} onChange={setAge} placeholder="30" id="hr-age" unit="yrs" />
        <RetroInput label="Resting HR (optional)" value={restHR} onChange={setRestHR} placeholder="65" id="hr-rest" unit="bpm" />
      </div>

      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Max Heart Rate" value={`${maxHR} bpm`} large />
          </div>
          <div className="mt-3 space-y-1.5">
            {zones.map((z) => (
              <div key={z.name} className="flex items-center gap-2 bg-[#cbd8ca]/50 border border-[#b0bdae] rounded-lg px-3 py-2">
                <div className="flex-1">
                  <div className="text-[10px] font-bold font-mono text-neutral-700">{z.name}</div>
                  <div className="text-[8px] font-mono text-neutral-500">{z.desc}</div>
                </div>
                <div className="text-sm font-bold font-mono text-[#1a2019]">
                  {getZoneHR(z.min)}–{getZoneHR(z.max)} bpm
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}
