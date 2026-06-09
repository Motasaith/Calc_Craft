'use client'
import React, { useState, useMemo } from 'react'
import DigitalText from '@/components/DigitalText'
import { useKeyboardInput } from '@/hooks/useKeyboardInput'

export default function RandomNumberGenerator() {
  const [min, setMin] = useState(1); const [max, setMax] = useState(100); const [count, setCount] = useState(1)
  const [results, setResults] = useState<number[]>([])

  const generate = () => {
    const nums: number[] = []
    for (let i = 0; i < Math.min(count, 50); i++) {
      nums.push(Math.floor(Math.random() * (max - min + 1)) + min)
    }
    setResults(nums)
  }

  const keyMap = useMemo(() => ({ 'Enter': generate, ' ': generate }), [min, max, count])
  useKeyboardInput(keyMap as Record<string, () => void>)

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="flex flex-col bg-[#eae7df] border-4 border-[#dad6cd] rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-bold tracking-wider text-neutral-500 font-mono">HoC RNG</span>
          <div className="w-10 h-3 bg-neutral-400 rounded-sm border border-neutral-500 shadow-inner flex justify-around items-center">
            <div className="w-1 h-1 bg-neutral-700/80 rounded-full" />
            <div className="w-1 h-1 bg-neutral-700/80 rounded-full" />
            <div className="w-1 h-1 bg-neutral-700/80 rounded-full" />
          </div>
        </div>

        {/* Display */}
        <div className="bg-[#cbd8ca] border-2 border-[#b0bdae] p-4 rounded-lg shadow-inner flex flex-col items-center justify-center min-h-[90px] mb-4">
          {results.length > 0 ? (
            results.length === 1 ? (
              <DigitalText text={results[0].toString()} theme="lcd" size={48} gap={2} animate={false} activeColor="#1a2019" inactiveColor="#b8c6b6" />
            ) : (
              <div className="flex flex-wrap gap-2 justify-center">
                {results.map((n, i) => (
                  <span key={i} className="bg-[#b8c6b6]/50 px-2 py-1 rounded font-mono font-bold text-[#1a2019] text-sm border border-[#a0b09e]">{n}</span>
                ))}
              </div>
            )
          ) : (
            <span className="text-sm font-mono text-[#4c5c4a]">Press GENERATE</span>
          )}
        </div>

        {/* Controls */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div>
            <label className="block text-[10px] font-bold text-neutral-600 font-mono uppercase mb-1">Min</label>
            <input type="number" value={min} onChange={(e) => setMin(parseInt(e.target.value) || 0)}
              className="w-full h-9 px-2 bg-[#fcfbfa] border-2 border-neutral-300 rounded text-sm font-mono font-bold text-neutral-800 text-center focus:outline-none focus:border-neutral-500" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-neutral-600 font-mono uppercase mb-1">Max</label>
            <input type="number" value={max} onChange={(e) => setMax(parseInt(e.target.value) || 100)}
              className="w-full h-9 px-2 bg-[#fcfbfa] border-2 border-neutral-300 rounded text-sm font-mono font-bold text-neutral-800 text-center focus:outline-none focus:border-neutral-500" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-neutral-600 font-mono uppercase mb-1">Count</label>
            <input type="number" value={count} onChange={(e) => setCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))} min={1} max={50}
              className="w-full h-9 px-2 bg-[#fcfbfa] border-2 border-neutral-300 rounded text-sm font-mono font-bold text-neutral-800 text-center focus:outline-none focus:border-neutral-500" />
          </div>
        </div>

        <button onClick={generate}
          className="h-12 w-full text-sm font-extrabold bg-[#dfaa44] text-neutral-900 rounded-lg shadow border border-[#be8b32] active:scale-95 hover:bg-[#e5b44e] transition-all font-mono tracking-wider">
          🎲 GENERATE
        </button>
      </div>
    </div>
  )
}
