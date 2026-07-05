'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function AirQualityCalculator() {
  const [aqi, setAqi] = useState('75')

  const a = parseFloat(aqi)
  const valid = !isNaN(a) && a >= 0
  const category = valid ? (a <= 50 ? 'Good' : a <= 100 ? 'Moderate' : a <= 150 ? 'Unhealthy for Sensitive' : a <= 200 ? 'Unhealthy' : a <= 300 ? 'Very Unhealthy' : 'Hazardous') : ''
  const color = valid ? (a <= 50 ? '#22c55e' : a <= 100 ? '#fbbf24' : a <= 150 ? '#f97316' : a <= 200 ? '#ef4444' : a <= 300 ? '#a855f7' : '#7c2d12') : '#9ca3af'

  return (
    <FormCalculatorShell title="Air Quality Index" subtitle="AQI health categories" badge="ENVIRONMENT">
      <RetroInput label="AQI Value" value={aqi} onChange={setAqi} placeholder="75" id="aq-a" unit="" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Category" value={category} large />
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">AQI Scale</span>
            <svg width="200" height="80" viewBox="0 0 200 80" className="select-none">
              <defs>
                <pattern id="aqGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="200" height="80" fill="url(#aqGrid)" rx="8" />
              {/* AQI scale segments */}
              <path d={wobblyBar(15, 30, 30, 20)} fill="#22c55e" fillOpacity="0.4" />
              <path d={wobblyBar(45, 30, 30, 20)} fill="#fbbf24" fillOpacity="0.4" />
              <path d={wobblyBar(75, 30, 30, 20)} fill="#f97316" fillOpacity="0.4" />
              <path d={wobblyBar(105, 30, 30, 20)} fill="#ef4444" fillOpacity="0.4" />
              <path d={wobblyBar(135, 30, 30, 20)} fill="#a855f7" fillOpacity="0.4" />
              <path d={wobblyBar(165, 30, 20, 20)} fill="#7c2d12" fillOpacity="0.4" />
              {/* Marker */}
              <path d={`M ${15 + Math.min(170, (a / 300) * 170)} 25 L ${15 + Math.min(170, (a / 300) * 170)} 55`} stroke={color} strokeWidth="3" />
              <circle cx={15 + Math.min(170, (a / 300) * 170)} cy="22" r="5" fill={color} stroke="#fff" strokeWidth="1.5" />
              <text x="100" y="72" textAnchor="middle" fontSize="8" fontFamily="monospace" fill={color} fontWeight="bold">AQI {a}: {category}</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}