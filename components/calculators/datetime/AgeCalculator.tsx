'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { ResultDisplay } from '../shared/FormCalculatorShell'
import { calculateAge, calculateDateDifference } from '@/lib/calc-engine'

// Age Sketchbook Visualizer: Hand-drawn graphite pencil sketchbook style
function AgeSketchbook({ years }: { years: number }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear and fill base sketchbook paper
    ctx.clearRect(0, 0, 150, 150)
    ctx.fillStyle = '#fdfcf7'
    ctx.fillRect(0, 0, 150, 150)

    // Draft grid overlay (nostalgic paper graph aesthetic)
    ctx.strokeStyle = 'rgba(76, 92, 74, 0.08)'
    ctx.lineWidth = 1
    for (let x = 15; x < 150; x += 15) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, 150)
      ctx.stroke()
    }
    for (let y = 15; y < 150; y += 15) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(150, y)
      ctx.stroke()
    }

    // Sketch graphite styling
    ctx.strokeStyle = '#2d332f'
    ctx.lineWidth = 1.6
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // Custom wobbly line to simulate sketchy strokes
    const drawSketchyLine = (x1: number, y1: number, x2: number, y2: number) => {
      const dx = x2 - x1
      const dy = y2 - y1
      const dist = Math.sqrt(dx * dx + dy * dy)
      const steps = Math.max(3, Math.floor(dist / 8))
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      for (let i = 1; i <= steps; i++) {
        const t = i / steps
        const rx = x1 + dx * t + (Math.random() - 0.5) * 1.6
        const ry = y1 + dy * t + (Math.random() - 0.5) * 1.6
        ctx.lineTo(rx, ry)
      }
      ctx.stroke()
    }

    // Custom wobbly circle
    const drawSketchyCircle = (cx: number, cy: number, r: number) => {
      ctx.beginPath()
      const steps = 32
      for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * Math.PI * 2
        const wobble = (Math.random() - 0.5) * 1.4
        const x = cx + (r + wobble) * Math.cos(theta)
        const y = cy + (r + wobble) * Math.sin(theta)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }

    // Custom wobbly arc for smiles / hair wrinkles
    const drawSketchyArc = (cx: number, cy: number, r: number, start: number, end: number) => {
      ctx.beginPath()
      const steps = 16
      const step = (end - start) / steps
      for (let i = 0; i <= steps; i++) {
        const theta = start + step * i
        const wobble = (Math.random() - 0.5) * 0.9
        const x = cx + (r + wobble) * Math.cos(theta)
        const y = cy + (r + wobble) * Math.sin(theta)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }

    // Draw sketchy character depending on age bracket
    if (years <= 2) {
      // BABY
      drawSketchyCircle(75, 75, 28) // head
      drawSketchyCircle(66, 70, 3.5) // left eye
      drawSketchyCircle(84, 70, 3.5) // right eye
      drawSketchyArc(75, 82, 8, 0.1 * Math.PI, 0.9 * Math.PI) // smile
      drawSketchyArc(75, 47, 10, Math.PI * 1.1, Math.PI * 1.9) // single curl hair
    } else if (years <= 12) {
      // CHILD
      drawSketchyCircle(75, 70, 25) // head
      drawSketchyCircle(66, 68, 3) // eyes
      drawSketchyCircle(84, 68, 3)
      drawSketchyArc(75, 76, 9, 0.1 * Math.PI, 0.9 * Math.PI) // smile
      // spiky child hair
      drawSketchyLine(53, 56, 56, 44)
      drawSketchyLine(56, 44, 64, 48)
      drawSketchyLine(64, 48, 72, 40)
      drawSketchyLine(72, 40, 80, 46)
      drawSketchyLine(80, 46, 88, 38)
      drawSketchyLine(88, 38, 96, 48)
      drawSketchyLine(96, 48, 98, 56)
    } else if (years <= 19) {
      // TEENAGER
      drawSketchyCircle(75, 72, 28) // head
      // Cool spiky side hair
      drawSketchyLine(48, 62, 54, 46)
      drawSketchyLine(54, 46, 62, 50)
      drawSketchyLine(62, 50, 72, 42)
      drawSketchyLine(72, 42, 84, 46)
      drawSketchyLine(84, 46, 96, 42)
      drawSketchyLine(96, 42, 102, 60)
      // Cool sunglasses
      drawSketchyLine(60, 68, 70, 68)
      drawSketchyLine(80, 68, 90, 68)
      drawSketchyArc(75, 80, 10, 0.2 * Math.PI, 0.8 * Math.PI) // smirk
    } else if (years <= 35) {
      // YOUNG ADULT
      drawSketchyCircle(75, 70, 28) // head
      drawSketchyCircle(63, 68, 7.5) // glasses
      drawSketchyCircle(87, 68, 7.5)
      drawSketchyLine(70, 68, 80, 68) // bridge
      // Styled hair outline
      drawSketchyArc(75, 66, 32, Math.PI * 1.1, Math.PI * 1.9)
      drawSketchyLine(46, 66, 52, 74)
      drawSketchyLine(104, 66, 98, 74)
      drawSketchyArc(75, 78, 8, 0, Math.PI) // friendly smile
    } else if (years <= 60) {
      // MIDDLE AGED
      drawSketchyCircle(75, 70, 27) // head
      drawSketchyArc(75, 64, 29, Math.PI * 1.25, Math.PI * 1.75) // receding hair
      drawSketchyLine(47, 66, 55, 52)
      drawSketchyLine(103, 66, 95, 52)
      drawSketchyCircle(66, 68, 2) // small eyes
      drawSketchyCircle(84, 68, 2)
      drawSketchyLine(65, 50, 85, 50) // forehead lines
      drawSketchyLine(60, 54, 90, 54)
      drawSketchyArc(75, 82, 12, Math.PI * 1.2, Math.PI * 1.8) // flat calm mouth
    } else {
      // ELDERLY / SENIOR
      drawSketchyCircle(75, 70, 26) // head
      drawSketchyArc(49, 70, 5, Math.PI * 0.5, Math.PI * 1.5) // thin side hair
      drawSketchyArc(101, 70, 5, Math.PI * 1.5, Math.PI * 2.5)
      drawSketchyLine(58, 48, 92, 48) // wrinkles
      drawSketchyLine(62, 52, 88, 52)
      drawSketchyLine(66, 56, 84, 56)
      // crow's feet wrinkles
      drawSketchyLine(56, 66, 60, 68)
      drawSketchyLine(56, 70, 60, 68)
      drawSketchyLine(94, 66, 90, 68)
      drawSketchyLine(94, 70, 90, 68)
      drawSketchyCircle(65, 68, 1.8)
      drawSketchyCircle(85, 68, 1.8)
      drawSketchyArc(75, 80, 5, 0.1 * Math.PI, 0.9 * Math.PI) // wise smile
    }

  }, [years])

  return (
    <div className="flex flex-col items-center select-none">
      <canvas 
        ref={canvasRef} 
        width="150" 
        height="150" 
        className="border border-neutral-300 rounded-xl shadow-inner bg-[#fdfcf7] pointer-events-none" 
      />
      <span className="text-[10px] font-bold text-neutral-500 font-mono mt-1.5 uppercase tracking-wide">
        {years <= 2 ? 'Baby' : years <= 12 ? 'Child' : years <= 19 ? 'Teen' : years <= 35 ? 'Adult' : years <= 60 ? 'Mid-Age' : 'Senior'}
      </span>
    </div>
  )
}

