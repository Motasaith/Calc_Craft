'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function FenceCalculator() {
  const [perimeter, setPerimeter] = useState('100')
  const [postSpacing, setPostSpacing] = useState('2.4')
  const [fenceHeight, setFenceHeight] = useState('1.8')
  const [result, setResult] = useState<{ posts: number; rails: number; pickets: number } | null>(null)

  const calculate = () => {
    const p = parseFloat(perimeter), ps = parseFloat(postSpacing), fh = parseFloat(fenceHeight)
    if (isNaN(p) || isNaN(ps) || isNaN(fh) || p <= 0 || ps <= 0 || fh <= 0) { setResult(null); return }
    const sections = Math.ceil(p / ps)
    const posts = sections + 1
    const rails = sections * 2
    const picketWidth = 0.1
    const pickets = Math.ceil(p / picketWidth)
    setResult({ posts, rails, pickets })
  }

  return (
    <FormCalculatorShell title="Fence Calculator" subtitle="Posts, rails & pickets" badge="CONSTRUCTION">
      <RetroInput label="Perimeter (m)" value={perimeter} onChange={setPerimeter} placeholder="100" id="fence-per" />
      <RetroInput label="Post Spacing (m)" value={postSpacing} onChange={setPostSpacing} placeholder="2.4" id="fence-ps" />
      <RetroInput label="Fence Height (m)" value={fenceHeight} onChange={setFenceHeight} placeholder="1.8" id="fence-fh" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <ResultDisplay label="Posts" value={result.posts} />
            <ResultDisplay label="Rails" value={result.rails} />
            <ResultDisplay label="Pickets" value={result.pickets} large />
          </div>
          <div className="mt-3">
            <svg viewBox="0 0 200 70" className="w-full h-20 bg-[#cbd8ca] rounded-lg border-2 border-[#b0bdae]">
              {Array.from({ length: 10 }).map((_, i) => (
                <path key={i} d={wobblyBar(8 + i * 19, 10, 14, 50)} fill="#c8a070" stroke="#8a6040" strokeWidth="0.5" />
              ))}
              <line x1="5" y1="25" x2="195" y2="25" stroke="#8a6040" strokeWidth="2" />
              <line x1="5" y1="45" x2="195" y2="45" stroke="#8a6040" strokeWidth="2" />
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}