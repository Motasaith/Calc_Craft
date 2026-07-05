'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyRect(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function PrintSizeCalculator() {
  const [width, setWidth] = useState('4000')
  const [height, setHeight] = useState('3000')
  const [dpi, setDpi] = useState('300')

  const w = parseFloat(width), h = parseFloat(height), d = parseFloat(dpi)
  const valid = !isNaN(w) && !isNaN(h) && !isNaN(d) && w > 0 && h > 0 && d > 0
  const printW = valid ? w / d : 0 // inches
  const printH = valid ? h / d : 0
  const printWcm = valid ? printW * 2.54 : 0
  const printHcm = valid ? printH * 2.54 : 0

  return (
    <FormCalculatorShell title="Print Size Calculator" subtitle="Size = pixels / DPI" badge="PHOTOGRAPHY">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Width (px)" value={width} onChange={setWidth} placeholder="4000" id="ps-w" unit="px" />
        <RetroInput label="Height (px)" value={height} onChange={setHeight} placeholder="3000" id="ps-h" unit="px" />
      </div>
      <RetroInput label="DPI" value={dpi} onChange={setDpi} placeholder="300" id="ps-dpi" unit="dpi" />
      {valid && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ResultDisplay label="Print Size" value={`${printW.toFixed(1)}×${printH.toFixed(1)}`} unit="in" large />
            <ResultDisplay label="Print Size" value={`${printWcm.toFixed(1)}×${printHcm.toFixed(1)}`} unit="cm" large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Print Preview</span>
            <svg width="160" height="90" viewBox="0 0 160 90" className="select-none">
              <defs>
                <pattern id="psGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="160" height="90" fill="url(#psGrid)" rx="8" />
              <path d={wobblyRect(20, 10, Math.min(120, (w / Math.max(w, h)) * 120), Math.min(65, (h / Math.max(w, h)) * 65))} fill="#78716c" fillOpacity="0.15" stroke="#57534e" strokeWidth="2" />
              <text x="80" y="85" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#57534e" fontWeight="bold">{printW.toFixed(0)}×{printH.toFixed(0)} in @ {d} DPI</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}