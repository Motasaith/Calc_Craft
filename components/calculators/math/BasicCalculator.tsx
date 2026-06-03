'use client'

import React, { useState, useMemo } from 'react'
import { Delete } from 'lucide-react'
import DigitalText from '@/components/DigitalText'
import { useKeyboardInput, createStandardKeyMap } from '@/hooks/useKeyboardInput'

export default function BasicCalculator() {
  const [display, setDisplay] = useState('0')
  const [prevVal, setPrevVal] = useState<string | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [shouldReset, setShouldReset] = useState(false)

  const handleNum = (num: string) => {
    if (display === '0' || shouldReset) {
      setDisplay(num)
      setShouldReset(false)
    } else {
      if (display.length < 12) {
        setDisplay(display + num)
      }
    }
  }

  const handleDot = () => {
    if (shouldReset) {
      setDisplay('0.')
      setShouldReset(false)
      return
    }
    if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  const handleOp = (op: string) => {
    if (prevVal && operation && !shouldReset) {
      calculate()
    }
    setPrevVal(display)
    setOperation(op)
    setShouldReset(true)
  }

  const calculate = () => {
    if (!prevVal || !operation) return
    const current = parseFloat(display)
    const previous = parseFloat(prevVal)
    let result = 0

    switch (operation) {
      case '+': result = previous + current; break
      case '-': result = previous - current; break
      case '*': result = previous * current; break
      case '/':
        if (current === 0) { setDisplay('ERROR'); setShouldReset(true); setPrevVal(null); setOperation(null); return }
        result = previous / current
        break
      default: return
    }

    let resultStr = result.toString()
    if (resultStr.length > 12) {
      if (Math.abs(result) < 1e-10) resultStr = '0'
      else if (resultStr.includes('.')) resultStr = parseFloat(result.toFixed(8)).toString()
      else resultStr = result.toExponential(4)
    }

    setDisplay(resultStr)
    setPrevVal(null)
    setOperation(null)
    setShouldReset(true)
  }

  const clear = () => {
    setDisplay('0')
    setPrevVal(null)
    setOperation(null)
    setShouldReset(false)
  }

  const handleDelete = () => {
    if (shouldReset) return
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay('0')
    }
  }

  const toggleSign = () => {
    if (display !== '0' && display !== 'ERROR') {
      setDisplay((parseFloat(display) * -1).toString())
    }
  }

  const handlePercent = () => {
    const val = parseFloat(display)
    if (!isNaN(val)) {
      setDisplay((val / 100).toString())
      setShouldReset(true)
    }
  }

  // Keyboard support
  const keyMap = useMemo(
    () => createStandardKeyMap({
      onNumber: handleNum,
      onOperator: handleOp,
      onEquals: calculate,
      onClear: clear,
      onDelete: handleDelete,
      onDot: handleDot,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [display, prevVal, operation, shouldReset]
  )
  useKeyboardInput(keyMap)

  const btnNum = "h-12 text-base font-bold bg-[#fcfbfa] text-neutral-800 rounded-lg shadow border border-neutral-300 active:scale-95 hover:bg-neutral-100 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"
  const btnOp = "h-12 text-base font-bold bg-[#b5beb3] text-neutral-900 rounded-lg shadow border border-[#9fa99c] active:scale-95 hover:bg-[#c2cbc0] transition-all focus:outline-none focus:ring-2 focus:ring-neutral-400"

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="flex flex-col bg-[#eae7df] border-4 border-[#dad6cd] rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-bold tracking-wider text-neutral-500 font-mono">CALC-CRAFT RETRO</span>
          <div className="w-10 h-3 bg-neutral-400 rounded-sm border border-neutral-500 shadow-inner flex justify-around items-center">
            <div className="w-1 h-1 bg-neutral-700/80 rounded-full" />
            <div className="w-1 h-1 bg-neutral-700/80 rounded-full" />
            <div className="w-1 h-1 bg-neutral-700/80 rounded-full" />
          </div>
        </div>

        {/* Display */}
        <div className="relative mb-5 bg-[#cbd8ca] border-2 border-[#b0bdae] p-3 rounded-lg shadow-inner flex flex-col items-end justify-center min-h-[80px] overflow-hidden select-none">
          <div className="absolute left-3 top-1.5 text-[9px] font-bold text-[#4c5c4a] font-mono">
            {prevVal && `${prevVal} ${operation || ''}`}
          </div>
          <div className="text-[10px] text-[#4c5c4a] font-mono font-bold absolute right-3 top-1.5">
            {operation ? `[${operation}]` : ''}
          </div>
          <DigitalText
            text={display}
            theme="lcd"
            size={42}
            gap={2}
            animate={false}
            activeColor="#1a2019"
            inactiveColor="#b8c6b6"
          />
        </div>

        {/* Keyboard hint */}
        <div className="text-[9px] text-center font-mono text-neutral-400 mb-3">⌨ Keyboard input enabled</div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-2">
          <button onClick={clear} className="h-12 text-xs font-extrabold bg-[#cc6666] text-white rounded-lg shadow border border-red-800 active:scale-95 hover:bg-[#d47070] transition-all">AC</button>
          <button onClick={handleDelete} className="h-12 text-xs font-extrabold bg-neutral-400 text-neutral-900 rounded-lg shadow border border-neutral-500 active:scale-95 hover:bg-neutral-350 transition-all flex items-center justify-center">
            <Delete className="w-4 h-4" />
          </button>
          <button onClick={handlePercent} className="h-12 text-sm font-bold bg-neutral-300 text-neutral-900 rounded-lg shadow border border-neutral-400 active:scale-95 hover:bg-neutral-250 transition-all">%</button>
          <button onClick={() => handleOp('/')} className={btnOp}>÷</button>

          <button onClick={() => handleNum('7')} className={btnNum}>7</button>
          <button onClick={() => handleNum('8')} className={btnNum}>8</button>
          <button onClick={() => handleNum('9')} className={btnNum}>9</button>
          <button onClick={() => handleOp('*')} className={btnOp}>×</button>

          <button onClick={() => handleNum('4')} className={btnNum}>4</button>
          <button onClick={() => handleNum('5')} className={btnNum}>5</button>
          <button onClick={() => handleNum('6')} className={btnNum}>6</button>
          <button onClick={() => handleOp('-')} className={btnOp}>−</button>

          <button onClick={() => handleNum('1')} className={btnNum}>1</button>
          <button onClick={() => handleNum('2')} className={btnNum}>2</button>
          <button onClick={() => handleNum('3')} className={btnNum}>3</button>
          <button onClick={() => handleOp('+')} className={btnOp}>+</button>

          <button onClick={toggleSign} className={`${btnNum} text-sm`}>+/−</button>
          <button onClick={() => handleNum('0')} className={btnNum}>0</button>
          <button onClick={handleDot} className={btnNum}>.</button>
          <button onClick={calculate} className="h-12 text-base font-extrabold bg-[#dfaa44] text-neutral-900 rounded-lg shadow border border-[#be8b32] active:scale-95 hover:bg-[#e5b44e] transition-all">=</button>
        </div>
      </div>
    </div>
  )
}
