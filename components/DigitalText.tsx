'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import SegmentDisplay, { SegmentTheme } from './SegmentDisplay'

interface DigitalTextProps {
  text: string
  theme?: SegmentTheme
  size?: number // Height in pixels
  className?: string
  gap?: number // Gap between characters in pixels
  animate?: boolean // Power-on flicker animation
  activeColor?: string
  inactiveColor?: string
}

export default function DigitalText({
  text,
  theme = 'minimal',
  size,
  className = '',
  gap = 6,
  animate = true,
  activeColor,
  inactiveColor,
}: DigitalTextProps) {
  // Parse the text to merge dot characters with the preceding character
  const processedChars = useMemo(() => {
    const chars: { char: string; showDP: boolean }[] = []
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      
      if (char === '.' && chars.length > 0) {
        // Attach decimal point to the preceding character cell
        chars[chars.length - 1].showDP = true
      } else if (char === '.') {
        // Standalone dot
        chars.push({ char: '.', showDP: true })
      } else {
        chars.push({ char, showDP: false })
      }
    }
    
    return chars
  }, [text])

  // Framer Motion variants for the retro boot-up flickering effect
  const charVariants = {
    hidden: { opacity: 0.1 },
    visible: (i: number) => ({
      opacity: 1,
      // Retro flicker sequence (VFD or old LCD startup)
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: 'easeOut',
        // Rapid power-up flicker
        opacity: {
          times: [0, 0.1, 0.2, 0.4, 0.6, 0.8, 1],
          values: [0.1, 0.8, 0.3, 0.9, 0.5, 0.95, 1],
          duration: 0.6,
        },
      },
    }),
  }

  return (
    <div
      className={`inline-flex flex-wrap items-center justify-center ${className}`}
      style={{ gap: `${gap}px` }}
    >
      {processedChars.map((item, index) => {
        const charComponent = (
          <SegmentDisplay
            key={index}
            char={item.char}
            showDP={item.showDP}
            theme={theme}
            size={size}
            activeColor={activeColor}
            inactiveColor={inactiveColor}
          />
        )

        if (animate) {
          return (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={charVariants}
            >
              {charComponent}
            </motion.div>
          )
        }

        return charComponent
      })}
    </div>
  )
}
