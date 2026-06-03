'use client'

import dynamic from 'next/dynamic'
import React from 'react'

// Dynamic imports for all calculator components — code-split per calculator
const calculatorComponents: Record<string, React.ComponentType> = {
  // Math
  'basic': dynamic(() => import('@/components/calculators/math/BasicCalculator')),
  'scientific': dynamic(() => import('@/components/calculators/math/ScientificCalculator')),
  'percentage': dynamic(() => import('@/components/calculators/math/PercentageCalculator')),
  'fraction': dynamic(() => import('@/components/calculators/math/FractionCalculator')),
  'area': dynamic(() => import('@/components/calculators/math/AreaCalculator')),
  'volume': dynamic(() => import('@/components/calculators/math/VolumeCalculator')),
  'quadratic': dynamic(() => import('@/components/calculators/math/QuadraticCalculator')),
  'statistics': dynamic(() => import('@/components/calculators/math/StatisticsCalculator')),
  'gcd-lcm': dynamic(() => import('@/components/calculators/math/GcdLcmCalculator')),
  'number-base': dynamic(() => import('@/components/calculators/math/NumberBaseConverter')),
  'exponent': dynamic(() => import('@/components/calculators/math/ExponentCalculator')),
  'permutation-combination': dynamic(() => import('@/components/calculators/math/PermutationCombinationCalculator')),
  'ratio': dynamic(() => import('@/components/calculators/math/RatioCalculator')),
  'logarithm': dynamic(() => import('@/components/calculators/math/LogarithmCalculator')),

  // Finance
  'loan-emi': dynamic(() => import('@/components/calculators/finance/LoanEmiCalculator')),
  'compound-interest': dynamic(() => import('@/components/calculators/finance/CompoundInterestCalculator')),
  'simple-interest': dynamic(() => import('@/components/calculators/finance/SimpleInterestCalculator')),
  'sip': dynamic(() => import('@/components/calculators/finance/SipCalculator')),
  'tip': dynamic(() => import('@/components/calculators/finance/TipCalculator')),
  'discount': dynamic(() => import('@/components/calculators/finance/DiscountCalculator')),
  'profit-margin': dynamic(() => import('@/components/calculators/finance/ProfitMarginCalculator')),
  'roi': dynamic(() => import('@/components/calculators/finance/RoiCalculator')),
  'salary': dynamic(() => import('@/components/calculators/finance/SalaryCalculator')),
  'mortgage': dynamic(() => import('@/components/calculators/finance/MortgageCalculator')),
  'inflation': dynamic(() => import('@/components/calculators/finance/InflationCalculator')),
  'break-even': dynamic(() => import('@/components/calculators/finance/BreakEvenCalculator')),
  'savings-goal': dynamic(() => import('@/components/calculators/finance/SavingsGoalCalculator')),
  'currency': dynamic(() => import('@/components/calculators/finance/CurrencyConverter')),

  // Health
  'bmi': dynamic(() => import('@/components/calculators/health/BmiCalculator')),
  'calorie': dynamic(() => import('@/components/calculators/health/CalorieCalculator')),
  'body-fat': dynamic(() => import('@/components/calculators/health/BodyFatCalculator')),
  'ideal-weight': dynamic(() => import('@/components/calculators/health/IdealWeightCalculator')),
  'water-intake': dynamic(() => import('@/components/calculators/health/WaterIntakeCalculator')),
  'heart-rate': dynamic(() => import('@/components/calculators/health/HeartRateCalculator')),
  'macro': dynamic(() => import('@/components/calculators/health/MacroCalculator')),
  'pregnancy': dynamic(() => import('@/components/calculators/health/PregnancyCalculator')),

  // Date & Time
  'age': dynamic(() => import('@/components/calculators/datetime/AgeCalculator')),
  'date-difference': dynamic(() => import('@/components/calculators/datetime/DateDifferenceCalculator')),
  'time': dynamic(() => import('@/components/calculators/datetime/TimeCalculator')),
  'countdown': dynamic(() => import('@/components/calculators/datetime/CountdownCalculator')),

  // Conversion
  'length': dynamic(() => import('@/components/calculators/conversion/LengthConverter')),
  'weight': dynamic(() => import('@/components/calculators/conversion/WeightConverter')),
  'temperature': dynamic(() => import('@/components/calculators/conversion/TemperatureConverter')),
  'speed': dynamic(() => import('@/components/calculators/conversion/SpeedConverter')),
  'data-storage': dynamic(() => import('@/components/calculators/conversion/DataStorageConverter')),
  'energy': dynamic(() => import('@/components/calculators/conversion/EnergyConverter')),
  'cooking': dynamic(() => import('@/components/calculators/conversion/CookingConverter')),

  // Everyday
  'gpa': dynamic(() => import('@/components/calculators/everyday/GpaCalculator')),
  'random-number': dynamic(() => import('@/components/calculators/everyday/RandomNumberGenerator')),
  'password': dynamic(() => import('@/components/calculators/everyday/PasswordGenerator')),
  'word-counter': dynamic(() => import('@/components/calculators/everyday/WordCounter')),
  'color': dynamic(() => import('@/components/calculators/everyday/ColorConverter')),
}

export function getCalculatorComponent(slug: string): React.ComponentType | null {
  return calculatorComponents[slug] || null
}
