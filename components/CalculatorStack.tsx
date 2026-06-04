'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Activity,
  DollarSign,
  Delete
} from 'lucide-react'
import DigitalText from './DigitalText'

// ==========================================
// CALCULATOR 1: RETRO BASIC CALCULATOR
// ==========================================
function BasicCalculator() {
  const [display, setDisplay] = useState('0')
  const [prevVal, setPrevVal] = useState<string | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [shouldReset, setShouldReset] = useState(false)

  const handleNum = (num: string) => {
    if (display === '0' || shouldReset) {
      setDisplay(num)
      setShouldReset(false)
    } else {
      if (display.length < 10) {
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
      case '+':
        result = previous + current
        break
      case '-':
        result = previous - current
        break
      case '*':
        result = previous * current
        break
      case '/':
        result = current !== 0 ? previous / current : 0
        break
      default:
        return
    }

    let resultStr = result.toString()
    if (resultStr.length > 10) {
      if (resultStr.includes('.')) {
        resultStr = result.toFixed(9 - Math.floor(result).toString().length)
      } else {
        resultStr = result.toExponential(4)
      }
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
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay('0')
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#eae7df] border-4 border-[#dad6cd] rounded-2xl p-4 shadow-inner text-neutral-800">
      {/* Brand Header */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-bold tracking-wider text-neutral-500 font-mono">CALC-CRAFT RETRO</span>
        <div className="w-10 h-3 bg-neutral-400 rounded-sm border border-neutral-500 shadow-inner flex justify-around items-center">
          <div className="w-1 h-1 bg-neutral-700/80 rounded-full" />
          <div className="w-1 h-1 bg-neutral-700/80 rounded-full" />
          <div className="w-1 h-1 bg-neutral-700/80 rounded-full" />
        </div>
      </div>

      {/* Screen Display */}
      <div className="relative mb-5 bg-[#cbd8ca] border-2 border-[#b0bdae] p-2.5 rounded shadow-inner flex justify-end items-center h-16 overflow-hidden select-none">
        <div className="absolute left-2 top-1 text-[8px] font-bold text-[#4c5c4a] font-mono">
          {prevVal && `${prevVal} ${operation || ''}`}
        </div>
        <DigitalText
          text={display}
          theme="lcd"
          size={38}
          gap={1.5}
          animate={false}
          activeColor="#1a2019"
          inactiveColor="#b8c6b6"
        />
      </div>

      {/* Button Grid */}
      <div className="grid grid-cols-4 gap-2 flex-grow">
        <button onClick={clear} className="h-10 text-xs font-extrabold bg-[#cc6666] text-white rounded shadow border border-red-800 active:scale-95 transition-transform">AC</button>
        <button onClick={handleDelete} className="h-10 text-xs font-extrabold bg-neutral-400 text-neutral-900 rounded shadow border border-neutral-500 active:scale-95 transition-transform flex items-center justify-center">
          <Delete className="w-4 h-4" />
        </button>
        <button onClick={() => setDisplay((parseFloat(display) * -1).toString())} className="h-10 text-xs font-bold bg-neutral-300 text-neutral-900 rounded shadow border border-neutral-400 active:scale-95 transition-transform">+/-</button>
        <button onClick={() => handleOp('/')} className="h-10 text-sm font-bold bg-[#b5beb3] text-neutral-900 rounded shadow border border-[#9fa99c] active:scale-95 transition-transform">/</button>

        <button onClick={() => handleNum('7')} className="h-10 text-sm font-bold bg-[#fcfbfa] text-neutral-800 rounded shadow border border-neutral-300 active:scale-95 transition-transform">7</button>
        <button onClick={() => handleNum('8')} className="h-10 text-sm font-bold bg-[#fcfbfa] text-neutral-800 rounded shadow border border-neutral-300 active:scale-95 transition-transform">8</button>
        <button onClick={() => handleNum('9')} className="h-10 text-sm font-bold bg-[#fcfbfa] text-neutral-800 rounded shadow border border-neutral-300 active:scale-95 transition-transform">9</button>
        <button onClick={() => handleOp('*')} className="h-10 text-sm font-bold bg-[#b5beb3] text-neutral-900 rounded shadow border border-[#9fa99c] active:scale-95 transition-transform">*</button>

        <button onClick={() => handleNum('4')} className="h-10 text-sm font-bold bg-[#fcfbfa] text-neutral-800 rounded shadow border border-neutral-300 active:scale-95 transition-transform">4</button>
        <button onClick={() => handleNum('5')} className="h-10 text-sm font-bold bg-[#fcfbfa] text-neutral-800 rounded shadow border border-neutral-300 active:scale-95 transition-transform">5</button>
        <button onClick={() => handleNum('6')} className="h-10 text-sm font-bold bg-[#fcfbfa] text-neutral-800 rounded shadow border border-neutral-300 active:scale-95 transition-transform">6</button>
        <button onClick={() => handleOp('-')} className="h-10 text-sm font-bold bg-[#b5beb3] text-neutral-900 rounded shadow border border-[#9fa99c] active:scale-95 transition-transform">-</button>

        <button onClick={() => handleNum('1')} className="h-10 text-sm font-bold bg-[#fcfbfa] text-neutral-800 rounded shadow border border-neutral-300 active:scale-95 transition-transform">1</button>
        <button onClick={() => handleNum('2')} className="h-10 text-sm font-bold bg-[#fcfbfa] text-neutral-800 rounded shadow border border-neutral-300 active:scale-95 transition-transform">2</button>
        <button onClick={() => handleNum('3')} className="h-10 text-sm font-bold bg-[#fcfbfa] text-neutral-800 rounded shadow border border-neutral-300 active:scale-95 transition-transform">3</button>
        <button onClick={() => handleOp('+')} className="h-10 text-sm font-bold bg-[#b5beb3] text-neutral-900 rounded shadow border border-[#9fa99c] active:scale-95 transition-transform">+</button>

        <button onClick={() => handleNum('0')} className="h-10 col-span-2 text-sm font-bold bg-[#fcfbfa] text-neutral-800 rounded shadow border border-neutral-300 active:scale-95 transition-transform">0</button>
        <button onClick={handleDot} className="h-10 text-sm font-bold bg-[#fcfbfa] text-neutral-800 rounded shadow border border-neutral-300 active:scale-95 transition-transform">.</button>
        <button onClick={calculate} className="h-10 text-sm font-extrabold bg-[#dfaa44] text-neutral-900 rounded shadow border border-[#be8b32] active:scale-95 transition-transform">=</button>
      </div>
    </div>
  )
}

// ==========================================
// CALCULATOR 2: RETRO SCIENTIFIC CALCULATOR
// ==========================================
function ScientificCalculator() {
  const [display, setDisplay] = useState('0')
  const [prevVal, setPrevVal] = useState<string | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [shouldReset, setShouldReset] = useState(false)

  const handleNum = (num: string) => {
    if (display === '0' || shouldReset) {
      setDisplay(num)
      setShouldReset(false)
    } else {
      if (display.length < 11) {
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
      case '+':
        result = previous + current
        break
      case '-':
        result = previous - current
        break
      case '*':
        result = previous * current
        break
      case '/':
        result = current !== 0 ? previous / current : 0
        break
      case '^':
        result = Math.pow(previous, current)
        break
      default:
        return
    }

    formatAndShow(result)
    setPrevVal(null)
    setOperation(null)
  }

  const handleScienceOp = (op: string) => {
    const val = parseFloat(display)
    if (isNaN(val)) return

    let res = 0
    switch (op) {
      case 'sin':
        res = Math.sin(val * Math.PI / 180)
        break
      case 'cos':
        res = Math.cos(val * Math.PI / 180)
        break
      case 'tan':
        res = Math.tan(val * Math.PI / 180)
        break
      case 'sqrt':
        res = val >= 0 ? Math.sqrt(val) : 0
        break
      case 'x2':
        res = val * val
        break
      case 'ln':
        res = val > 0 ? Math.log(val) : 0
        break
      case 'log':
        res = val > 0 ? Math.log10(val) : 0
        break
      case 'pi':
        res = Math.PI
        break
      case 'e':
        res = Math.E
        break
      default:
        return
    }

    formatAndShow(res)
  }

  const formatAndShow = (val: number) => {
    if (isNaN(val) || !isFinite(val)) {
      setDisplay('ERROR')
      setShouldReset(true)
      return
    }

    let str = val.toString()
    if (str.length > 11) {
      if (str.includes('.')) {
        str = val.toFixed(10 - Math.floor(Math.abs(val)).toString().length)
      } else {
        str = val.toExponential(4)
      }
    }
    setDisplay(str)
    setShouldReset(true)
  }

  const clear = () => {
    setDisplay('0')
    setPrevVal(null)
    setOperation(null)
    setShouldReset(false)
  }

  return (
    <div className="flex flex-col h-full bg-[#eae7df] border-4 border-[#dad6cd] rounded-2xl p-4 shadow-inner text-neutral-800">
      {/* Brand Header */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-bold tracking-wider text-neutral-500 font-mono">CALC-CRAFT SCIENTIFIC</span>
        <div className="w-10 h-3 bg-neutral-400 rounded-sm border border-neutral-500 shadow-inner flex justify-around items-center">
          <div className="w-1 h-1 bg-neutral-700/80 rounded-full" />
          <div className="w-1 h-1 bg-neutral-700/80 rounded-full" />
          <div className="w-1 h-1 bg-neutral-700/80 rounded-full" />
        </div>
      </div>

      {/* Screen Display */}
      <div className="relative mb-4 bg-[#cbd8ca] border-2 border-[#b0bdae] p-2.5 rounded shadow-inner flex justify-end items-center h-14 overflow-hidden select-none">
        <div className="absolute left-2 top-0.5 text-[8px] font-bold text-[#4c5c4a] font-mono">
          {prevVal && `${prevVal} ${operation || ''}`}
        </div>
        <DigitalText
          text={display}
          theme="lcd"
          size={34}
          gap={1.5}
          animate={false}
          activeColor="#1a2019"
          inactiveColor="#b8c6b6"
        />
      </div>

      {/* Grid Keypad */}
      <div className="grid grid-cols-4 gap-1.5 flex-grow text-[11px] font-bold font-mono">
        <button onClick={clear} className="h-8 text-xs font-extrabold bg-[#cc6666] text-white rounded shadow border border-red-800 active:scale-95 transition-all">AC</button>
        <button onClick={() => setDisplay(display.length > 1 ? display.slice(0, -1) : '0')} className="h-8 text-xs font-extrabold bg-neutral-400 text-neutral-900 rounded shadow border border-neutral-500 active:scale-95 transition-all flex items-center justify-center">DEL</button>
        <button onClick={() => handleScienceOp('pi')} className="h-8 text-sm font-bold bg-[#b5beb3] text-neutral-900 rounded shadow border border-[#9fa99c] active:scale-95 transition-all">π</button>
        <button onClick={() => handleScienceOp('e')} className="h-8 text-sm font-bold bg-[#b5beb3] text-neutral-900 rounded shadow border border-[#9fa99c] active:scale-95 transition-all">e</button>

        <button onClick={() => handleScienceOp('sin')} className="h-8 bg-[#a6b0a4] text-neutral-900 rounded shadow border border-[#909a8e] hover:bg-[#b0baa5] active:scale-95 transition-all">sin</button>
        <button onClick={() => handleScienceOp('cos')} className="h-8 bg-[#a6b0a4] text-neutral-900 rounded shadow border border-[#909a8e] hover:bg-[#b0baa5] active:scale-95 transition-all">cos</button>
        <button onClick={() => handleScienceOp('tan')} className="h-8 bg-[#a6b0a4] text-neutral-900 rounded shadow border border-[#909a8e] hover:bg-[#b0baa5] active:scale-95 transition-all">tan</button>
        <button onClick={() => handleOp('^')} className="h-8 bg-[#a6b0a4] text-neutral-900 rounded shadow border border-[#909a8e] hover:bg-[#b0baa5] active:scale-95 transition-all">x^y</button>

        <button onClick={() => handleScienceOp('sqrt')} className="h-8 bg-[#a6b0a4] text-neutral-900 rounded shadow border border-[#909a8e] hover:bg-[#b0baa5] active:scale-95 transition-all">√</button>
        <button onClick={() => handleScienceOp('x2')} className="h-8 bg-[#a6b0a4] text-neutral-900 rounded shadow border border-[#909a8e] hover:bg-[#b0baa5] active:scale-95 transition-all">x²</button>
        <button onClick={() => handleScienceOp('ln')} className="h-8 bg-[#a6b0a4] text-neutral-900 rounded shadow border border-[#909a8e] hover:bg-[#b0baa5] active:scale-95 transition-all">ln</button>
        <button onClick={() => handleScienceOp('log')} className="h-8 bg-[#a6b0a4] text-neutral-900 rounded shadow border border-[#909a8e] hover:bg-[#b0baa5] active:scale-95 transition-all">log</button>

        <button onClick={() => handleNum('7')} className="h-8 text-sm font-bold bg-[#fcfbfa] text-neutral-800 rounded shadow border border-neutral-300 active:scale-95 transition-all">7</button>
        <button onClick={() => handleNum('8')} className="h-8 text-sm font-bold bg-[#fcfbfa] text-neutral-800 rounded shadow border border-neutral-300 active:scale-95 transition-all">8</button>
        <button onClick={() => handleNum('9')} className="h-8 text-sm font-bold bg-[#fcfbfa] text-neutral-800 rounded shadow border border-neutral-300 active:scale-95 transition-all">9</button>
        <button onClick={() => handleOp('/')} className="h-8 text-sm font-bold bg-[#b5beb3] text-neutral-900 rounded shadow border border-[#9fa99c] active:scale-95 transition-all">/</button>

        <button onClick={() => handleNum('4')} className="h-8 text-sm font-bold bg-[#fcfbfa] text-neutral-800 rounded shadow border border-neutral-300 active:scale-95 transition-all">4</button>
        <button onClick={() => handleNum('5')} className="h-8 text-sm font-bold bg-[#fcfbfa] text-neutral-800 rounded shadow border border-neutral-300 active:scale-95 transition-all">5</button>
        <button onClick={() => handleNum('6')} className="h-8 text-sm font-bold bg-[#fcfbfa] text-neutral-800 rounded shadow border border-neutral-300 active:scale-95 transition-all">6</button>
        <button onClick={() => handleOp('*')} className="h-8 text-sm font-bold bg-[#b5beb3] text-neutral-900 rounded shadow border border-[#9fa99c] active:scale-95 transition-all">*</button>

        <button onClick={() => handleNum('1')} className="h-8 text-sm font-bold bg-[#fcfbfa] text-neutral-800 rounded shadow border border-neutral-300 active:scale-95 transition-all">1</button>
        <button onClick={() => handleNum('2')} className="h-8 text-sm font-bold bg-[#fcfbfa] text-neutral-800 rounded shadow border border-neutral-300 active:scale-95 transition-all">2</button>
        <button onClick={() => handleNum('3')} className="h-8 text-sm font-bold bg-[#fcfbfa] text-neutral-800 rounded shadow border border-neutral-300 active:scale-95 transition-all">3</button>
        <button onClick={() => handleOp('-')} className="h-8 text-sm font-bold bg-[#b5beb3] text-neutral-900 rounded shadow border border-[#9fa99c] active:scale-95 transition-all">-</button>

        <button onClick={() => handleNum('0')} className="h-8 text-sm font-bold bg-[#fcfbfa] text-neutral-800 rounded shadow border border-neutral-300 active:scale-95 transition-all">0</button>
        <button onClick={handleDot} className="h-8 text-sm font-bold bg-[#fcfbfa] text-neutral-800 rounded shadow border border-neutral-300 active:scale-95 transition-all">.</button>
        <button onClick={calculate} className="h-8 text-sm font-extrabold bg-[#dfaa44] text-neutral-900 rounded shadow border border-[#be8b32] active:scale-95 transition-all">=</button>
        <button onClick={() => handleOp('+')} className="h-8 text-sm font-bold bg-[#b5beb3] text-neutral-900 rounded shadow border border-[#9fa99c] active:scale-95 transition-all">+</button>
      </div>
    </div>
  )
}

// ==========================================
// CALCULATOR 3: RETRO BMI CALCULATOR
// ==========================================
function BMICalculator() {
  const [weight, setWeight] = useState(70) // kg
  const [height, setHeight] = useState(170) // cm

  const heightInMeters = height / 100
  const bmi = weight / (heightInMeters * heightInMeters)

  // Determine status highlights
  let statusText = 'NORMAL'
  if (bmi < 18.5) statusText = 'UNDERWEIGHT'
  else if (bmi >= 18.5 && bmi < 25) statusText = 'NORMAL'
  else if (bmi >= 25 && bmi < 30) statusText = 'OVERWEIGHT'
  else statusText = 'OBESE'

  return (
    <div className="flex flex-col h-full bg-[#eae7df] border-4 border-[#dad6cd] rounded-2xl p-4 shadow-inner text-neutral-800">
      {/* Brand Header */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-bold tracking-wider text-neutral-500 font-mono flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-neutral-600" />
          CALC-CRAFT FITNESS
        </span>
        <span className="text-[8px] uppercase px-1.5 py-0.5 rounded bg-neutral-300 border border-neutral-400 text-neutral-700 font-mono font-bold">BMI</span>
      </div>

      {/* Main Display: LCD screen with BMI value */}
      <div className="relative mb-4 bg-[#cbd8ca] border-2 border-[#b0bdae] p-2 rounded shadow-inner flex flex-col items-center justify-center h-20 text-center overflow-hidden select-none">
        <div className="absolute left-2.5 top-1 text-[8px] font-bold text-[#4c5c4a] tracking-wider uppercase">
          BODY MASS INDEX
        </div>
        <div className="flex items-center mt-1">
          <DigitalText
            text={bmi.toFixed(1)}
            theme="lcd"
            size={30}
            gap={1.5}
            animate={false}
            activeColor="#1a2019"
            inactiveColor="#b8c6b6"
          />
          <span className="text-[10px] font-bold text-[#4c5c4a] font-mono ml-2 mt-2">KG/M²</span>
        </div>
        <div className="text-[9px] font-mono font-bold text-[#1a2019] tracking-wider mt-1">
          STATUS: {statusText}
        </div>
      </div>

      {/* Grooved Retro Control Sliders */}
      <div className="flex flex-col gap-4 flex-grow justify-center px-1">
        {/* Height Control */}
        <div>
          <div className="flex justify-between text-xs font-bold text-neutral-600 mb-1">
            <span>Height</span>
            <span className="font-mono text-neutral-900 font-bold">{height} cm</span>
          </div>
          <div className="relative w-full h-3.5 bg-neutral-300 rounded border border-neutral-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] flex items-center px-1">
            <input
              type="range"
              min="100"
              max="220"
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value))}
              className="absolute inset-x-0 w-full accent-neutral-800 bg-transparent opacity-100 appearance-none h-1 cursor-pointer"
            />
          </div>
        </div>

        {/* Weight Control */}
        <div>
          <div className="flex justify-between text-xs font-bold text-neutral-600 mb-1">
            <span>Weight</span>
            <span className="font-mono text-neutral-900 font-bold">{weight} kg</span>
          </div>
          <div className="relative w-full h-3.5 bg-neutral-300 rounded border border-neutral-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] flex items-center px-1">
            <input
              type="range"
              min="30"
              max="150"
              value={weight}
              onChange={(e) => setWeight(parseInt(e.target.value))}
              className="absolute inset-x-0 w-full accent-neutral-800 bg-transparent opacity-100 appearance-none h-1 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Retro Status Panel Indicators */}
      <div className="grid grid-cols-4 gap-1 mt-4 pt-3 border-t border-neutral-300">
        <div className={`text-[8px] font-bold text-center py-1 rounded border font-mono ${bmi < 18.5 ? 'bg-neutral-800 text-white border-neutral-800 shadow' : 'bg-neutral-200 text-neutral-500 border-neutral-300'}`}>UNDER</div>
        <div className={`text-[8px] font-bold text-center py-1 rounded border font-mono ${bmi >= 18.5 && bmi < 25 ? 'bg-neutral-800 text-white border-neutral-800 shadow' : 'bg-neutral-200 text-neutral-500 border-neutral-300'}`}>NORMAL</div>
        <div className={`text-[8px] font-bold text-center py-1 rounded border font-mono ${bmi >= 25 && bmi < 30 ? 'bg-neutral-800 text-white border-neutral-800 shadow' : 'bg-neutral-200 text-neutral-500 border-neutral-300'}`}>OVER</div>
        <div className={`text-[8px] font-bold text-center py-1 rounded border font-mono ${bmi >= 30 ? 'bg-neutral-800 text-white border-neutral-800 shadow' : 'bg-neutral-200 text-neutral-500 border-neutral-300'}`}>OBESE</div>
      </div>
    </div>
  )
}

// ==========================================
// CALCULATOR 4: RETRO EMI LOAN CALCULATOR
// ==========================================
function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(100000)
  const [interestRate, setInterestRate] = useState(7.5)
  const [tenureYears, setTenureYears] = useState(15)

  const P = loanAmount
  const R = interestRate / 12 / 100
  const N = tenureYears * 12

  const emi = R > 0 ? (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1) : P / N
  const totalPayment = emi * N
  const totalInterest = totalPayment - P

  const emiStr = Math.round(emi).toString()
  const interestStr = Math.round(totalInterest).toString()

  // Dynamically shrink digit size as string length increases to prevent wrapping or horizontal overflow
  const getDigitSize = (valStr: string) => {
    const len = valStr.length
    if (len <= 5) return 24
    if (len === 6) return 22
    if (len === 7) return 18
    return 15 // for 8 or more digits
  }

  return (
    <div className="flex flex-col h-full bg-[#eae7df] border-4 border-[#dad6cd] rounded-2xl p-4 shadow-inner text-neutral-800">
      {/* Brand Header */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-bold tracking-wider text-neutral-500 font-mono flex items-center gap-1">
          <DollarSign className="w-3.5 h-3.5 text-neutral-600" />
          CALC-CRAFT PLANNER
        </span>
        <span className="text-[8px] uppercase px-1.5 py-0.5 rounded bg-neutral-300 border border-neutral-400 text-neutral-700 font-mono font-bold">EMI</span>
      </div>

      {/* LCD Results Displays */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {/* EMI Panel */}
        <div className="bg-neutral-200 border border-neutral-300 p-1.5 rounded flex flex-col justify-center items-center">
          <span className="text-[7.5px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Monthly Payment</span>
          <div className="relative bg-[#cbd8ca] border border-[#b0bdae] rounded px-1.5 py-1 w-full flex justify-center items-center h-8 select-none">
            <span className="absolute left-1 text-[8px] font-bold text-[#4c5c4a] font-mono">$</span>
            <DigitalText
              text={emiStr}
              theme="lcd"
              size={getDigitSize(emiStr)}
              gap={1}
              animate={false}
              activeColor="#1a2019"
              inactiveColor="#b8c6b6"
            />
          </div>
        </div>
        
        {/* Interest Panel */}
        <div className="bg-neutral-200 border border-neutral-300 p-1.5 rounded flex flex-col justify-center items-center">
          <span className="text-[7.5px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Total Interest</span>
          <div className="relative bg-[#cbd8ca] border border-[#b0bdae] rounded px-1.5 py-1 w-full flex justify-center items-center h-8 select-none">
            <span className="absolute left-1 text-[8px] font-bold text-[#4c5c4a] font-mono">$</span>
            <DigitalText
              text={interestStr}
              theme="lcd"
              size={getDigitSize(interestStr)}
              gap={1}
              animate={false}
              activeColor="#1a2019"
              inactiveColor="#b8c6b6"
            />
          </div>
        </div>
      </div>

      {/* Grooved Retro Control Sliders */}
      <div className="flex flex-col gap-3.5 flex-grow justify-center px-1">
        {/* Principal */}
        <div>
          <div className="flex justify-between text-xs font-bold text-neutral-600 mb-1">
            <span>Loan Amount</span>
            <span className="font-mono text-neutral-900 font-bold">${loanAmount.toLocaleString()}</span>
          </div>
          <div className="relative w-full h-3.5 bg-neutral-300 rounded border border-neutral-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] flex items-center px-1">
            <input
              type="range"
              min="10000"
              max="500000"
              step="5000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(parseInt(e.target.value))}
              className="absolute inset-x-0 w-full accent-neutral-800 bg-transparent opacity-100 appearance-none h-1 cursor-pointer"
            />
          </div>
        </div>

        {/* Rate */}
        <div>
          <div className="flex justify-between text-xs font-bold text-neutral-600 mb-1">
            <span>Interest Rate</span>
            <span className="font-mono text-neutral-900 font-bold">{interestRate}%</span>
          </div>
          <div className="relative w-full h-3.5 bg-neutral-300 rounded border border-neutral-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] flex items-center px-1">
            <input
              type="range"
              min="2"
              max="15"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value))}
              className="absolute inset-x-0 w-full accent-neutral-800 bg-transparent opacity-100 appearance-none h-1 cursor-pointer"
            />
          </div>
        </div>

        {/* Tenure */}
        <div>
          <div className="flex justify-between text-xs font-bold text-neutral-600 mb-1">
            <span>Tenure</span>
            <span className="font-mono text-neutral-900 font-bold">{tenureYears} Years</span>
          </div>
          <div className="relative w-full h-3.5 bg-neutral-300 rounded border border-neutral-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] flex items-center px-1">
            <input
              type="range"
              min="1"
              max="30"
              value={tenureYears}
              onChange={(e) => setTenureYears(parseInt(e.target.value))}
              className="absolute inset-x-0 w-full accent-neutral-800 bg-transparent opacity-100 appearance-none h-1 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Summary Footer screen */}
      <div className="mt-4 bg-[#cbd8ca]/80 border border-[#b0bdae] rounded p-1.5 text-center text-[9.5px] font-bold text-[#4c5c4a] font-mono select-none flex justify-center items-center gap-1.5 h-7">
        TOTAL REPAYMENT: <span className="text-[#1a2019]">${Math.round(totalPayment).toLocaleString()}</span>
      </div>
    </div>
  )
}

// ==========================================
// MAIN COMPONENT: CALCULATOR STACK
// ==========================================
export default function CalculatorStack() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null) // Default focus null (all rest behind)
  const [isMobile, setIsMobile] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Track responsive screen dimensions
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Detect active card on scroll for mobile
  const handleScroll = () => {
    const container = scrollContainerRef.current
    if (!container) return

    const containerCenter = container.scrollLeft + container.clientWidth / 2
    let closestIndex = 0
    let minDistance = Infinity

    const cards = container.children
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLElement
      const cardCenter = card.offsetLeft + card.clientWidth / 2
      const distance = Math.abs(containerCenter - cardCenter)
      if (distance < minDistance) {
        minDistance = distance
        closestIndex = i
      }
    }
    setActiveIndex(closestIndex)
  }

  // Cards layout configurations
  const cards = [
    { name: 'Basic Calculator', render: <BasicCalculator /> },
    { name: 'Scientific Calculator', render: <ScientificCalculator /> },
    { name: 'BMI Calculator', render: <BMICalculator /> },
    { name: 'Loan EMI Calculator', render: <LoanCalculator /> },
  ]

  // Math configurations for fanning out cards (Desktop)
  const getDesktopCardStyle = (index: number) => {
    const defaultRotations = [-12, -4, 4, 12]
    const defaultTranslatesX = [-180, -60, 60, 180]
    const defaultTranslatesY = [15, 2, 2, 15]

    if (activeIndex === null) {
      return {
        rotate: `${defaultRotations[index]}deg`,
        x: `${defaultTranslatesX[index]}px`,
        y: `${defaultTranslatesY[index]}px`,
        scale: 0.95,
        zIndex: index + 10,
        filter: 'brightness(0.95)',
      }
    }

    if (activeIndex === index) {
      return {
        rotate: '0deg',
        x: `${defaultTranslatesX[index]}px`,
        y: '-70px',
        scale: 1.08,
        zIndex: 50,
        filter: 'brightness(1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 40px rgba(99, 102, 241, 0.1)',
      }
    }

    // Unfocused cards separate slightly
    const offsetDirection = index < activeIndex ? -1 : 1
    const xOffset = defaultTranslatesX[index] + offsetDirection * 45
    const rotOffset = defaultRotations[index] + offsetDirection * 4

    return {
      rotate: `${rotOffset}deg`,
      x: `${xOffset}px`,
      y: `${defaultTranslatesY[index] + 15}px`,
      scale: 0.9,
      zIndex: 10 + (index < activeIndex ? index : cards.length - index),
      filter: 'brightness(0.6) blur(0.5px)',
    }
  }

  return (
    <section
      className="relative w-full py-12 sm:py-14 md:py-16 flex flex-col items-center justify-center overflow-hidden"
      aria-label="Interactive calculator stack - Popular free online calculators"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      {/* Decorative floating rings background */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full border border-dark-900/5 dark:border-white/5 bg-gradient-to-b from-primary-500/5 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] rounded-full border border-dark-900/10 dark:border-white/5 opacity-50" />
      </div>

      {/* Component Title & Instruction */}
      <div className="text-center mb-10 sm:mb-14 px-4 z-10">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dark-900 mb-3 sm:mb-4">
          Popular Calculators
        </h2>
        <p className="text-dark-400 max-w-lg mx-auto mb-2 text-sm leading-relaxed">
          Explore our most used <strong>free online calculators</strong> to save time and simplify your life.
        </p>
        <p className="text-[11px] font-semibold text-primary-600 tracking-wider uppercase bg-primary-50 border border-primary-100 px-3 py-1 rounded-full inline-block mt-2">
          {isMobile
            ? 'Swipe to choose a calculator'
            : 'Hover over any calculator to use it'}
        </p>
      </div>

      {isMobile ? (
        // Mobile Horizontal Scroll Snap Layout
        <div className="relative w-full max-w-full flex justify-center py-6 px-2 sm:px-4">
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-3 sm:gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-none px-[calc(50vw-140px)] sm:px-[calc(50vw-150px)] py-4 w-full"
            style={{ scrollBehavior: 'smooth' }}
          >
            {cards.map((card, i) => {
              const isActive = activeIndex === i
              return (
                <div
                  key={card.name}
                  className="snap-center shrink-0 w-[260px] sm:w-[280px] h-[400px] sm:h-[410px] transition-all duration-300 relative"
                  style={{
                    transform: isActive ? 'scale(1.02)' : 'scale(0.92)',
                    opacity: isActive ? 1 : 0.5,
                    zIndex: isActive ? 30 : 10,
                  }}
                >
                  {/* Card Container wrapper */}
                  <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-xl">
                    {card.render}
                  </div>
                  {/* Invisible block click to slide interaction */}
                  {!isActive && (
                    <div
                      className="absolute inset-0 z-40 cursor-pointer"
                      onClick={() => {
                        const container = scrollContainerRef.current
                        if (container) {
                          container.scrollTo({
                            left: i * 290,
                            behavior: 'smooth',
                          })
                        }
                      }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        // Desktop Fanned Overlay Cards Layout
        <div
          className="relative w-[800px] h-[480px] mt-10 flex items-center justify-center"
          onMouseLeave={() => setActiveIndex(null)} // Return focus to resting state
        >
          {cards.map((card, i) => {
            const style = getDesktopCardStyle(i)
            const isActive = activeIndex === i
            return (
              <motion.div
                key={card.name}
                className="absolute left-[252.5px] top-[25px] w-[295px] h-[430px] rounded-2xl origin-bottom transition-all duration-300"
                style={{
                  transform: `translate3d(${style.x}, ${style.y}, 0) rotate(${style.rotate}) scale(${style.scale})`,
                  zIndex: style.zIndex,
                  filter: style.filter,
                  boxShadow: style.boxShadow,
                }}
              >
                {/* Visual card glow border when active */}
                {isActive && (
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary-400 to-indigo-500 opacity-20 blur-md -z-10 animate-pulse-slow" />
                )}

                {/* Card Container wrapper */}
                <div className="w-full h-full relative rounded-2xl overflow-hidden bg-white shadow-xl">
                  {card.render}
                </div>

                {/* Overlay wrapper to capture hover and block child controls when not focused */}
                {!isActive && (
                  <div
                    className="absolute inset-0 z-40 cursor-pointer pointer-events-auto bg-transparent"
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => setActiveIndex(i)}
                  />
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </section>
  )
}
