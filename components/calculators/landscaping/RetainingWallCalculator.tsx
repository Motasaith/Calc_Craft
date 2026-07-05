'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function RetainingWallCalculator() {
  const [wallLength, setWallLength] = useState('20')
  const [wallHeight, setWallHeight] = useState('4')
  const [blockWidth, setBlockWidth] = useState('12')
  const [blockHeight, setBlockHeight] = useState('6')
  const [pricePerBlock, setPricePerBlock] = useState('3.5')

  const wl = parseFloat(wallLength) || 0
  const wh = parseFloat(wallHeight) || 0
  const bw = parseFloat(blockWidth) || 0
  const bh = parseFloat(blockHeight) || 0
  const price = parseFloat(pricePerBlock) || 0

  const blocksPerRow = bw > 0 ? Math.ceil((wl * 12) / bw) : 0
  const rows = bh > 0 ? Math.ceil((wh * 12) / bh) : 0
  const totalBlocks = blocksPerRow * rows
  const cost = totalBlocks * price

  const valid = wl > 0 && wh > 0 && bw > 0 && bh > 0

  return (
    <FormCalculatorShell
      title="Retaining Wall Calculator"
      subtitle="Count blocks needed for a retaining wall"
      badge="LANDSCAPING"
    >
      <div>
        <RetroInput label="Wall Length" value={wallLength} onChange={setWallLength} unit="ft" min={0} />
        <RetroInput label="Wall Height" value={wallHeight} onChange={setWallHeight} unit="ft" min={0} />
        <RetroInput label="Block Width" value={blockWidth} onChange={setBlockWidth} unit="in" min={0} />
        <RetroInput label="Block Height" value={blockHeight} onChange={setBlockHeight} unit="in" min={0} />
        <RetroInput label="Price per Block" value={pricePerBlock} onChange={setPricePerBlock} unit="$" min={0} step={0.1} />
      </div>

      {valid && (
        <div className="space-y-2 mb-4">
          <ResultDisplay label="Blocks Needed" value={totalBlocks} unit="blocks" large />
          <ResultDisplay label="Estimated Cost" value={`$${cost.toFixed(2)}`} />
        </div>
      )}

      <svg viewBox="0 0 200 80" className="w-full h-20 mt-auto">
        <rect x="0" y="0" width="200" height="80" fill="#d8d4cc" />
        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 8 }).map((_, col) => (
            <path
              key={`${row}-${col}`}
              d={wobblyBar(10 + col * 23, 10 + row * 16, 21, 15)}
              fill="#8a7a6a"
              opacity={valid ? 0.85 : 0.3}
            />
          ))
        )}
      </svg>
    </FormCalculatorShell>
  )
}