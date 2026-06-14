'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function DateCalculator() {
  const [date, setDate] = useState('')
  const [amount, setAmount] = useState('30')
  const [unit, setUnit] = useState<'days' | 'weeks' | 'months' | 'years'>('days')
  const [operation, setOperation] = useState<'add' | 'subtract'>('add')
  const [result, setResult] = useState('')

  const calculate = () => {
    if (!date) { setResult(''); return }
    const d = new Date(date)
    const amt = parseInt(amount)
    if (isNaN(amt)) { setResult('Invalid'); return }
    const sign = operation === 'add' ? 1 : -1
    switch (unit) {
      case 'days': d.setDate(d.getDate() + amt * sign); break
      case 'weeks': d.setDate(d.getDate() + amt * 7 * sign); break
      case 'months': d.setMonth(d.getMonth() + amt * sign); break
      case 'years': d.setFullYear(d.getFullYear() + amt * sign); break
    }
    setResult(d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
  }

  return (
    <FormCalculatorShell title="Date Calculator" badge="DATE & TIME">
      <RetroInput label="Start Date" value={date} onChange={setDate} type="date" id="dc-date" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Amount" value={amount} onChange={setAmount} placeholder="30" id="dc-amt" />
        <RetroSelect label="Unit" value={unit} onChange={(v) => setUnit(v as any)} options={[{value:'days',label:'Days'},{value:'weeks',label:'Weeks'},{value:'months',label:'Months'},{value:'years',label:'Years'}]} id="dc-unit" />
      </div>
      <RetroSelect label="Operation" value={operation} onChange={(v) => setOperation(v as any)} options={[{value:'add',label:'Add'},{value:'subtract',label:'Subtract'}]} id="dc-op" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Result Date" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
