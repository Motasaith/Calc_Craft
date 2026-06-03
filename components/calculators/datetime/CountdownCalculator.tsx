'use client'
import React, { useState, useEffect } from 'react'
import FormCalculatorShell, { ResultDisplay } from '../shared/FormCalculatorShell'

export default function CountdownCalculator() {
  const [target, setTarget] = useState('')
  const [now, setNow] = useState(new Date())

  useEffect(() => { const i = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(i) }, [])

  const targetDate = target ? new Date(target) : null
  const valid = targetDate && !isNaN(targetDate.getTime())
  const isPast = valid && targetDate <= now

  const diff = valid ? Math.abs(targetDate.getTime() - now.getTime()) : 0
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)

  return (
    <FormCalculatorShell title="Countdown Calculator" badge="DATE & TIME">
      <div className="mb-3">
        <label htmlFor="cd-target" className="block text-[11px] font-bold text-neutral-600 font-mono uppercase tracking-wider mb-1.5">
          Target Date & Time
        </label>
        <input type="datetime-local" id="cd-target" value={target} onChange={(e) => setTarget(e.target.value)}
          className="w-full h-10 px-3 bg-[#fcfbfa] border-2 border-neutral-300 rounded-lg text-sm font-mono font-bold text-neutral-800 focus:outline-none focus:border-neutral-500 transition-all shadow-inner" />
      </div>

      {valid && (
        <>
          {isPast && <div className="text-center text-xs font-mono font-bold text-amber-700 mb-2">⚠ This date has passed</div>}
          <div className="grid grid-cols-4 gap-2 mt-2">
            <div className="bg-[#cbd8ca] border-2 border-[#b0bdae] rounded-lg p-2 shadow-inner text-center">
              <div className="text-2xl font-mono font-extrabold text-[#1a2019]">{days}</div>
              <div className="text-[8px] font-mono font-bold text-[#4c5c4a] uppercase">Days</div>
            </div>
            <div className="bg-[#cbd8ca] border-2 border-[#b0bdae] rounded-lg p-2 shadow-inner text-center">
              <div className="text-2xl font-mono font-extrabold text-[#1a2019]">{hours}</div>
              <div className="text-[8px] font-mono font-bold text-[#4c5c4a] uppercase">Hours</div>
            </div>
            <div className="bg-[#cbd8ca] border-2 border-[#b0bdae] rounded-lg p-2 shadow-inner text-center">
              <div className="text-2xl font-mono font-extrabold text-[#1a2019]">{minutes}</div>
              <div className="text-[8px] font-mono font-bold text-[#4c5c4a] uppercase">Min</div>
            </div>
            <div className="bg-[#cbd8ca] border-2 border-[#b0bdae] rounded-lg p-2 shadow-inner text-center">
              <div className="text-2xl font-mono font-extrabold text-[#1a2019]">{seconds}</div>
              <div className="text-[8px] font-mono font-bold text-[#4c5c4a] uppercase">Sec</div>
            </div>
          </div>
          <div className="mt-3">
            <ResultDisplay label="Total Days" value={`${isPast ? '−' : ''}${days} days ${hours}h ${minutes}m`} />
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}
