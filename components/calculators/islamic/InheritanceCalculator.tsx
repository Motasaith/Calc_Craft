'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'
import { formatCurrency } from '@/lib/calc-engine'

export default function InheritanceCalculator() {
  const [estate, setEstate] = useState('100000')
  const [hasSpouse, setHasSpouse] = useState('yes')
  const [sons, setSons] = useState('2')
  const [daughters, setDaughters] = useState('1')
  const [parents, setParents] = useState('both')
  const [result, setResult] = useState<Record<string,number>|null>(null)

  const calculate = () => {
    const e = parseFloat(estate)
    const s = parseInt(sons), d = parseInt(daughters)
    if (isNaN(e)||isNaN(s)||isNaN(d)) { setResult(null); return }
    let remaining = e
    const shares: Record<string,number> = {}
    if (hasSpouse === 'yes') {
      const spouseShare = e * 0.125
      shares['Spouse'] = spouseShare
      remaining -= spouseShare
    }
    if (parents === 'both' || parents === 'father') {
      const fatherShare = e * 0.1667
      shares['Father'] = fatherShare
      remaining -= fatherShare
    }
    if (parents === 'both' || parents === 'mother') {
      const motherShare = e * 0.1667
      shares['Mother'] = motherShare
      remaining -= motherShare
    }
    const totalParts = s * 2 + d
    if (totalParts > 0) {
      const partValue = remaining / totalParts
      for (let i = 1; i <= s; i++) shares[`Son ${i}`] = partValue * 2
      for (let i = 1; i <= d; i++) shares[`Daughter ${i}`] = partValue
    }
    setResult(shares)
  }

  return (
    <FormCalculatorShell title="Islamic Inheritance" badge="ISLAMIC">
      <RetroInput label="Estate Value" value={estate} onChange={setEstate} placeholder="100000" id="inh-est" unit="$" />
      <RetroSelect label="Spouse" value={hasSpouse} onChange={setHasSpouse} options={[{value:'yes',label:'Yes'},{value:'no',label:'No'}]} id="inh-spouse" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Sons" value={sons} onChange={setSons} placeholder="2" id="inh-sons" />
        <RetroInput label="Daughters" value={daughters} onChange={setDaughters} placeholder="1" id="inh-dau" />
      </div>
      <RetroSelect label="Parents" value={parents} onChange={setParents} options={[{value:'both',label:'Both'},{value:'father',label:'Father only'},{value:'mother',label:'Mother only'},{value:'none',label:'None'}]} id="inh-par" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate Shares</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          {Object.entries(result).map(([k,v]) => <ResultDisplay key={k} label={k} value={formatCurrency(v)} />)}
        </div>
      )}
    </FormCalculatorShell>
  )
}
