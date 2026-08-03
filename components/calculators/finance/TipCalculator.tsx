'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'
import { Plus, Trash2, Users, Receipt, DollarSign, Percent } from 'lucide-react'

type Mode = 'simple' | 'itemized'
type Rounding = 'none' | 'tip-up' | 'total-up' | 'person-up'

interface BillItem {
  id: string
  name: string
  price: string
  assignedTo: string // Person ID or 'shared'
}

interface Diner {
  id: string
  name: string
}

export default function TipCalculator() {
  const [mode, setMode] = useState<Mode>('simple')

  // Simple Mode States
  const [billVal, setBillVal] = useState('50.00')
  const [tipPctVal, setTipPctVal] = useState('15')
  const [taxPctVal, setTaxPctVal] = useState('0')
  const [peopleVal, setPeopleVal] = useState('1')
  const [rounding, setRounding] = useState<Rounding>('none')

  // Itemized Mode States
  const [diners, setDiners] = useState<Diner[]>([
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' }
  ])
  const [items, setItems] = useState<BillItem[]>([
    { id: '1', name: 'Appetizer', price: '12.00', assignedTo: 'shared' },
    { id: '2', name: 'Alice main', price: '24.00', assignedTo: '1' },
    { id: '3', name: 'Bob main', price: '18.00', assignedTo: '2' }
  ])
  const [itemizedTipPct, setItemizedTipPct] = useState('15')
  const [itemizedTaxPct, setItemizedTaxPct] = useState('8')

  // Diner dynamic actions
  const addDiner = () => {
    const nextId = (Math.max(...diners.map(d => parseInt(d.id) || 0)) + 1).toString()
    setDiners([...diners, { id: nextId, name: `Diner ${nextId}` }])
  }

  const removeDiner = (id: string) => {
    if (diners.length > 1) {
      setDiners(diners.filter(d => d.id !== id))
      // Re-assign items allocated to this diner to 'shared'
      setItems(items.map(item => (item.assignedTo === id ? { ...item, assignedTo: 'shared' } : item)))
    }
  }

  const updateDiner = (id: string, name: string) => {
    setDiners(diners.map(d => (d.id === id ? { ...d, name } : d)))
  }

  // Item actions
  const addItem = () => {
    const nextId = (Math.max(...items.map(it => parseInt(it.id) || 0)) + 1).toString()
    setItems([...items, { id: nextId, name: `Item ${nextId}`, price: '0.00', assignedTo: 'shared' }])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(it => it.id !== id))
    }
  }

  const updateItem = (id: string, field: keyof BillItem, val: string) => {
    setItems(items.map(it => (it.id === id ? { ...it, [field]: val } : it)))
  }

  // Simple Mode Calculations
  const simpleResults = useMemo(() => {
    if (mode !== 'simple') return null
    const bill = parseFloat(billVal) || 0
    const tipPct = parseFloat(tipPctVal) || 0
    const taxPct = parseFloat(taxPctVal) || 0
    const people = Math.max(1, parseInt(peopleVal) || 1)

    let rawTax = bill * (taxPct / 100)
    let rawTip = bill * (tipPct / 100)
    let rawTotal = bill + rawTax + rawTip
    let rawPerPerson = rawTotal / people

    // Apply Rounding
    let finalTip = rawTip
    let finalTotal = rawTotal
    let finalPerPerson = rawPerPerson

    if (rounding === 'tip-up') {
      finalTip = Math.ceil(rawTip)
      finalTotal = bill + rawTax + finalTip
      finalPerPerson = finalTotal / people
    } else if (rounding === 'total-up') {
      finalTotal = Math.ceil(rawTotal)
      finalTip = Math.max(0, finalTotal - bill - rawTax)
      finalPerPerson = finalTotal / people
    } else if (rounding === 'person-up') {
      finalPerPerson = Math.ceil(rawPerPerson)
      finalTotal = finalPerPerson * people
      finalTip = Math.max(0, finalTotal - bill - rawTax)
    }

    return {
      tax: rawTax,
      tip: finalTip,
      total: finalTotal,
      perPerson: finalPerPerson,
      bill
    }
  }, [billVal, tipPctVal, taxPctVal, peopleVal, rounding, mode])

  // Itemized Mode Calculations
  const itemizedResults = useMemo(() => {
    if (mode !== 'itemized') return null

    const tipFactor = (parseFloat(itemizedTipPct) || 0) / 100
    const taxFactor = (parseFloat(itemizedTaxPct) || 0) / 100

    let baseSubtotal = 0
    const dinerSubtotals: Record<string, number> = {}
    diners.forEach(d => {
      dinerSubtotals[d.id] = 0
    })

    // Sum up items
    items.forEach(item => {
      const price = parseFloat(item.price) || 0
      baseSubtotal += price

      if (item.assignedTo === 'shared') {
        const splitPrice = price / diners.length
        diners.forEach(d => {
          dinerSubtotals[d.id] += splitPrice
        })
      } else {
        if (dinerSubtotals[item.assignedTo] !== undefined) {
          dinerSubtotals[item.assignedTo] += price
        }
      }
    })

    // Calculate tax/tip proportions
    let grandTotal = 0
    let totalTip = baseSubtotal * tipFactor
    let totalTax = baseSubtotal * taxFactor
    grandTotal = baseSubtotal + totalTip + totalTax

    const dinerBreakdowns = diners.map(d => {
      const sub = dinerSubtotals[d.id] || 0
      const tip = sub * tipFactor
      const tax = sub * taxFactor
      const total = sub + tip + tax

      return {
        id: d.id,
        name: d.name,
        subtotal: sub,
        tip,
        tax,
        total
      }
    })

    return {
      baseSubtotal,
      totalTip,
      totalTax,
      grandTotal,
      breakdown: dinerBreakdowns
    }
  }, [diners, items, itemizedTipPct, itemizedTaxPct, mode])

  // Interactive Visuals (horizontal stacked bar chart data)
  const chartData = useMemo(() => {
    if (mode === 'simple' && simpleResults) {
      const { bill, tax, tip } = simpleResults
      const total = bill + tax + tip
      if (total === 0) return []
      return [
        { label: 'Subtotal', value: bill, pct: (bill / total) * 100, color: '#8ab4a0' },
        { label: 'Tax', value: tax, pct: (tax / total) * 100, color: '#dfaa44' },
        { label: 'Tip', value: tip, pct: (tip / total) * 100, color: '#b5655c' }
      ]
    } else if (mode === 'itemized' && itemizedResults) {
      const { grandTotal, breakdown } = itemizedResults
      if (grandTotal === 0) return []
      const colors = ['#8ab4a0', '#dfaa44', '#b5655c', '#4c5c4a', '#818cf8', '#fb7185']
      return breakdown.map((d, idx) => ({
        label: d.name,
        value: d.total,
        pct: (d.total / grandTotal) * 100,
        color: colors[idx % colors.length]
      }))
    }
    return []
  }, [simpleResults, itemizedResults, mode])

  return (
    <FormCalculatorShell title="Tip & Bill Splitting Calculator" subtitle="Quick splits with rounding, tax, and itemized assignments" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        
        {/* ── Left Column: Inputs ── */}
        <div className="space-y-4">
          
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-neutral-200 p-1">
            <button
              onClick={() => setMode('simple')}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-mono font-bold uppercase transition ${
                mode === 'simple' ? 'bg-white text-neutral-900 shadow' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Simple Split
            </button>
            <button
              onClick={() => setMode('itemized')}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-mono font-bold uppercase transition ${
                mode === 'itemized' ? 'bg-white text-neutral-900 shadow' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" /> Itemized Split
            </button>
          </div>

          {/* Simple Mode Panel */}
          {mode === 'simple' && (
            <div className="space-y-3.5">
              <RetroInput
                label="Bill Total ($)"
                value={billVal}
                onChange={setBillVal}
                placeholder="50.00"
                id="tip-bill"
                unit="$"
              />

              <div className="grid grid-cols-2 gap-3">
                <RetroInput
                  label="Tip Percentage (%)"
                  value={tipPctVal}
                  onChange={setTipPctVal}
                  placeholder="15"
                  id="tip-pct"
                  unit="%"
                />
                <RetroInput
                  label="Sales Tax Rate (%)"
                  value={taxPctVal}
                  onChange={setTaxPctVal}
                  placeholder="0"
                  id="tip-tax"
                  unit="%"
                />
              </div>

              {/* Tip Preset Shortcuts */}
              <div className="flex gap-2">
                {['10', '15', '18', '20'].map(pct => (
                  <button
                    key={pct}
                    onClick={() => setTipPctVal(pct)}
                    className="flex-1 py-1.5 bg-neutral-200 text-neutral-800 text-[10px] font-bold font-mono rounded-md border border-neutral-350 hover:bg-neutral-300 transition"
                  >
                    {pct}%
                  </button>
                ))}
              </div>

              <RetroInput
                label="Split Between (Diners)"
                value={peopleVal}
                onChange={setPeopleVal}
                placeholder="1"
                id="tip-people"
              />

              <RetroSelect
                label="Rounding Strategy"
                value={rounding}
                onChange={(v) => setRounding(v as Rounding)}
                id="tip-round"
                options={[
                  { value: 'none', label: 'No rounding (Exact values)' },
                  { value: 'tip-up', label: 'Round up tip to next whole dollar' },
                  { value: 'total-up', label: 'Round up total bill to next whole dollar' },
                  { value: 'person-up', label: 'Round up per-person share' }
                ]}
              />
            </div>
          )}

          {/* Itemized Mode Panel */}
          {mode === 'itemized' && (
            <div className="space-y-4">
              
              {/* Diners list */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-neutral-600 font-mono uppercase tracking-wider block">Diners list</span>
                <div className="flex flex-wrap gap-2">
                  {diners.map(d => (
                    <div key={d.id} className="flex items-center gap-1 bg-white border border-neutral-350 rounded-lg pl-2.5 pr-1 py-1 shadow-sm text-xs font-mono">
                      <input
                        type="text"
                        value={d.name}
                        onChange={(e) => updateDiner(d.id, e.target.value)}
                        className="w-16 bg-transparent font-bold text-neutral-800 border-none outline-none focus:ring-0 p-0 text-xs"
                      />
                      {diners.length > 1 && (
                        <button onClick={() => removeDiner(d.id)} className="p-0.5 text-neutral-400 hover:text-red-650 transition">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addDiner}
                    className="h-7 px-2.5 flex items-center justify-center gap-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 text-[10px] font-extrabold font-mono rounded-lg border border-neutral-350 transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Diner
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-neutral-600 font-mono uppercase tracking-wider block">Bill Items</span>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {items.map(item => (
                    <div key={item.id} className="grid grid-cols-[4fr_2fr_3fr_auto] gap-1.5 items-center p-2 rounded-lg border border-neutral-200 bg-white/70">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        placeholder="Item name"
                        className="h-8 px-2 bg-white border border-neutral-350 rounded-lg text-xs font-mono font-bold focus:outline-none"
                      />
                      <input
                        type="text"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                        placeholder="0.00"
                        className="h-8 px-2 bg-white border border-neutral-350 rounded-lg text-xs font-mono font-bold focus:outline-none"
                      />
                      <select
                        value={item.assignedTo}
                        onChange={(e) => updateItem(item.id, 'assignedTo', e.target.value)}
                        className="h-8 px-1.5 bg-neutral-100 text-xs font-mono font-bold rounded-lg border border-neutral-300 focus:outline-none cursor-pointer"
                      >
                        <option value="shared">Shared</option>
                        {diners.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                      {items.length > 1 && (
                        <button onClick={() => removeItem(item.id)} className="p-1 text-neutral-400 hover:text-red-600 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={addItem}
                  className="w-full h-8 flex items-center justify-center gap-1.5 text-xs font-extrabold font-mono rounded-lg border border-neutral-350 bg-white/50 text-neutral-600 hover:text-neutral-800 transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Bill Item
                </button>
              </div>

              {/* Tax & Tip inputs */}
              <div className="grid grid-cols-2 gap-3">
                <RetroInput
                  label="Tax Rate (%)"
                  value={itemizedTaxPct}
                  onChange={setItemizedTaxPct}
                  placeholder="8"
                  id="itemized-tax"
                  unit="%"
                />
                <RetroInput
                  label="Tip Rate (%)"
                  value={itemizedTipPct}
                  onChange={setItemizedTipPct}
                  placeholder="15"
                  id="itemized-tip"
                  unit="%"
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Right Column: Results ── */}
        <div className="min-h-[440px]">
          {mode === 'simple' && simpleResults && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <ResultDisplay label="Per Person Pay" value={`$${simpleResults.perPerson.toFixed(2)}`} large />
                <ResultDisplay label="Total Bill (with tip/tax)" value={`$${simpleResults.total.toFixed(2)}`} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay label="Total Tip" value={`$${simpleResults.tip.toFixed(2)}`} />
                <ResultDisplay label="Total Tax" value={`$${simpleResults.tax.toFixed(2)}`} />
              </div>

              {/* Share visual stacked bar */}
              {chartData.length > 0 && (
                <div className="rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-4">
                  <p className="mb-3 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">
                    Simple Bill Allocation Breakdown
                  </p>
                  <div className="h-6 w-full rounded-md overflow-hidden flex">
                    {chartData.map((seg, idx) => (
                      <div
                        key={idx}
                        style={{ width: `${seg.pct}%`, backgroundColor: seg.color }}
                        className="h-full flex items-center justify-center text-[9px] font-extrabold text-white font-mono"
                        title={`${seg.label}: $${seg.value.toFixed(2)} (${seg.pct.toFixed(0)}%)`}
                      >
                        {seg.pct > 12 && `${seg.pct.toFixed(0)}%`}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3.5">
                    {chartData.map((seg, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs font-mono">
                        <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: seg.color }} />
                        <span className="text-neutral-500">{seg.label}:</span>
                        <span className="font-bold text-neutral-800">${seg.value.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {mode === 'itemized' && itemizedResults && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <ResultDisplay label="Subtotal" value={`$${itemizedResults.baseSubtotal.toFixed(2)}`} />
                <ResultDisplay label="Grand Total" value={`$${itemizedResults.grandTotal.toFixed(2)}`} large />
                <ResultDisplay label="Tip + Tax" value={`$${(itemizedResults.totalTip + itemizedResults.totalTax).toFixed(2)}`} />
              </div>

              {/* Proportional diner breakdowns */}
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">
                  Diner Balances
                </p>
                <div className="divide-y divide-neutral-200">
                  {itemizedResults.breakdown.map(d => (
                    <div key={d.id} className="p-3 flex justify-between items-center text-xs font-mono">
                      <div>
                        <span className="font-extrabold text-neutral-800 block">{d.name}</span>
                        <span className="text-[10px] text-neutral-500">
                          (Sub: ${d.subtotal.toFixed(2)} | Tax: ${d.tax.toFixed(2)} | Tip: ${d.tip.toFixed(2)})
                        </span>
                      </div>
                      <span className="font-extrabold text-lg text-[#4c5c4a]">${d.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Proportional visual chart */}
              {chartData.length > 0 && (
                <div className="rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-4">
                  <p className="mb-3 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">
                    Proportional Diner Distribution
                  </p>
                  <div className="h-6 w-full rounded-md overflow-hidden flex">
                    {chartData.map((seg, idx) => (
                      <div
                        key={idx}
                        style={{ width: `${seg.pct}%`, backgroundColor: seg.color }}
                        className="h-full flex items-center justify-center text-[9px] font-extrabold text-white font-mono"
                        title={`${seg.label}: $${seg.value.toFixed(2)} (${seg.pct.toFixed(0)}%)`}
                      >
                        {seg.pct > 12 && `${seg.pct.toFixed(0)}%`}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {chartData.map((seg, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs font-mono">
                        <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: seg.color }} />
                        <span className="text-neutral-500">{seg.label}:</span>
                        <span className="font-bold text-neutral-800">${seg.value.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
