'use client'

import React, { useState, useMemo } from 'react'
import DigitalText from '@/components/DigitalText'
import { useKeyboardInput, createStandardKeyMap } from '@/hooks/useKeyboardInput'

export default function ScientificCalculator() {
  const [display, setDisplay] = useState('0')
  const [prevVal, setPrevVal] = useState<string | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [shouldReset, setShouldReset] = useState(false)
  const [angleMode, setAngleMode] = useState<'DEG' | 'RAD'>('DEG')
  const [memory, setMemory] = useState(0)
  const [isInv, setIsInv] = useState(false)

  const handleNum = (num: string) => {
    if (display === '0' || display === 'ERROR' || shouldReset) {
      setDisplay(num)
      setShouldReset(false)
    } else {
      if (display.length < 14) setDisplay(display + num)
    }
  }

  const handleDot = () => {
    if (shouldReset) { setDisplay('0.'); setShouldReset(false); return }
    if (!display.includes('.')) setDisplay(display + '.')
  }

  const handleOp = (op: string) => {
    if (prevVal && operation && !shouldReset) calculate()
    setPrevVal(display)
    setOperation(op)
    setShouldReset(true)
  }

  const calculate = () => {
    if (!prevVal || !operation) return
    const a = parseFloat(prevVal), b = parseFloat(display)
    let r = 0
    switch (operation) {
      case '+': r = a + b; break
      case '-': r = a - b; break
      case '*': r = a * b; break
      case '/':
        if (b === 0) { setDisplay('ERROR'); setShouldReset(true); setPrevVal(null); setOperation(null); return }
        r = a / b; break
      case '^': r = Math.pow(a, b); break
      case 'nroot': r = Math.pow(a, 1 / b); break
      case 'mod': r = a % b; break
      default: return
    }
    formatAndShow(r)
    setPrevVal(null)
    setOperation(null)
  }

  const toRad = (v: number) => angleMode === 'DEG' ? v * Math.PI / 180 : v
  const fromRad = (v: number) => angleMode === 'DEG' ? v * 180 / Math.PI : v

  const handleSci = (op: string) => {
    const v = parseFloat(display)
    if (isNaN(v)) return
    let r = 0
    switch (op) {
      case 'sin': r = isInv ? fromRad(Math.asin(v)) : Math.sin(toRad(v)); break
      case 'cos': r = isInv ? fromRad(Math.acos(v)) : Math.cos(toRad(v)); break
      case 'tan':
        if (!isInv) {
          const angle = toRad(v)
          if (Math.abs(Math.cos(angle)) < 1e-10) { setDisplay('ERROR'); setShouldReset(true); return }
          r = Math.tan(angle)
        } else {
          r = fromRad(Math.atan(v))
        }
        break
      case 'sqrt':
        if (v < 0) { setDisplay('ERROR'); setShouldReset(true); return }
        r = Math.sqrt(v); break
      case 'cbrt': r = Math.cbrt(v); break
      case 'x2': r = v * v; break
      case 'x3': r = v * v * v; break
      case '1/x':
        if (v === 0) { setDisplay('ERROR'); setShouldReset(true); return }
        r = 1 / v; break
      case 'ln':
        if (v <= 0) { setDisplay('ERROR'); setShouldReset(true); return }
        r = isInv ? Math.exp(v) : Math.log(v); break
      case 'log':
        if (!isInv && v <= 0) { setDisplay('ERROR'); setShouldReset(true); return }
        r = isInv ? Math.pow(10, v) : Math.log10(v); break
      case 'abs': r = Math.abs(v); break
      case 'fact':
        if (v < 0 || v > 170 || !Number.isInteger(v)) { setDisplay('ERROR'); setShouldReset(true); return }
        r = factorial(v); break
      case 'pi': r = Math.PI; break
      case 'e': r = Math.E; break
      case 'exp': r = Math.exp(v); break
      case 'floor': r = Math.floor(v); break
      case 'ceil': r = Math.ceil(v); break
      case 'round': r = Math.round(v); break
      default: return
    }
    if (op !== 'pi' && op !== 'e') setIsInv(false)
    formatAndShow(r)
  }

  const factorial = (n: number): number => {
    if (n <= 1) return 1
    let result = 1
    for (let i = 2; i <= n; i++) result *= i
    return result
  }

  const formatAndShow = (val: number) => {
    if (isNaN(val) || !isFinite(val)) { setDisplay('ERROR'); setShouldReset(true); return }
    // Handle very small numbers (floating point near-zero)
    if (Math.abs(val) < 1e-14) { setDisplay('0'); setShouldReset(true); return }
    let str = val.toString()
    if (str.length > 14) {
      if (Math.abs(val) >= 1e10 || Math.abs(val) < 1e-6) str = val.toExponential(6)
      else str = parseFloat(val.toPrecision(10)).toString()
    }
    setDisplay(str)
    setShouldReset(true)
  }

  const clear = () => {
    setDisplay('0'); setPrevVal(null); setOperation(null); setShouldReset(false); setIsInv(false)
  }

  const handleDelete = () => {
    if (shouldReset) return
    setDisplay(display.length > 1 ? display.slice(0, -1) : '0')
  }

  // Keyboard
  const keyMap = useMemo(
    () => createStandardKeyMap({
      onNumber: handleNum, onOperator: handleOp, onEquals: calculate,
      onClear: clear, onDelete: handleDelete, onDot: handleDot,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [display, prevVal, operation, shouldReset, angleMode, isInv]
  )
  useKeyboardInput(keyMap)

  const bSci = "h-9 text-[10px] font-bold bg-[#a6b0a4] text-neutral-900 rounded shadow border border-[#909a8e] hover:bg-[#b0baa5] active:scale-95 transition-all font-mono"
  const bNum = "h-9 text-sm font-bold bg-[#fcfbfa] text-neutral-800 rounded shadow border border-neutral-300 active:scale-95 hover:bg-neutral-100 transition-all"
  const bOp = "h-9 text-sm font-bold bg-[#b5beb3] text-neutral-900 rounded shadow border border-[#9fa99c] active:scale-95 hover:bg-[#c2cbc0] transition-all"

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col bg-[#eae7df] border-4 border-[#dad6cd] rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-bold tracking-wider text-neutral-500 font-mono">CALC-CRAFT SCIENTIFIC</span>
          <div className="flex gap-1 items-center">
            <button onClick={() => setAngleMode(angleMode === 'DEG' ? 'RAD' : 'DEG')}
              className="text-[8px] px-1.5 py-0.5 rounded bg-neutral-300 border border-neutral-400 text-neutral-700 font-mono font-bold hover:bg-neutral-350 transition-all">
              {angleMode}
            </button>
            <div className="w-10 h-3 bg-neutral-400 rounded-sm border border-neutral-500 shadow-inner flex justify-around items-center">
              <div className="w-1 h-1 bg-neutral-700/80 rounded-full" />
              <div className="w-1 h-1 bg-neutral-700/80 rounded-full" />
              <div className="w-1 h-1 bg-neutral-700/80 rounded-full" />
            </div>
          </div>
        </div>

        {/* Display */}
        <div className="relative mb-4 bg-[#cbd8ca] border-2 border-[#b0bdae] p-3 rounded-lg shadow-inner flex flex-col items-end justify-center min-h-[70px] overflow-hidden select-none">
          <div className="absolute left-2 top-1 text-[8px] font-bold text-[#4c5c4a] font-mono">
            {prevVal && `${prevVal} ${operation || ''}`}
          </div>
          <div className="absolute left-2 bottom-1 text-[7px] font-bold text-[#4c5c4a] font-mono flex gap-2">
            <span>{angleMode}</span>
            {memory !== 0 && <span>M</span>}
            {isInv && <span className="text-amber-800">INV</span>}
          </div>
          <DigitalText text={display} theme="lcd" size={36} gap={1.5} animate={false} activeColor="#1a2019" inactiveColor="#b8c6b6" />
        </div>

        <div className="text-[9px] text-center font-mono text-neutral-400 mb-2">⌨ Keyboard input enabled</div>

        {/* Memory & Mode Row */}
        <div className="grid grid-cols-5 gap-1 mb-1.5">
          <button onClick={() => setMemory(memory + parseFloat(display))} className={bSci}>M+</button>
          <button onClick={() => setMemory(memory - parseFloat(display))} className={bSci}>M−</button>
          <button onClick={() => { setDisplay(memory.toString()); setShouldReset(true) }} className={bSci}>MR</button>
          <button onClick={() => setMemory(0)} className={bSci}>MC</button>
          <button onClick={() => setIsInv(!isInv)} className={`${bSci} ${isInv ? 'bg-amber-200 border-amber-400' : ''}`}>INV</button>
        </div>

        {/* Science Functions */}
        <div className="grid grid-cols-5 gap-1 mb-1.5">
          <button onClick={() => handleSci('sin')} className={bSci}>{isInv ? 'sin⁻¹' : 'sin'}</button>
          <button onClick={() => handleSci('cos')} className={bSci}>{isInv ? 'cos⁻¹' : 'cos'}</button>
          <button onClick={() => handleSci('tan')} className={bSci}>{isInv ? 'tan⁻¹' : 'tan'}</button>
          <button onClick={() => handleSci('ln')} className={bSci}>{isInv ? 'eˣ' : 'ln'}</button>
          <button onClick={() => handleSci('log')} className={bSci}>{isInv ? '10ˣ' : 'log'}</button>
        </div>

        <div className="grid grid-cols-5 gap-1 mb-1.5">
          <button onClick={() => handleSci('sqrt')} className={bSci}>√</button>
          <button onClick={() => handleSci('cbrt')} className={bSci}>∛</button>
          <button onClick={() => handleSci('x2')} className={bSci}>x²</button>
          <button onClick={() => handleSci('x3')} className={bSci}>x³</button>
          <button onClick={() => handleOp('^')} className={bSci}>xʸ</button>
        </div>

        <div className="grid grid-cols-5 gap-1 mb-1.5">
          <button onClick={() => handleSci('fact')} className={bSci}>n!</button>
          <button onClick={() => handleSci('1/x')} className={bSci}>1/x</button>
          <button onClick={() => handleSci('abs')} className={bSci}>|x|</button>
          <button onClick={() => handleSci('pi')} className={bSci}>π</button>
          <button onClick={() => handleSci('e')} className={bSci}>e</button>
        </div>

        {/* Standard Keys */}
        <div className="grid grid-cols-5 gap-1.5 mt-1">
          <button onClick={clear} className="h-10 text-xs font-extrabold bg-[#cc6666] text-white rounded shadow border border-red-800 active:scale-95 transition-all">AC</button>
          <button onClick={handleDelete} className="h-10 text-xs font-extrabold bg-neutral-400 text-neutral-900 rounded shadow border border-neutral-500 active:scale-95 transition-all">DEL</button>
          <button onClick={() => handleOp('mod')} className={bOp}>mod</button>
          <button onClick={() => handleOp('/')} className={bOp}>÷</button>
          <button onClick={() => handleOp('*')} className={bOp}>×</button>

          <button onClick={() => handleNum('7')} className={bNum}>7</button>
          <button onClick={() => handleNum('8')} className={bNum}>8</button>
          <button onClick={() => handleNum('9')} className={bNum}>9</button>
          <button onClick={() => handleOp('-')} className={bOp}>−</button>
          <button onClick={() => handleOp('+')} className={bOp}>+</button>

          <button onClick={() => handleNum('4')} className={bNum}>4</button>
          <button onClick={() => handleNum('5')} className={bNum}>5</button>
          <button onClick={() => handleNum('6')} className={bNum}>6</button>
          <button onClick={() => setDisplay((parseFloat(display) * -1).toString())} className="h-9 text-xs font-bold bg-neutral-300 text-neutral-900 rounded shadow border border-neutral-400 active:scale-95 transition-all">+/−</button>
          <button onClick={() => { const v = parseFloat(display); if (!isNaN(v)) { setDisplay((v / 100).toString()); setShouldReset(true) } }} className="h-9 text-xs font-bold bg-neutral-300 text-neutral-900 rounded shadow border border-neutral-400 active:scale-95 transition-all">%</button>

          <button onClick={() => handleNum('1')} className={bNum}>1</button>
          <button onClick={() => handleNum('2')} className={bNum}>2</button>
          <button onClick={() => handleNum('3')} className={bNum}>3</button>
          <button onClick={handleDot} className={bNum}>.</button>
          <button onClick={() => handleNum('0')} className={bNum}>0</button>
        </div>

        <button onClick={calculate} className="mt-1.5 h-10 w-full text-base font-extrabold bg-[#dfaa44] text-neutral-900 rounded-lg shadow border border-[#be8b32] active:scale-95 hover:bg-[#e5b44e] transition-all">=</button>
      </div>
    </div>
  )
}
