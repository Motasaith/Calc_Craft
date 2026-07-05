'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function DeckCalculator() {
  const [deckArea, setDeckArea] = useState('20')
  const [boardWidth, setBoardWidth] = useState('140')
  const [joistSpacing, setJoistSpacing] = useState('0.4')
  const [result, setResult] = useState<{ boards: number; joists: number; screws: number } | null>(null)

  const calculate = () => {
    const a = parseFloat(deckArea), bw = parseFloat(boardWidth), js = parseFloat(joistSpacing)
    if (isNaN(a) || isNaN(bw) || isNaN(js) || a <= 0 || bw <= 0 || js <= 0) { setResult(null); return }
    const sideLen = Math.sqrt(a)
    const boards = Math.ceil((sideLen * 1000) / bw)
    const joists = Math.ceil(sideLen / js) + 1
    const screws = boards * joists * 2
    setResult({ boards, joists, screws })
  }

  return (
    <FormCalculatorShell title="Deck Calculator" subtitle="Boards, joists & screws" badge="CONSTRUCTION">
      <RetroInput label="Deck Area (m²)" value={deckArea} onChange={setDeckArea} placeholder="20" id="deck-area" />
      <RetroInput label="Board Width (mm)" value={boardWidth} onChange={setBoardWidth} placeholder="140" id="deck-bw" />
      <RetroInput label="Joist Spacing (m)" value={joistSpacing} onChange={setJoistSpacing} placeholder="0.4" id="deck-js" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <ResultDisplay label="Boards" value={result.boards} />
            <ResultDisplay label="Joists" value={result.joists} />
            <ResultDisplay label="Screws" value={result.screws} large />
          </div>
          <div className="mt-3">
            <svg viewBox="0 0 200 70" className="w-full h-20 bg-[#cbd8ca] rounded-lg border-2 border-[#b0bdae]">
              {Array.from({ length: 8 }).map((_, i) => (
                <path key={i} d={wobblyBar(5, 8 + i * 8, 190, 6)} fill="#c89060" stroke="#8a6040" strokeWidth="0.5" />
              ))}
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}