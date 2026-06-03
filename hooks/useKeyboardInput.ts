'use client'

import { useEffect, useCallback } from 'react'

type KeyMap = {
  [key: string]: () => void
}

/**
 * Hook to bind keyboard events to calculator actions.
 * Maps number keys, operators, Enter, Escape, Backspace to calculator functions.
 */
export function useKeyboardInput(keyMap: KeyMap, enabled: boolean = true) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return

      // Don't capture when user is typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      const key = e.key

      // Map Enter to '='
      const mappedKey = key === 'Enter' ? '=' : key === 'Escape' ? 'Escape' : key

      if (keyMap[mappedKey]) {
        e.preventDefault()
        keyMap[mappedKey]()
      }
    },
    [keyMap, enabled]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

/**
 * Creates a standard key map for a basic/scientific calculator.
 */
export function createStandardKeyMap(handlers: {
  onNumber: (n: string) => void
  onOperator: (op: string) => void
  onEquals: () => void
  onClear: () => void
  onDelete: () => void
  onDot: () => void
  onToggleSign?: () => void
}) {
  const map: KeyMap = {}

  // Numbers
  for (let i = 0; i <= 9; i++) {
    map[i.toString()] = () => handlers.onNumber(i.toString())
  }

  // Operators
  map['+'] = () => handlers.onOperator('+')
  map['-'] = () => handlers.onOperator('-')
  map['*'] = () => handlers.onOperator('*')
  map['/'] = () => handlers.onOperator('/')
  map['^'] = () => handlers.onOperator('^')

  // Actions
  map['='] = handlers.onEquals
  map['Escape'] = handlers.onClear
  map['Backspace'] = handlers.onDelete
  map['.'] = handlers.onDot

  return map
}
