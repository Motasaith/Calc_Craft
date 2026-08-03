'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'
import { Plus, Trash2, User, RefreshCw, HelpCircle, ArrowRight } from 'lucide-react'

interface Person {
  id: string
  name: string
  dob: string
}

export default function AgeDifferenceCalculator() {
  const [persons, setPersons] = useState<Person[]>([
    { id: '1', name: 'Alice', dob: '1990-05-15' },
    { id: '2', name: 'Bob', dob: '1995-08-20' }
  ])
  const [refPersonId, setRefPersonId] = useState<string>('1')

  const addPerson = () => {
    const nextId = (Math.max(...persons.map(p => parseInt(p.id) || 0)) + 1).toString()
    setPersons([...persons, { id: nextId, name: `Person ${nextId}`, dob: new Date().toISOString().split('T')[0] }])
  }

  const removePerson = (id: string) => {
    if (persons.length > 2) {
      const filtered = persons.filter(p => p.id !== id)
      setPersons(filtered)
      if (refPersonId === id) {
        setRefPersonId(filtered[0].id)
      }
    }
  }

  const updatePerson = (id: string, field: keyof Person, val: string) => {
    setPersons(persons.map(p => (p.id === id ? { ...p, [field]: val } : p)))
  }

  // Calculations
  const calculated = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const list = persons.map(p => {
      const birth = new Date(p.dob + 'T00:00:00')
      if (isNaN(birth.getTime())) {
        return { ...p, birth: null, ageY: 0, ageM: 0, ageD: 0, ageDays: 0, formattedAge: '', error: true }
      }

      // Calculate current age
      let ageY = today.getFullYear() - birth.getFullYear()
      let ageM = today.getMonth() - birth.getMonth()
      let ageD = today.getDate() - birth.getDate()

      if (ageD < 0) {
        ageM--
        const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0)
        ageD += prevMonth.getDate()
      }
      if (ageM < 0) {
        ageY--
        ageM += 12
      }

      const ageDays = Math.floor((today.getTime() - birth.getTime()) / 86400000)

      return {
        ...p,
        birth,
        ageY,
        ageM,
        ageD,
        ageDays,
        formattedAge: `${ageY}y ${ageM}m ${ageD}d`,
        error: false
      }
    })

    const hasError = list.some(p => p.error)
    if (hasError) return { list: [], differences: [], error: true }

    // Sort list by birthdate to find oldest/youngest
    const sorted = [...list].sort((a, b) => a.birth!.getTime() - b.birth!.getTime())
    const oldest = sorted[0]
    const youngest = sorted[sorted.length - 1]

    // Calculate pairwise differences relative to the selected reference person
    const refPerson = list.find(p => p.id === refPersonId) || list[0]
    
    const differences = list.map(p => {
      if (p.id === refPerson.id) return null

      // Compare dates
      const earlier = p.birth!.getTime() < refPerson.birth!.getTime() ? p.birth! : refPerson.birth!
      const later = p.birth!.getTime() < refPerson.birth!.getTime() ? refPerson.birth! : p.birth!

      let diffY = later.getFullYear() - earlier.getFullYear()
      let diffM = later.getMonth() - earlier.getMonth()
      let diffD = later.getDate() - earlier.getDate()

      if (diffD < 0) {
        diffM--
        const prevMonth = new Date(later.getFullYear(), later.getMonth(), 0)
        diffD += prevMonth.getDate()
      }
      if (diffM < 0) {
        diffY--
        diffM += 12
      }

      const diffDays = Math.floor((later.getTime() - earlier.getTime()) / 86400000)
      const isOlder = p.birth!.getTime() < refPerson.birth!.getTime()

      return {
        targetName: p.name,
        refName: refPerson.name,
        diffY,
        diffM,
        diffD,
        diffDays,
        isOlder,
        formattedDiff: `${diffY}y ${diffM}m ${diffD}d`,
        text: `${p.name} is ${diffY}y ${diffM}m ${diffD}d ${isOlder ? 'older' : 'younger'} than ${refPerson.name}`
      }
    }).filter(Boolean)

    return {
      list,
      differences,
      oldest,
      youngest,
      refPerson,
      error: false
    }
  }, [persons, refPersonId])

  // SVG Birth Timeline variables
  const timelineData = useMemo(() => {
    if (calculated.error || !calculated.list || calculated.list.length === 0) return null

    // Find the range of DOBs
    const times = calculated.list.map(p => p.birth!.getTime())
    const minTime = Math.min(...times)
    const maxTime = Math.max(...times)
    const timeSpan = Math.max(1, maxTime - minTime)

    // Render coordinates (x from 20 to 480)
    const scale = (t: number) => 20 + ((t - minTime) / timeSpan) * 460

    const colors = ['#8ab4a0', '#dfaa44', '#b5655c', '#4c5c4a', '#818cf8', '#fb7185']

    return calculated.list.map((p, idx) => ({
      name: p.name,
      x: scale(p.birth!.getTime()),
      dobStr: p.dob,
      color: colors[idx % colors.length]
    }))
  }, [calculated])

  return (
    <FormCalculatorShell title="Age Difference Calculator" subtitle="Compare ages and birth timelines of multiple people" badge="EVERYDAY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        
        {/* ── Left Column: Inputs ── */}
        <div className="space-y-4">
          <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1">
            {persons.map((person, idx) => (
              <div key={person.id} className="p-3.5 rounded-xl border border-neutral-300 bg-white/50 space-y-2.5 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-neutral-500 font-mono">PERSON #{idx + 1}</span>
                  {persons.length > 2 && (
                    <button
                      onClick={() => removePerson(person.id)}
                      className="p-1 text-neutral-400 hover:text-red-600 rounded transition"
                      title="Remove Person"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <RetroInput
                    label="Name"
                    value={person.name}
                    onChange={(v) => updatePerson(person.id, 'name', v)}
                    placeholder="e.g. Alice"
                    id={`ad-n-${person.id}`}
                  />
                  <div>
                    <label htmlFor={`ad-d-${person.id}`} className="block text-[10px] font-extrabold text-neutral-600 font-mono uppercase tracking-wider mb-1.5">Date of Birth</label>
                    <input
                      type="date"
                      id={`ad-d-${person.id}`}
                      value={person.dob}
                      onChange={(e) => updatePerson(person.id, 'dob', e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-neutral-350 rounded-lg text-sm font-mono font-bold focus:outline-none focus:border-neutral-500 shadow-inner"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addPerson}
            className="w-full h-10 flex items-center justify-center gap-1.5 text-xs font-extrabold font-mono rounded-lg border-2 border-dashed border-neutral-400 text-neutral-600 hover:text-neutral-800 hover:border-neutral-600 transition"
          >
            <Plus className="w-4 h-4" /> Add Another Person
          </button>

          {/* Reference Person selector */}
          {!calculated.error && calculated.list && (
            <div className="space-y-1">
              <label htmlFor="ad-ref" className="block text-[10px] font-extrabold text-neutral-600 font-mono uppercase tracking-wider">Compare everyone to</label>
              <select
                id="ad-ref"
                value={refPersonId}
                onChange={(e) => setRefPersonId(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-neutral-350 rounded-lg text-sm font-mono font-bold focus:outline-none focus:border-neutral-500 shadow-inner cursor-pointer"
              >
                {calculated.list.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* ── Right Column: Results ── */}
        <div className="min-h-[440px]">
          {!calculated.error && calculated.list ? (
            <div className="space-y-4">
              
              {/* Ages Summary */}
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">
                  Current Ages
                </p>
                <div className="divide-y divide-neutral-200">
                  {calculated.list.map(p => (
                    <div key={p.id} className="p-3 flex justify-between items-center text-xs font-mono">
                      <span className="font-extrabold text-neutral-800 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-neutral-500" /> {p.name}
                      </span>
                      <div className="text-right">
                        <span className="font-bold text-neutral-800">{p.formattedAge}</span>
                        <span className="block text-[10px] text-neutral-500">({p.ageDays.toLocaleString()} days)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pairwise Differences */}
              {calculated.differences.length > 0 && (
                <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                  <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">
                    Age Gaps relative to {calculated.refPerson?.name}
                  </p>
                  <div className="divide-y divide-neutral-200">
                    {calculated.differences.map((diff, idx) => diff && (
                      <div key={idx} className="p-3 flex justify-between items-center text-xs font-mono">
                        <span className="text-neutral-500 font-bold">{diff.targetName}</span>
                        <div className="text-right">
                          <span className={`font-extrabold ${diff.isOlder ? 'text-emerald-800' : 'text-indigo-800'}`}>
                            {diff.isOlder ? 'Older' : 'Younger'} by {diff.formattedDiff}
                          </span>
                          <span className="block text-[10px] text-neutral-500">({diff.diffDays.toLocaleString()} days gap)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline Visual */}
              {timelineData && (
                <div className="rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-4">
                  <p className="mb-4 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">
                    Birthdate Timeline Scale
                  </p>
                  <svg viewBox="0 0 500 80" className="w-full h-20" role="img" aria-label="Visual timeline showing relative separation of birth dates.">
                    <line x1="20" y1="40" x2="480" y2="40" stroke="#a3a3a3" strokeWidth="2.5" />
                    {timelineData.map((pt, idx) => (
                      <g key={idx}>
                        <circle cx={pt.x} cy="40" r="7" fill={pt.color} stroke="white" strokeWidth="2" />
                        <line x1={pt.x} y1="40" x2={pt.x} y2={idx % 2 === 0 ? 15 : 65} stroke={pt.color} strokeWidth="1" strokeDasharray="2 2" />
                        <text
                          x={pt.x}
                          y={idx % 2 === 0 ? 10 : 75}
                          fontSize="9"
                          fontWeight="bold"
                          fill="#1f2937"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {pt.name}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              )}
            </div>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500 font-mono p-6 text-center">
              Please fix validation errors or fill out birth dates.
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}