export default function AgeCalculator() {
  const [dob, setDob] = useState('')
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0])

  const d1 = dob ? new Date(dob) : null
  const d2 = toDate ? new Date(toDate) : new Date()
  const valid = d1 && !isNaN(d1.getTime()) && d2 && !isNaN(d2.getTime()) && d1 <= d2

  const age = valid ? calculateAge(d1!, d2) : { years: 0, months: 0, days: 0, totalDays: 0 }
  const totalWeeks = Math.floor(age.totalDays / 7)
  const totalHours = age.totalDays * 24

  const nextBirthday = (() => {
    if (!d1) return null
    const now = d2 || new Date()
    const next = new Date(now.getFullYear(), d1.getMonth(), d1.getDate())
    if (next <= now) next.setFullYear(next.getFullYear() + 1)
    const diff = calculateDateDifference(now, next)
    return diff.totalDays
  })()

  return (
    <FormCalculatorShell title="Age Calculator" badge="DATE & TIME">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_160px] gap-4 items-center">
        <div className="space-y-3">
          <div className="mb-1">
            <label htmlFor="age-dob" className="block text-[11px] font-bold text-neutral-600 font-mono uppercase tracking-wider mb-1.5">Date of Birth</label>
            <input type="date" id="age-dob" value={dob} onChange={(e) => setDob(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full h-10 px-3 bg-[#fcfbfa] border-2 border-neutral-300 rounded-lg text-sm font-mono font-bold text-neutral-800 focus:outline-none focus:border-neutral-500 transition-all shadow-inner" />
          </div>
          <div className="mb-1">
            <label htmlFor="age-to" className="block text-[11px] font-bold text-neutral-600 font-mono uppercase tracking-wider mb-1.5">As Of Date</label>
            <input type="date" id="age-to" value={toDate} onChange={(e) => setToDate(e.target.value)}
              className="w-full h-10 px-3 bg-[#fcfbfa] border-2 border-neutral-300 rounded-lg text-sm font-mono font-bold text-neutral-800 focus:outline-none focus:border-neutral-500 transition-all shadow-inner" />
          </div>
        </div>

        {/* Dynamic Sketchbook Age stage drawer */}
        <div className="flex justify-center items-center bg-[#cbd8ca]/30 border border-neutral-300 rounded-xl p-2 min-h-[175px] w-full">
          <AgeSketchbook years={age.years} />
        </div>
      </div>

      {valid && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          <ResultDisplay label="Years" value={age.years.toString()} large />
          <ResultDisplay label="Months" value={age.months.toString()} large />
          <ResultDisplay label="Days" value={age.days.toString()} large />
          <ResultDisplay label="Total Days" value={age.totalDays.toLocaleString()} />
          <ResultDisplay label="Total Weeks" value={totalWeeks.toLocaleString()} />
          <ResultDisplay label="Total Hours" value={totalHours.toLocaleString()} />
          {nextBirthday !== null && <div className="col-span-3"><ResultDisplay label="Days Until Next Birthday" value={nextBirthday.toString()} /></div>}
        </div>
      )}
    </FormCalculatorShell>
  )
}
