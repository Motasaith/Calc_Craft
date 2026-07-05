'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function HeatOfReactionCalculator() {
  const [reactants, setReactants] = useState('-1200')
  const [products, setProducts] = useState('-1500')

  const rh = parseFloat(reactants), ph = parseFloat(products)
  const valid = !isNaN(rh) && !isNaN(ph)
  const deltaH = valid ? ph - rh : 0
  const isExothermic = deltaH < 0

  return (
    <FormCalculatorShell title="Heat of Reaction" subtitle="ΔH = ΣH(products) - ΣH(reactants)" badge="CHEMISTRY">
      <RetroInput label="Reactants Enthalpy" value={reactants} onChange={setReactants} placeholder="-1200" id="hr-r" unit="kJ" />
      <RetroInput label="Products Enthalpy" value={products} onChange={setProducts} placeholder="-1500" id="hr-p" unit="kJ" />
      {valid && (
        <>
          <div className="mt-4">
            <ResultDisplay label="ΔH (Heat of Reaction)" value={deltaH.toFixed(2)} unit="kJ" large />
          </div>
          <div className="mt-2 text-center">
            <span className={`text-[10px] font-bold font-mono uppercase ${isExothermic ? 'text-red-600' : 'text-blue-600'}`}>
              {isExothermic ? '▼ Exothermic (releases heat)' : '▲ Endothermic (absorbs heat)'}
            </span>
          </div>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Energy Diagram</span>
            <svg width="180" height="100" viewBox="0 0 180 100" className="select-none">
              <defs>
                <pattern id="hrGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                  <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="180" height="100" fill="url(#hrGrid)" rx="8" />
              <path d="M 25 85 L 25 15" stroke="#6b7280" strokeWidth="1.5" />
              <path d="M 25 85 L 165 85" stroke="#6b7280" strokeWidth="1.5" />
              {/* Reactant level */}
              <path d={wobblyBar(30, 40, 40, 3)} fill="#3b82f6" fillOpacity="0.3" stroke="#2563eb" strokeWidth="1.5" />
              <text x="50" y="38" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#2563eb">Reactants</text>
              {/* Product level */}
              <path d={wobblyBar(110, isExothermic ? 60 : 25, 40, 3)} fill="#ef4444" fillOpacity="0.3" stroke="#dc2626" strokeWidth="1.5" />
              <text x="130" y={isExothermic ? 58 : 23} textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#dc2626">Products</text>
              {/* Arrow */}
              <path d={`M 75 ${isExothermic ? 42 : 42} L 105 ${isExothermic ? 62 : 27}`} stroke={isExothermic ? '#dc2626' : '#2563eb'} strokeWidth="2" />
              <text x="90" y="15" textAnchor="middle" fontSize="8" fontFamily="monospace" fill={isExothermic ? '#dc2626' : '#2563eb'} fontWeight="bold">ΔH = {deltaH.toFixed(0)} kJ</text>
            </svg>
          </div>
        </>
      )}
    </FormCalculatorShell>
  )
}