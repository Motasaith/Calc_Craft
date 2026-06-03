'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { ResultDisplay } from '../shared/FormCalculatorShell'

export default function WordCounter() {
  const [text, setText] = useState('')

  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const chars = text.length
  const charsNoSpace = text.replace(/\s/g, '').length
  const sentences = text.trim() ? (text.match(/[.!?]+/g) || []).length || (text.trim().length > 0 ? 1 : 0) : 0
  const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter((p) => p.trim()).length : 0
  const readingTime = Math.max(1, Math.ceil(words / 200))

  return (
    <FormCalculatorShell title="Word & Character Counter" badge="EVERYDAY">
      <div className="mb-3">
        <label htmlFor="wc-text" className="block text-[11px] font-bold text-neutral-600 font-mono uppercase tracking-wider mb-1.5">
          Enter or Paste Text
        </label>
        <textarea
          id="wc-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your text here..."
          rows={6}
          className="w-full px-3 py-2 bg-[#fcfbfa] border-2 border-neutral-300 rounded-lg text-sm font-mono text-neutral-800 focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-400 transition-all shadow-inner resize-y placeholder:text-neutral-400"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <ResultDisplay label="Words" value={words.toString()} large />
        <ResultDisplay label="Characters" value={chars.toString()} large />
        <ResultDisplay label="No Spaces" value={charsNoSpace.toString()} />
        <ResultDisplay label="Sentences" value={sentences.toString()} />
        <ResultDisplay label="Paragraphs" value={paragraphs.toString()} />
        <ResultDisplay label="Reading Time" value={`~${readingTime} min`} />
      </div>
    </FormCalculatorShell>
  )
}
