'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function BillSplitterCalculator() {
  const [billStr, setBillStr] = useState('100')
  const [peopleStr, setPeopleStr] = useState('4')
  const [tipStr, setTipStr] = useState('15') // % tip

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, total: 0, perPerson: 0 }
    const bill = parseFloat(billStr)
    const people = parseInt(peopleStr)
    const tip = parseFloat(tipStr)

    if (isNaN(bill) || isNaN(people) || isNaN(tip) || bill <= 0 || people <= 0 || tip < 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const total = bill * (1 + tip / 100)
    const perPerson = total / people
    return { error: null, total, perPerson }
  }, [billStr, peopleStr, tipStr])

  return (
    <FormCalculatorShell title="Bill Splitter Solver" subtitle="Calculate individual shares for group dining bills with tips" badge="MISCELLANEOUS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Total Bill Amount ($)" value={billStr} onChange={setBillStr} id="bs-b" />
          <RetroInput label="Number of People" value={peopleStr} onChange={setPeopleStr} id="bs-p" />
          <RetroInput label="Tip Percentage (%)" value={tipStr} onChange={setTipStr} id="bs-t" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Grand Total (with tip)" value={results.total.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} />
              <ResultDisplay label="Amount per Person" value={results.perPerson.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
