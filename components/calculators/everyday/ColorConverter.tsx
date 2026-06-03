'use client'
import React, { useState, useEffect } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function ColorConverter() {
  const [hex, setHex] = useState('#3B82F6')

  const hexToRgb = (h: string) => {
    const c = h.replace('#', '')
    if (c.length !== 6) return null
    const r = parseInt(c.substring(0, 2), 16), g = parseInt(c.substring(2, 4), 16), b = parseInt(c.substring(4, 6), 16)
    if ([r, g, b].some(isNaN)) return null
    return { r, g, b }
  }

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min
    let h = 0, s = 0, l = (max + min) / 2
    if (d !== 0) {
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
      else if (max === g) h = ((b - r) / d + 2) / 6
      else h = ((r - g) / d + 4) / 6
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
  }

  const rgb = hexToRgb(hex)
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null

  return (
    <FormCalculatorShell title="Color Converter" badge="EVERYDAY">
      <div className="flex gap-3 items-end mb-4">
        <div className="flex-1">
          <RetroInput label="HEX Color" value={hex} onChange={setHex} type="text" placeholder="#3B82F6" id="color-hex" />
        </div>
        <div className="mb-3">
          <input type="color" value={hex.length === 7 ? hex : '#000000'} onChange={(e) => setHex(e.target.value)}
            className="w-10 h-10 rounded border-2 border-neutral-300 cursor-pointer" />
        </div>
      </div>

      {/* Preview */}
      <div className="h-16 rounded-lg border-2 border-neutral-300 shadow-inner mb-4" style={{ backgroundColor: hex }} />

      {rgb && hsl && (
        <div className="grid grid-cols-2 gap-2">
          <ResultDisplay label="HEX" value={hex.toUpperCase()} />
          <ResultDisplay label="RGB" value={`${rgb.r}, ${rgb.g}, ${rgb.b}`} />
          <ResultDisplay label="HSL" value={`${hsl.h}°, ${hsl.s}%, ${hsl.l}%`} />
          <ResultDisplay label="CSS RGB" value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
