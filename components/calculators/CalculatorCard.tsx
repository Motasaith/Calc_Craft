import React from 'react'
import Link from 'next/link'
import { Calculator, ArrowRight } from 'lucide-react'
import { CalculatorEntry, CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/calculators'

const categoryMeta: Record<string, { gradient: string }> = {
  math: { gradient: 'from-blue-500 to-indigo-500' },
  finance: { gradient: 'from-emerald-500 to-teal-500' },
  health: { gradient: 'from-rose-500 to-pink-500' },
  conversion: { gradient: 'from-amber-500 to-orange-500' },
  datetime: { gradient: 'from-violet-500 to-purple-500' },
  everyday: { gradient: 'from-cyan-500 to-blue-500' },
  statistics: { gradient: 'from-fuchsia-500 to-purple-500' },
  geometry: { gradient: 'from-sky-500 to-blue-500' },
  trigonometry: { gradient: 'from-indigo-500 to-blue-500' },
  physics: { gradient: 'from-yellow-500 to-orange-500' },
  chemistry: { gradient: 'from-green-500 to-emerald-500' },
  science: { gradient: 'from-teal-500 to-cyan-500' },
  business: { gradient: 'from-slate-500 to-gray-500' },
  construction: { gradient: 'from-stone-500 to-neutral-500' },
  real_estate: { gradient: 'from-blue-600 to-indigo-600' },
  automotive: { gradient: 'from-red-500 to-rose-500' },
  cooking: { gradient: 'from-orange-500 to-amber-500' },
  sports: { gradient: 'from-lime-500 to-green-500' },
  education: { gradient: 'from-blue-400 to-indigo-400' },
  environment: { gradient: 'from-emerald-400 to-teal-400' },
  agriculture: { gradient: 'from-green-600 to-emerald-600' },
  engineering: { gradient: 'from-gray-600 to-slate-600' },
  plumbing: { gradient: 'from-cyan-600 to-blue-600' },
  electrical: { gradient: 'from-yellow-400 to-amber-400' },
  landscaping: { gradient: 'from-green-500 to-lime-500' },
  photography: { gradient: 'from-neutral-600 to-gray-600' },
  astronomy: { gradient: 'from-indigo-800 to-purple-800' },
  tax: { gradient: 'from-emerald-600 to-teal-600' },
  islamic: { gradient: 'from-emerald-700 to-green-700' },
  misc: { gradient: 'from-gray-400 to-slate-400' },
  shared: { gradient: 'from-slate-300 to-gray-300' }
}

export default function CalculatorCard({ calc }: { calc: CalculatorEntry }) {
  const colors = CATEGORY_COLORS[calc.category] || { bg: 'bg-neutral-50', text: 'text-neutral-600', border: 'border-neutral-200' }
  const meta = categoryMeta[calc.category] || { gradient: 'from-slate-500 to-gray-500' }
  const targetUrl = `/calculators/${calc.slug}`

  return (
    <Link
      href={targetUrl}
      className="group relative block p-5 rounded-2xl bg-white border border-neutral-200/80 hover:border-neutral-300 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 h-full overflow-hidden"
    >
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${meta.gradient} opacity-80 group-hover:opacity-100 transition-opacity`}
      />
      <div
        className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${meta.gradient} to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity`}
      />
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-11 h-11 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}
          >
            <Calculator className="w-5 h-5" />
          </div>
          <span
            className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-mono font-bold ${colors.bg} ${colors.text} ${colors.border} border`}
          >
            {CATEGORY_LABELS[calc.category] || calc.category}
          </span>
        </div>
        <h3 className="text-[15px] font-bold text-dark-900 mb-1.5 group-hover:text-dark-900 leading-tight">
          {calc.name}
        </h3>
        <p className="text-xs text-dark-500 mb-4 line-clamp-2 leading-relaxed">
          {calc.description}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
          <div className="flex items-center text-xs font-bold text-dark-600 group-hover:text-dark-900 transition-colors">
            Open calculator
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
          <span
            className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
              calc.mode === 'retro' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
            }`}
          >
            {calc.mode === 'retro' ? 'LCD' : 'FORM'}
          </span>
        </div>
      </div>
    </Link>
  )
}
