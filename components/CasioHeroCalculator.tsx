'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useKeyboardInput } from '@/hooks/useKeyboardInput'
import {
  tokenize,
  evaluate,
  balanceParens,
  formatNumberForDisplay,
  prettifyExpr,
  tryEvaluate,
  type AngleMode,
} from '@/lib/scientific-engine'
import s from './casio-hardware.module.css'

/* =========================================================================
   CASIO fx-991EX CLASSWIZ — Pixel-perfect hardware replica  (v2)
   -------------------------------------------------------------------------
   Realistic brushed-steel buttons, sculpted D-pad, wider body, readable
   bottom keys. Same engine as the in-app scientific calculator.
   ========================================================================= */

export default function CasioHeroCalculator() {
  const [expr, setExpr] = useState('')
  const [ans, setAns] = useState<number | null>(null)
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG')
  const [isShift, setIsShift] = useState(false)
  const [isAlpha, setIsAlpha] = useState(false)
  const [preview, setPreview] = useState<number | null>(null)
  const [history, setHistory] = useState<string[]>([
    'sqrt(2)*5',
    'sin(30)+cos(60)',
    'log(100)*ln(e)',
  ])
  const [historyIdx, setHistoryIdx] = useState<number>(-1)

  const exprRef = useRef(expr)
  exprRef.current = expr

  /* ----------------------- Input handlers ----------------------- */

  const append = (s: string) => {
    setExpr((cur) => (cur === 'ERROR' || cur === 'Ans' ? s : cur + s))
    setIsShift(false)
    setIsAlpha(false)
  }

  const appendFn = (name: string) => {
    setExpr((cur) => (cur === 'ERROR' || cur === 'Ans' ? `${name}(` : `${cur}${name}(`))
    setIsShift(false)
    setIsAlpha(false)
  }

  const appendNumber = (n: string) => {
    setExpr((cur) => (cur === 'ERROR' || cur === 'Ans' ? n : cur + n))
    setIsShift(false)
    setIsAlpha(false)
  }

  const appendDot = () => {
    setExpr((cur) => {
      if (cur === 'ERROR' || cur === 'Ans') return '0.'
      const tail = cur.split(/[^0-9.]/).pop() || ''
      if (tail.includes('.')) return cur
      return cur + '.'
    })
    setIsShift(false)
    setIsAlpha(false)
  }

  const backspace = () => {
    setExpr((cur) => (cur === 'ERROR' || cur === 'Ans' ? '' : cur.slice(0, -1)))
  }

  const clearAll = () => {
    setExpr('')
    setAns(null)
    setPreview(null)
    setIsShift(false)
    setIsAlpha(false)
    setHistoryIdx(-1)
  }

  const toggleSign = () => {
    setExpr((cur) => {
      if (!cur) return '-'
      const m = cur.match(/(-?[0-9]+(?:\.[0-9]*)?)$/)
      if (m) {
        const num = m[1]
        const start = m.index!
        const toggled = num.startsWith('-') ? num.slice(1) : '-' + num
        return cur.slice(0, start) + toggled
      }
      return cur + '-'
    })
  }

  const appendPercent = () => {
    setExpr((cur) => (cur === 'ERROR' || cur === 'Ans' ? '' : cur + '/100'))
    setIsShift(false)
    setIsAlpha(false)
  }

  const equals = () => {
    let e = exprRef.current
    if (!e.trim()) return

    const ansStr = ans !== null ? ans.toString() : '0'
    e = e.replace(/\bAns\b/g, ansStr)

    const xStr = ans !== null ? ans.toString() : '5'
    e = e.replace(/\bx\b/gi, xStr)

    const balanced = balanceParens(e)
    try {
      const tokens = tokenize(balanced)
      if (tokens.length === 0) return
      const v = evaluate(tokens, angleMode)
      if (!isFinite(v) || isNaN(v)) throw new Error('math error')
      const formatted = formatNumberForDisplay(v)
      setAns(v)

      setHistory(prev => {
        const next = [...prev, exprRef.current]
        if (next.length > 20) next.shift()
        return next
      })
      setHistoryIdx(-1)

      setExpr(formatted)
      setPreview(null)
    } catch {
      setExpr('ERROR')
      setPreview(null)
    }
    setIsShift(false)
    setIsAlpha(false)
  }

  /* ----------------------- D-pad Navigation ----------------------- */

  const handleDpad = (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (direction === 'UP') {
      if (history.length === 0) return
      setHistoryIdx((prevIdx) => {
        const nextIdx = prevIdx === -1 ? history.length - 1 : Math.max(0, prevIdx - 1)
        setExpr(history[nextIdx])
        return nextIdx
      })
    } else if (direction === 'DOWN') {
      if (history.length === 0) return
      setHistoryIdx((prevIdx) => {
        if (prevIdx === -1 || prevIdx === history.length - 1) {
          setExpr('')
          return -1
        }
        const nextIdx = prevIdx + 1
        setExpr(history[nextIdx])
        return nextIdx
      })
    } else {
      setIsShift((s) => !s)
    }
  }

  /* ----------------------- Live preview ----------------------- */

  const evaluateCurrent = useCallback((): number | null => {
    let e = exprRef.current
    const ansStr = ans !== null ? ans.toString() : '0'
    e = e.replace(/\bAns\b/g, ansStr)
    const xStr = ans !== null ? ans.toString() : '5'
    e = e.replace(/\bx\b/gi, xStr)
    return tryEvaluate(e, angleMode)
  }, [ans, angleMode])

  useEffect(() => {
    if (!expr || expr === 'ERROR' || expr === 'Ans') { setPreview(null); return }
    setPreview(evaluateCurrent())
  }, [expr, angleMode, evaluateCurrent])

  /* ----------------------- Keyboard support ----------------------- */

  const flashKey = useRef<((k: string) => void) | null>(null)

  useKeyboardInput({
    '0': () => { appendNumber('0'); flashKey.current?.('0') },
    '1': () => { appendNumber('1'); flashKey.current?.('1') },
    '2': () => { appendNumber('2'); flashKey.current?.('2') },
    '3': () => { appendNumber('3'); flashKey.current?.('3') },
    '4': () => { appendNumber('4'); flashKey.current?.('4') },
    '5': () => { appendNumber('5'); flashKey.current?.('5') },
    '6': () => { appendNumber('6'); flashKey.current?.('6') },
    '7': () => { appendNumber('7'); flashKey.current?.('7') },
    '8': () => { appendNumber('8'); flashKey.current?.('8') },
    '9': () => { appendNumber('9'); flashKey.current?.('9') },
    '.': () => { appendDot(); flashKey.current?.('.') },
    '+': () => { append('+'); flashKey.current?.('+') },
    '-': () => { append('-'); flashKey.current?.('-') },
    '*': () => { append('*'); flashKey.current?.('×') },
    '/': () => { append('/'); flashKey.current?.('÷') },
    '^': () => { append('^'); flashKey.current?.('^') },
    '(': () => { append('('); flashKey.current?.('(') },
    ')': () => { append(')'); flashKey.current?.(')') },
    '!': () => { append('!'); flashKey.current?.('!') },
    '%': () => { appendPercent(); flashKey.current?.('%') },
    'Backspace': () => { backspace(); flashKey.current?.('DEL') },
    'Delete': () => { backspace(); flashKey.current?.('DEL') },
    'Escape': () => { clearAll(); flashKey.current?.('AC') },
    'c': () => { clearAll(); flashKey.current?.('AC') },
    'C': () => { clearAll(); flashKey.current?.('AC') },
    '=': () => { equals(); flashKey.current?.('=') },
    'Enter': () => { equals(); flashKey.current?.('=') },
  })

  const [pressedKey, setPressedKey] = useState<string | null>(null)
  useEffect(() => {
    flashKey.current = (k: string) => {
      setPressedKey(k)
      window.setTimeout(() => setPressedKey(null), 80)
    }
  }, [])

  /* ----------------------- Display strings ----------------------- */

  const isError = expr === 'ERROR'
  const displayExpr = expr === '' ? '' : (expr === 'ERROR' || expr === 'Ans' ? expr : prettifyExpr(expr))
  const bottomDisplay = preview !== null
    ? formatNumberForDisplay(preview)
    : isError
      ? 'Math ERROR'
      : expr && expr !== 'Ans' && !isNaN(Number(expr))
        ? formatNumberForDisplay(Number(expr)) || '0'
        : ans !== null
          ? formatNumberForDisplay(ans)
          : '0'

  /* ----------------------- Key render helper ----------------------- */

  const Key = ({
    label,
    subShift,
    subAlpha,
    subBlue,
    type,
    onClick,
    pressId,
  }: {
    label: React.ReactNode
    subShift?: string
    subAlpha?: string
    subBlue?: string
    type: 'Scientific' | 'White' | 'Blue'
    onClick: () => void
    pressId?: string
  }) => (
    <div className={s.casioKeyWrap}>
      {subShift && <span className={s.casioKeyLabelLeft}>{subShift}</span>}
      {subAlpha && <span className={s.casioKeyLabelRight}>{subAlpha}</span>}
      {subBlue && <span className={s.casioKeyLabelCenter}>{subBlue}</span>}
      <button
        type="button"
        onClick={onClick}
        className={`${s.casioKey} ${s[`casioKey${type}`]} ${pressedKey === pressId ? s.casioPressed : ''}`}
      >
        {label}
      </button>
    </div>
  )

  return (
    <div className={s.casioOuterFrame}>
      <div className={s.casioBody}>
        {/* ===== Glossy Bezel: LCD, Solar, Brand ===== */}
        <div className={s.casioLcdBezel}>
          <div className={s.casioBrandHeader}>
            <div className={s.casioBrandLeft}>
              <span className={s.casioWordmark}>CASIO</span>
              <span className={s.casioModel}>fx-991EX</span>
              <span className={s.casioClasswiz}>CLASSWIZ</span>
            </div>
            <div className={s.casioSolar} aria-hidden="true">
              <div className={s.casioSolarCell} />
              <div className={s.casioSolarCell} />
              <div className={s.casioSolarCell} />
              <div className={s.casioSolarCell} />
            </div>
          </div>

          <div className={s.casioLcd}>
            <div className={s.casioStatus}>
              <span>
                <span style={{ opacity: angleMode === 'DEG' ? 1 : 0.3 }}>D</span>
                {'  '}
                <span style={{ opacity: angleMode === 'RAD' ? 1 : 0.3 }}>R</span>
                {'  '}
                <span style={{ opacity: isShift ? 1 : 0.3, color: isShift ? '#b8860b' : undefined }}>S</span>
                {'  '}
                <span style={{ opacity: isAlpha ? 1 : 0.3, color: isAlpha ? '#ff2a5f' : undefined }}>A</span>
                {'  '}
                <span style={{ opacity: ans !== null ? 1 : 0.3 }}>M</span>
              </span>
              <span className={s.casioStatusRight}>Math</span>
            </div>
            <div className={s.casioExpr}>{displayExpr}</div>
            <div className={`${s.casioResult} ${isError ? s.casioResultError : ''}`}>
              {bottomDisplay}
            </div>
          </div>
        </div>

        {/* ===== Top Controls: Brushed-Steel Buttons & Sculpted D-Pad ===== */}
        <div className={s.casioTopControlPanel}>
          {/* Left pair: SHIFT + ALPHA */}
          <div className={s.casioTopControlCol}>
            <div className={s.casioTopKeyWrap}>
              <span className={s.casioTopKeyLabel} style={{ color: '#d8a010' }}>SHIFT</span>
              <button
                type="button"
                className={s.casioMetalBtn}
                onClick={() => { setIsShift(!isShift); setIsAlpha(false) }}
                aria-label="Shift"
              />
              <span className={s.casioTopKeySubLabel} style={{ color: '#d8a010' }}>QR</span>
            </div>
            <div className={s.casioTopKeyWrap}>
              <span className={s.casioTopKeyLabel} style={{ color: '#ff3366' }}>ALPHA</span>
              <button
                type="button"
                className={s.casioMetalBtn}
                onClick={() => { setIsAlpha(!isAlpha); setIsShift(false) }}
                aria-label="Alpha"
              />
              <span className={s.casioTopKeySubLabel} style={{ color: '#d8a010' }}>SOLVE <span style={{ color: '#ff3366' }}>=</span></span>
            </div>
          </div>

          {/* Center: D-Pad */}
          <div className={s.casioDpadContainer}>
            <div className={s.casioDpad}>
              <button type="button" className={`${s.casioDpadBtn} ${s.casioDpadUp}`} onClick={() => handleDpad('UP')} aria-label="Up">▲</button>
              <button type="button" className={`${s.casioDpadBtn} ${s.casioDpadLeft}`} onClick={() => handleDpad('LEFT')} aria-label="Left">◀</button>
              <div className={s.casioDpadCenter} />
              <button type="button" className={`${s.casioDpadBtn} ${s.casioDpadRight}`} onClick={() => handleDpad('RIGHT')} aria-label="Right">▶</button>
              <button type="button" className={`${s.casioDpadBtn} ${s.casioDpadDown}`} onClick={() => handleDpad('DOWN')} aria-label="Down">▼</button>
            </div>
          </div>

          {/* Right pair: MENU SETUP + ON */}
          <div className={s.casioTopControlCol}>
            <div className={s.casioTopKeyWrap}>
              <span className={s.casioTopKeyLabel} style={{ color: '#ffffff' }}>MENU SETUP</span>
              <button
                type="button"
                className={s.casioMetalBtn}
                onClick={() => setAngleMode(angleMode === 'DEG' ? 'RAD' : 'DEG')}
                aria-label="Menu Setup"
              />
              <span className={s.casioTopKeySubLabel} style={{ color: '#d8a010' }}>d/dx <span style={{ color: '#ff3366' }}>■</span></span>
            </div>
            <div className={s.casioTopKeyWrap}>
              <span className={s.casioTopKeyLabel} style={{ color: '#ffffff' }}>ON</span>
              <button
                type="button"
                className={s.casioMetalBtn}
                onClick={clearAll}
                aria-label="On / Clear"
              />
            </div>
          </div>
        </div>

        {/* ===== Scientific and Numeric Keys ===== */}
        <div className={s.casioKeys}>

          {/* ROW 1: OPTN, CALC, ∫, x */}
          <div className={s.casioRow}>
            <Key label="OPTN" subShift="QR" type="Scientific" pressId="optn" onClick={() => append('mod')} />
            <Key label="CALC" subShift="SOLVE" subAlpha="=" type="Scientific" pressId="calc" onClick={equals} />
            <Key label="∫" subShift="d/dx" subAlpha=":" type="Scientific" pressId="int" onClick={() => appendFn('abs')} />
            <Key label="𝒙" subShift="Σ" subAlpha="x" type="Scientific" pressId="x" onClick={() => append('x')} />
          </div>

          {/* ROW 2: Fraction, Root, x², xʸ, log, ln */}
          <div className={s.casioRow}>
            <Key label="■/□" subShift="■■/■" type="Scientific" pressId="frac" onClick={() => append('/')} />
            <Key label="√" subShift="∛" type="Scientific" pressId="sqrt" onClick={() => appendFn(isShift ? 'cbrt' : 'sqrt')} />
            <Key label="x²" subShift="x³" subBlue="DEC" type="Scientific" pressId="sq" onClick={() => appendFn(isShift ? 'cu' : 'sq')} />
            <Key label="xʸ" subShift="ⁿ√" subBlue="HEX" type="Scientific" pressId="power" onClick={() => append('^')} />
            <Key label="log" subShift="10ˣ" subBlue="BIN" type="Scientific" pressId="log" onClick={() => appendFn(isShift ? 'tenx' : 'log')} />
            <Key label="ln" subShift="eˣ" subBlue="OCT" type="Scientific" pressId="ln" onClick={() => appendFn(isShift ? 'exp' : 'ln')} />
          </div>

          {/* ROW 3: (−), °′″, x⁻¹, sin, cos, tan */}
          <div className={s.casioRow}>
            <Key label="(−)" subShift="log" subAlpha="A" type="Scientific" pressId="minus" onClick={toggleSign} />
            <Key label="°′″" subShift="FACT" subAlpha="B" type="Scientific" pressId="deg" onClick={() => appendFn('fact')} />
            <Key label="x⁻¹" subShift="x!" subAlpha="C" type="Scientific" pressId="inv" onClick={() => appendFn(isShift ? 'fact' : 'inv')} />
            <Key label="sin" subShift="sin⁻¹" subAlpha="D" type="Scientific" pressId="sin" onClick={() => appendFn(isShift ? 'asin' : 'sin')} />
            <Key label="cos" subShift="cos⁻¹" subAlpha="E" type="Scientific" pressId="cos" onClick={() => appendFn(isShift ? 'acos' : 'cos')} />
            <Key label="tan" subShift="tan⁻¹" subAlpha="F" type="Scientific" pressId="tan" onClick={() => appendFn(isShift ? 'atan' : 'tan')} />
          </div>

          {/* ROW 4: STO, ENG, (, ), S⇔D, M+ */}
          <div className={s.casioRow}>
            <Key label="STO" subShift="RCL" type="Scientific" pressId="sto" onClick={() => {}} />
            <Key label="ENG" subShift="←" subAlpha="i" type="Scientific" pressId="eng" onClick={() => {}} />
            <Key label="(" subShift="Abs" subAlpha="y" type="Scientific" pressId="(" onClick={() => append('(')} />
            <Key label=")" subAlpha="x" type="Scientific" pressId=")" onClick={() => append(')')} />
            <Key label="S⇔D" type="Scientific" pressId="sd" onClick={() => {}} />
            <Key label="M+" subShift="M−" subAlpha="M" type="Scientific" pressId="mplus" onClick={() => append('+Ans')} />
          </div>

          {/* ROW 5: 7, 8, 9, DEL, AC */}
          <div className={s.casioRow}>
            <Key label="7" subShift="CONST" type="White" pressId="7" onClick={() => appendNumber('7')} />
            <Key label="8" subShift="CONV" type="White" pressId="8" onClick={() => appendNumber('8')} />
            <Key label="9" subShift="CLR" type="White" pressId="9" onClick={() => appendNumber('9')} />
            <Key label="DEL" subShift="INS" subAlpha="UNDO" type="Blue" pressId="DEL" onClick={backspace} />
            <Key label="AC" subShift="OFF" type="Blue" pressId="AC" onClick={clearAll} />
          </div>

          {/* ROW 6: 4, 5, 6, ×, ÷ */}
          <div className={s.casioRow}>
            <Key label="4" type="White" pressId="4" onClick={() => appendNumber('4')} />
            <Key label="5" type="White" pressId="5" onClick={() => appendNumber('5')} />
            <Key label="6" type="White" pressId="6" onClick={() => appendNumber('6')} />
            <Key label="×" type="White" pressId="×" onClick={() => append('*')} />
            <Key label="÷" type="White" pressId="÷" onClick={() => append('/')} />
          </div>

          {/* ROW 7: 1, 2, 3, +, − */}
          <div className={s.casioRow}>
            <Key label="1" type="White" pressId="1" onClick={() => appendNumber('1')} />
            <Key label="2" type="White" pressId="2" onClick={() => appendNumber('2')} />
            <Key label="3" type="White" pressId="3" onClick={() => appendNumber('3')} />
            <Key label="+" type="White" pressId="+" onClick={() => append('+')} />
            <Key label="−" type="White" pressId="-" onClick={() => append('-')} />
          </div>

          {/* ROW 8: 0, •, ×10ˣ, Ans, = */}
          <div className={s.casioRow}>
            <Key label="0" subShift="Rnd" type="White" pressId="0" onClick={() => appendNumber('0')} />
            <Key label="•" subShift="Ran#" subAlpha="RanInt" type="White" pressId="." onClick={appendDot} />
            <Key label={<span style={{ fontSize: '12px' }}>×10<sup>x</sup></span>} subShift="π" subAlpha="e" type="White" pressId="x10" onClick={() => {
              if (isShift) append('pi')
              else if (isAlpha) append('e')
              else append('*10^(')
            }} />
            <Key label="Ans" subShift="%" type="White" pressId="ans" onClick={() => {
              if (isShift) appendPercent()
              else append('Ans')
            }} />
            <Key label="=" subShift="≈" type="White" pressId="=" onClick={equals} />
          </div>

        </div>

        {/* ===== Footer ===== */}
        <div className={s.casioFooter}>
          ⌨ Keyboard Enabled · ▲/▼ History
        </div>
      </div>
    </div>
  )
}