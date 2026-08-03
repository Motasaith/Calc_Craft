'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function WordCounter() {
  const [text, setText] = useState('This is an example text for word counting.')

  const results = useMemo(() => {
    const chars = text.length
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length
    const sentences = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(Boolean).length
    return { chars, words, sentences }
  }, [text])

  return (
    <FormCalculatorShell title="Word & Character Counter" subtitle="Analyze character counts and paragraphs in real time" badge="EVERYDAY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Enter Text" value={text} onChange={setText} id="wc-text" />
        </div>
        <div className="min-h-[440px] space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <ResultDisplay label="Words" value={results.words.toString()} />
            <ResultDisplay label="Characters" value={results.chars.toString()} />
            <ResultDisplay label="Sentences" value={results.sentences.toString()} />
          </div>
        </div>
      </div>
    </FormCalculatorShell>
  )
}
