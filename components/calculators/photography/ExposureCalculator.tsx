'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyRect(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function ExposureCalculator() {
  const [iso, setIso] = useState('100')
  const [aperture, setAperture] = useState('8')
  const [shutter, setShutter] = useState('125')

  const isoVal = parseFloat(iso), ap = parseFloat(aperture), sh = parseFloat(shutter)
  const valid = !isNaN(isoVal) && !isNaN(ap) && !isNaN(sh) && isoVal > 0 && ap > 0 && sh > 0
  // EV = log₂(N² / t) at ISO 100, then adjust for ISO
  const t = 1 / sh
  const ev100 = valid ? Math.log2((ap * ap) / t) : 0
  const ev = valid ? ev100 - Math.log2(isoVal / 100) : 0

  return (
    <FormCalculatorShell title="Exposure Value (EV)" subtitle="EV = log₂(N²/t) - log₂(ISO/100)" badge="PHOTOGRAPHY">
      <div className="grid grid-cols-3 gap-2">
        <RetroInput label="ISO" value={iso} onChange={setIso} placeholder="100" id="ev-iso" unit="" />
        <RetroInput label="Aperture" value={aperture} onChange={setAperture} placeholder="8" id="ev-ap" unit="f/" />
        <RetroInput label="Shutter" value={shutter} onChange={setShutter} placeholder="125" id="ev-sh" unit="1/x" />
      </div>
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Exposure Value" value={ev.toFixed(2)} unit="EV" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Exposure Meter</span>
            <svg width="180" height="70" viewBox="0 0 180 70" className="select-none">
              <defs>
                <pattern id="evGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="70" fill="url(#evGrid)" rx="8" />
              {/* Meter scale */}
              <path d={wobblyRect(15, 25, 150, 20)} fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" />
              <path d={wobblyRect(15, 25, Math.min(150, Math.max(0, ((ev + 5) / 15) * 150)), 20)} fill={ev < 5 ? '#1e293b' : ev < 10 ? '#fbbf24' : '#f97316'} fillOpacity="0.5" stroke={ev < 5 ? '#1e293b' : ev < 10 ? '#fbbf24' : '#f97316'} strokeWidth="1.5" />
              <text x="90" y="60" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#78716c" fontWeight="bold">EV {ev.toFixed(1)}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}