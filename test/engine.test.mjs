// Comprehensive test suite for the Calc_Craft engine
// Run with: npx tsx test/engine.test.mjs
// (or compile via tsc and run the JS output)

import {
  evaluate, evaluateBig,
  calculateEMI, calculateCompoundInterest, calculateSIP,
  calculateSimpleInterest, calculateInflation, calculateROI,
  calculateDiscount, calculateProfitMargin, calculateBreakEven,
  calculateTip, calculateSalary, calculateSavingsGoal,
  calculateBMI, calculateBMR, calculateTDEE, calculateBodyFatNavy,
  calculateIdealWeight, calculateHeartRate, calculateWaterIntake,
  calculateMacros, calculateDueDate, calculateAge, calculateDateDifference,
  addTime, convertUnits, convertTemperature, convertCooking, convertCurrency,
  mean, median, mode, stddev, variance, sum, range_,
  formatNumber, formatCurrency, formatPercent,
} from '../lib/calc-engine'

let passed = 0, failed = 0

function approx(a, b, tol = 1e-9) { return Math.abs(a - b) < tol }
function pct(a, b) { return Math.abs(a - b) < Math.abs(b) * 1e-9 + 1e-12 }
function eqStr(a, b) { return String(a) === String(b) }

async function test(name, fn) {
  try {
    await fn()
    passed++
    console.log(`  ✓ ${name}`)
  } catch (e) {
    failed++
    console.log(`  ✗ ${name}: ${e.message}`)
  }
}

function assert(cond, msg = 'assertion failed') {
  if (!cond) throw new Error(msg)
}

async function assertEval(expr, expected, opts) {
  const r = await evaluate(expr, opts)
  assert(r.ok, `expected ok, got error: ${r.ok ? '' : r.error}`)
  if (typeof expected === 'number') {
    assert(approx(r.value, expected) || pct(r.value, expected),
      `evaluate(${JSON.stringify(expr)}) = ${r.value}, expected ~${expected}`)
  } else {
    assert(eqStr(r.value, expected), `evaluate(${JSON.stringify(expr)}) = ${r.value}, expected ${expected}`)
  }
}

async function assertError(expr, opts) {
  const r = await evaluate(expr, opts)
  assert(!r.ok, `expected error for ${JSON.stringify(expr)}, got ${r.value}`)
}

console.log('== General Math ==')
await test('integer arithmetic', async () => {
  await assertEval('2 + 3', 5)
  await assertEval('10 - 4', 6)
  await assertEval('6 * 7', 42)
  await assertEval('20 / 4', 5)
  await assertEval('2 + 3 * 4', 14)
  await assertEval('(2 + 3) * 4', 20)
  await assertEval('2^10', 1024)
})
await test('floating-point precision (BigNumber)', async () => {
  // With BigNumber + 64 digits, 0.1+0.2 should equal exactly 0.3
  const r = await evaluate('0.1 + 0.2')
  assert(r.ok, 'should succeed')
  assert(approx(r.value, 0.3, 1e-50), `0.1+0.2 = ${r.value}, expected 0.3 with BigNumber precision`)
})
await test('chained power (right-associative)', async () => {
  await assertEval('2^3^2', 512) // 2^(3^2) = 2^9 = 512
})
await test('sqrt', async () => {
  await assertEval('sqrt(8)', Math.sqrt(8))
  await assertEval('sqrt(2)', Math.sqrt(2))
  await assertEval('sqrt(144)', 12)
})
await test('cube root', async () => {
  await assertEval('cbrt(27)', 3)
  await assertEval('cbrt(8)', 2)
  await assertEval('cbrt(64)', 4)
})
await test('roots and powers', async () => {
  await assertEval('nthRoot(16, 4)', 2)
  await assertEval('nthRoot(81, 2)', 9)
  await assertEval('nthRoot(1000, 3)', 10)
})
await test('factorial', async () => {
  await assertEval('5!', 120)
  await assertEval('0!', 1)
  await assertEval('1!', 1)
  await assertEval('10!', 3628800)
})
await test('unary minus', async () => {
  await assertEval('-5', -5)
  await assertEval('-(2+3)*2', -10)
  await assertEval('-sqrt(16)', -4)
})
await test('constants', async () => {
  await assertEval('pi', Math.PI)
  await assertEval('e', Math.E)
  await assertEval('2*pi', 2 * Math.PI)
  await assertEval('pi^2', Math.PI ** 2)
})
await test('log and ln', async () => {
  await assertEval('log(100)', Math.log(100))  // natural log (mathjs convention)
  await assertEval('log10(100)', 2)            // base-10 log
  await assertEval('log10(1000)', 3)
  await assertEval('ln(e)', 1)                  // natural log via ln
  await assertEval('ln(10)', Math.log(10))
  await assertEval('exp(1)', Math.E)
  await assertEval('exp(0)', 1)
})
await test('trig in RAD (default)', async () => {
  await assertEval('sin(0)', 0)
  await assertEval('sin(pi/2)', 1)
  await assertEval('cos(0)', 1)
  await assertEval('cos(pi)', -1)
  await assertEval('tan(pi/4)', 1)
})
await test('trig in DEG mode', async () => {
  await assertEval('sin(0)', 0, { angleMode: 'DEG' })
  await assertEval('sin(30)', 0.5, { angleMode: 'DEG' })
  await assertEval('sin(90)', 1, { angleMode: 'DEG' })
  await assertEval('cos(60)', 0.5, { angleMode: 'DEG' })
  await assertEval('cos(180)', -1, { angleMode: 'DEG' })
  await assertEval('tan(45)', 1, { angleMode: 'DEG' })
})
await test('inverse trig', async () => {
  await assertEval('asin(1)', Math.PI / 2)
  await assertEval('acos(0)', Math.PI / 2)
  await assertEval('atan(1)', Math.PI / 4)
  await assertEval('asin(0.5)', Math.PI / 6)
})
await test('modulo and percent', async () => {
  await assertEval('10 mod 3', 1)
  await assertEval('15 % 4', 3)
  await assertEval('100 * 0.05', 5)
})
await test('parentheses nesting', async () => {
  await assertEval('((1+2)*(3+4))/(5+6)', 21/11)
  await assertEval('2*(3+(4*5))', 2*(3+20))
})
await test('domain errors', async () => {
  await assertError('sqrt(-1)')
  await assertError('ln(0)')
  await assertError('log(-5)')
  await assertError('1/0')
  await assertError('5 / (3-3)')
})
await test('large numbers', async () => {
  await assertEval('2^50', 1125899906842624)
  await assertEval('999999999999 * 999999999999', 999999999998000000000001)
})
await test('small decimals', async () => {
  await assertEval('0.001 * 0.001', 0.000001)
})
await test('factorial domain', async () => {
  await assertError('(-1)!')
  await assertError('1.5!')
})
await test('abs, floor, ceil, round', async () => {
  await assertEval('abs(-7)', 7)
  await assertEval('abs(3.5)', 3.5)
  await assertEval('floor(3.7)', 3)
  await assertEval('ceil(3.2)', 4)
  await assertEval('round(3.7)', 4)
  await assertEval('round(3.2)', 3)
})
await test('1/x', async () => {
  await assertEval('1/4', 0.25)
  await assertEval('1/(1/8)', 8)
})

console.log('\n== Finance: EMI (loan) ==')
await test('standard EMI (P=200k, r=8%, n=240 months)', async () => {
  const r = await calculateEMI(200000, 8, 240)
  // EMI ≈ 1672.88
  assert(approx(r.emi, 1672.88, 0.01), `EMI = ${r.emi}, expected ~1672.88`)
  assert(approx(r.totalPayment, 401491, 5), `total = ${r.totalPayment}`)
  assert(approx(r.totalInterest, 201491, 5), `interest = ${r.totalInterest}`)
})
await test('zero interest EMI', async () => {
  const r = await calculateEMI(12000, 0, 12)
  assert(approx(r.emi, 1000), `EMI = ${r.emi}`)
  assert(approx(r.totalPayment, 12000))
  assert(approx(r.totalInterest, 0))
})
await test('EMI for $300k mortgage at 6% for 30 years', async () => {
  const r = await calculateEMI(300000, 6, 360)
  // Reference: 1798.65
  assert(approx(r.emi, 1798.65, 0.05), `EMI = ${r.emi}`)
})

console.log('\n== Finance: Compound interest ==')
await test('compound interest $1000 at 5% for 10 years, monthly compounding', async () => {
  const r = await calculateCompoundInterest(1000, 5, 10, 12)
  // A = 1000 * (1 + 0.05/12)^120 ≈ 1647.01
  assert(approx(r.amount, 1647.01, 0.05), `amount = ${r.amount}`)
})

console.log('\n== Finance: SIP ==')
await test('SIP ₹5000/month at 12% for 10 years (120 months)', async () => {
  const r = await calculateSIP(5000, 12, 120)
  // Reference: ≈ 1,161,695
  assert(approx(r.futureValue, 1161695, 100), `FV = ${r.futureValue}`)
})

console.log('\n== Finance: Simple interest ==')
await test('$5000 at 6% for 3 years', async () => {
  const r = await calculateSimpleInterest(5000, 6, 3)
  assert(approx(r.interest, 900), `interest = ${r.interest}`)
  assert(approx(r.amount, 5900), `amount = ${r.amount}`)
})

console.log('\n== Finance: Inflation ==')
await test('$100000 inflated at 3% for 20 years', async () => {
  const r = await calculateInflation(100000, 3, 20)
  // 100000 * 1.03^20 ≈ 180611
  assert(approx(r.futureValue, 180611, 5), `FV = ${r.futureValue}`)
})

console.log('\n== Finance: ROI, discount, margin, break-even, tip, salary ==')
await test('ROI', async () => {
  assert(approx(calculateROI(1000, 1500), 50), 'ROI 1000→1500 = 50%')
  assert(approx(calculateROI(1000, 500), -50), 'ROI 1000→500 = -50%')
})
await test('Discount', async () => {
  const r = calculateDiscount(100, 25)
  assert(approx(r.finalPrice, 75), 'finalPrice = 75')
  assert(approx(r.saved, 25), 'saved = 25')
})
await test('Profit margin', async () => {
  assert(approx(calculateProfitMargin(200, 120), 40), 'margin 200/120 = 40%')
})
await test('Break-even', async () => {
  // $1000 fixed, sell at $50, cost $30, margin $20
  // Break-even = 1000/20 = 50 units
  assert(approx(calculateBreakEven(1000, 50, 30), 50))
})
await test('Tip split 4 ways', async () => {
  const r = calculateTip(100, 20, 4)
  assert(approx(r.tip, 20), 'tip = 20')
  assert(approx(r.total, 120), 'total = 120')
  assert(approx(r.perPerson, 30), 'perPerson = 30')
})
await test('Salary breakdown $60k', async () => {
  const r = calculateSalary(60000)
  assert(approx(r.monthly, 5000), 'monthly = 5000')
  assert(approx(r.weekly, 60000 / 52, 0.01))
  assert(approx(r.hourly, 60000 / 52 / 40, 0.01))
})
await test('Savings goal: $10000 target, $200/month, 5% APR', async () => {
  // Future value of annuity formula solved for n:
  //   n = ln((target * r / deposit) + 1) / ln(1 + r)
  // r = 0.05/12 = 0.004167
  // 10000 * 0.004167 / 200 = 0.2083
  // ln(1.2083) / ln(1.004167) = 56.2 → ceil = 57
  const months = await calculateSavingsGoal(10000, 200, 5)
  assert(months === 57, `months = ${months}, expected 57`)
})

console.log('\n== Health: BMI ==')
await test('BMI 70kg / 170cm', async () => {
  assert(approx(calculateBMI(70, 170), 24.22, 0.01), 'BMI should be ~24.22')
})
await test('BMI edge cases', async () => {
  assert(calculateBMI(0, 170) === 0, 'zero weight = 0')
  assert(calculateBMI(70, 0) === 0, 'zero height = 0')
})

console.log('\n== Health: BMR / TDEE ==')
await test('BMR male 30y, 80kg, 180cm', async () => {
  // Mifflin: 10*80 + 6.25*180 - 5*30 + 5 = 800 + 1125 - 150 + 5 = 1780
  assert(approx(calculateBMR(80, 180, 30, 'male'), 1780))
})
await test('BMR female 30y, 60kg, 165cm', async () => {
  // 10*60 + 6.25*165 - 5*30 - 161 = 600 + 1031.25 - 150 - 161 = 1320.25
  assert(approx(calculateBMR(60, 165, 30, 'female'), 1320.25, 0.01))
})
await test('TDEE sedentary', async () => {
  const bmr = 1780
  assert(approx(calculateTDEE(bmr, 'sedentary'), bmr * 1.2))
})
await test('TDEE very-active', async () => {
  const bmr = 1780
  assert(approx(calculateTDEE(bmr, 'very-active'), bmr * 1.9))
})

console.log('\n== Health: Body fat, ideal weight, heart rate, water, macros ==')
await test('Body fat (US Navy) male 180cm 85cm waist 40cm neck', async () => {
  // 495 / (1.0324 - 0.19077 * log10(45) + 0.15456 * log10(180)) - 450
  const expected = 495 / (1.0324 - 0.19077 * Math.log10(45) + 0.15456 * Math.log10(180)) - 450
  assert(approx(calculateBodyFatNavy('male', 180, 85, 40), expected, 0.01))
})
await test('Body fat (US Navy) female requires hip', async () => {
  assert(calculateBodyFatNavy('female', 165, 75, 30, 95) > 0)
  assert(calculateBodyFatNavy('female', 165, 75, 30) === 0, 'missing hip should be 0')
})
await test('Ideal weight (Devine) male 180cm', async () => {
  // 180cm = 70.87 inches. 70.87 - 60 = 10.87. 50 + 2.3 * 10.87 = 75.0
  assert(approx(calculateIdealWeight('male', 180), 75.0, 0.5))
})
await test('Ideal weight all formulas female 165cm', async () => {
  const { calculateIdealWeightAll } = await import('../lib/calc-engine.ts')
  const r = calculateIdealWeightAll('female', 165)
  // All 4 formulas must return positive values within sane range
  assert(r.devine > 50 && r.devine < 70, `devine = ${r.devine}`)
  assert(r.robinson > 50 && r.robinson < 70, `robinson = ${r.robinson}`)
  assert(r.miller > 50 && r.miller < 70, `miller = ${r.miller}`)
  assert(r.hamwi > 50 && r.hamwi < 70, `hamwi = ${r.hamwi}`)
  // BMI range for 165cm: 18.5*1.65²=50.4, 25*1.65²=68.06
  assert(approx(r.bmiRange.min, 50.4, 0.1))
  assert(approx(r.bmiRange.max, 68.06, 0.1))
})
await test('Heart rate 30y, resting 60, 70% intensity', async () => {
  const r = calculateHeartRate(30, 60, 70)
  assert(r.max === 190, `max = ${r.max}`)
  // target = (190-60)*0.7 + 60 = 91 + 60 = 151
  assert(approx(r.target, 151))
})
await test('Water intake 70kg no exercise', async () => {
  assert(calculateWaterIntake(70, 0) === 70 * 35, '70*35 = 2450')
})
await test('Water intake 70kg 60 min exercise', async () => {
  assert(calculateWaterIntake(70, 60) === 70 * 35 + 2 * 500, '2450 + 1000 = 3450')
})
await test('Macros 2000 cal default split', async () => {
  const m = calculateMacros(2000)
  // 40% carbs / 4 = 200g, 30% protein / 4 = 150g, 30% fat / 9 = 67g
  assert(m.carbs === 200)
  assert(m.protein === 150)
  assert(m.fat === 67, `fat = ${m.fat}`)
})
await test('Pregnancy due date', async () => {
  // Use UTC to avoid local-timezone off-by-one
  const lmp = new Date(Date.UTC(2024, 0, 1))
  const r = calculateDueDate(lmp)
  // 280 days after 2024-01-01 UTC = 2024-10-07 UTC
  // (Because 2024 is a leap year, 280 days = Oct 7)
  const yyyy = r.dueDate.getUTCFullYear()
  const mm = String(r.dueDate.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(r.dueDate.getUTCDate()).padStart(2, '0')
  assert(eqStr(`${yyyy}-${mm}-${dd}`, '2024-10-07'), `due = ${yyyy}-${mm}-${dd}`)
})

console.log('\n== Date & Time ==')
await test('Age calculation', async () => {
  const birth = new Date('2000-01-15')
  const asOf = new Date('2026-06-05')
  const r = calculateAge(birth, asOf)
  assert(r.years === 26, `years = ${r.years}`)
  // 4 months 21 days roughly
  assert(r.months >= 4, `months = ${r.months}`)
  assert(r.totalDays > 26 * 365, 'totalDays should be ~26*365')
})
await test('Date difference', async () => {
  const a = new Date('2024-01-01')
  const b = new Date('2024-01-11')
  const r = calculateDateDifference(a, b)
  assert(r.totalDays === 10, `totalDays = ${r.totalDays}`)
})
await test('Add days/weeks/months', async () => {
  const a = new Date('2024-01-01')
  assert(eqStr(addTime(a, 7, 'days').toISOString().slice(0, 10), '2024-01-08'))
  assert(eqStr(addTime(a, 1, 'weeks').toISOString().slice(0, 10), '2024-01-08'))
  assert(eqStr(addTime(a, 1, 'months').toISOString().slice(0, 10), '2024-02-01'))
  assert(eqStr(addTime(a, 1, 'years').toISOString().slice(0, 10), '2025-01-01'))
})

console.log('\n== Unit conversions: length ==')
await test('1 km = 1000 m', async () => {
  assert(approx(convertUnits(1, 'km', 'm', 'length'), 1000))
})
await test('1 mile = 1.609344 km', async () => {
  assert(approx(convertUnits(1, 'mi', 'km', 'length'), 1.609344))
})
await test('1 ft = 0.3048 m', async () => {
  assert(approx(convertUnits(1, 'ft', 'm', 'length'), 0.3048))
})
await test('12 in = 1 ft', async () => {
  assert(approx(convertUnits(12, 'in', 'ft', 'length'), 1))
})
await test('1 nautical mile = 1852 m', async () => {
  assert(approx(convertUnits(1, 'nmi', 'm', 'length'), 1852))
})

console.log('\n== Unit conversions: weight ==')
await test('1 kg = 1000 g', async () => {
  assert(approx(convertUnits(1, 'kg', 'g', 'weight'), 1000))
})
await test('1 lb = 453.592 g', async () => {
  assert(approx(convertUnits(1, 'lb', 'g', 'weight'), 453.592))
})
await test('1 stone = 14 lb', async () => {
  assert(approx(convertUnits(1, 'st', 'lb', 'weight'), 14))
})

console.log('\n== Unit conversions: speed ==')
await test('100 km/h ≈ 27.7778 m/s', async () => {
  assert(approx(convertUnits(100, 'km/h', 'm/s', 'speed'), 27.7778, 0.001))
})
await test('60 mph ≈ 26.8224 m/s', async () => {
  assert(approx(convertUnits(60, 'mph', 'm/s', 'speed'), 26.8224, 0.001))
})

console.log('\n== Unit conversions: time ==')
await test('1 hour = 3600 s', async () => {
  assert(approx(convertUnits(1, 'h', 's', 'time'), 3600))
})
await test('1 day = 1440 min', async () => {
  assert(approx(convertUnits(1, 'd', 'min', 'time'), 1440))
})
await test('1 year = 365 days', async () => {
  assert(approx(convertUnits(1, 'yr', 'd', 'time'), 365))
})

console.log('\n== Unit conversions: temperature ==')
await test('0°C = 32°F', async () => {
  assert(approx(convertTemperature(0, 'C', 'F'), 32))
})
await test('100°C = 212°F', async () => {
  assert(approx(convertTemperature(100, 'C', 'F'), 212))
})
await test('-40°C = -40°F', async () => {
  assert(approx(convertTemperature(-40, 'C', 'F'), -40))
})
await test('0°C = 273.15 K', async () => {
  assert(approx(convertTemperature(0, 'C', 'K'), 273.15))
})
await test('100°F = 37.7778°C', async () => {
  assert(approx(convertTemperature(100, 'F', 'C'), 37.7778, 0.001))
})

console.log('\n== Unit conversions: area / volume ==')
await test('1 acre = 4046.86 m²', async () => {
  assert(approx(convertUnits(1, 'ac', 'm²', 'area'), 4046.86, 0.01))
})
await test('1 hectare = 10000 m²', async () => {
  assert(approx(convertUnits(1, 'ha', 'm²', 'area'), 10000))
})
await test('1 gallon = 3.78541 L', async () => {
  assert(approx(convertUnits(1, 'gal', 'L', 'volume'), 3.78541, 0.001))
})
await test('1 cup = 236.588 mL', async () => {
  assert(approx(convertUnits(1, 'cup', 'mL', 'volume'), 236.588, 0.01))
})

console.log('\n== Unit conversions: data ==')
await test('1 KB = 1024 B', async () => {
  assert(convertUnits(1, 'KB', 'B', 'data') === 1024)
})
await test('1 MB = 1024 KB', async () => {
  assert(convertUnits(1, 'MB', 'KB', 'data') === 1024)
})
await test('1 GB = 1024 MB', async () => {
  assert(convertUnits(1, 'GB', 'MB', 'data') === 1024)
})
await test('1 TB = 1024 GB', async () => {
  assert(convertUnits(1, 'TB', 'GB', 'data') === 1024)
})

console.log('\n== Unit conversions: energy / pressure ==')
await test('1 kcal = 4184 J', async () => {
  assert(approx(convertUnits(1, 'kcal', 'J', 'energy'), 4184))
})
await test('1 atm = 101325 Pa', async () => {
  assert(approx(convertUnits(1, 'atm', 'Pa', 'pressure'), 101325))
})
await test('1 bar = 100000 Pa', async () => {
  assert(approx(convertUnits(1, 'bar', 'Pa', 'pressure'), 100000))
})

console.log('\n== Cooking conversion ==')
await test('1 cup flour ≈ 125 g', async () => {
  const g = convertCooking(1, 'cup', 'g', 'flour')
  // 236.588 ml * 0.59 g/ml = 139.6 g
  assert(approx(g, 139.6, 1))
})
await test('1 tbsp water = 15 g', async () => {
  assert(approx(convertCooking(1, 'tbsp', 'g', 'water'), 14.79, 0.1))
})

console.log('\n== Currency (rate-based) ==')
await test('100 USD at 0.92 = 92 EUR', async () => {
  assert(approx(convertCurrency(100, 0.92), 92))
})

console.log('\n== Statistics ==')
await test('mean', async () => {
  assert(approx(mean([1, 2, 3, 4, 5]), 3))
  assert(approx(mean([10, 20, 30]), 20))
})
await test('median', async () => {
  assert(approx(median([1, 2, 3, 4, 5]), 3))
  assert(approx(median([1, 2, 3, 4]), 2.5))
  assert(approx(median([5]), 5))
})
await test('mode', async () => {
  assert(eqStr(mode([1, 2, 2, 3, 4]).join(','), '2'))
  assert(eqStr(mode([1, 1, 2, 2, 3]).join(','), '1,2'))
})
await test('stddev (sample)', async () => {
  // [2, 4, 4, 4, 5, 5, 7, 9] -> stddev ≈ 2.138
  assert(approx(stddev([2, 4, 4, 4, 5, 5, 7, 9]), 2.138, 0.01))
})
await test('variance', async () => {
  assert(approx(variance([2, 4, 4, 4, 5, 5, 7, 9]), 4.571, 0.01))
})
await test('sum', async () => {
  assert(approx(sum([1, 2, 3, 4, 5]), 15))
})
await test('range', async () => {
  assert(approx(range_([1, 5, 3, 9, 2]), 8))
})

console.log('\n== Formatting ==')
await test('formatNumber', async () => {
  assert(formatNumber(0) === '0')
  assert(formatNumber(123) === '123')
  assert(formatNumber(123.456) === '123.456')
  assert(formatNumber(0.0000001).includes('e')) // scientific
})
await test('formatCurrency', async () => {
  assert(formatCurrency(1234.56) === '$1,234.56')
  assert(formatCurrency(-500) === '-$500.00')
})
await test('formatPercent', async () => {
  assert(formatPercent(0.25) === '25.00%')
  assert(formatPercent(0.1234, 1) === '12.3%')
})

console.log('\n== BigNumber precision for finance ==')
await test('EMI with high precision', async () => {
  const r = await calculateEMI(100000, 7.5, 180)
  // 100k @ 7.5% for 15 years (180 months): ~927.01
  assert(approx(r.emi, 927.01, 0.05), `EMI = ${r.emi}`)
  assert(approx(r.totalPayment, 166862, 5), `total = ${r.totalPayment}`)
  assert(approx(r.totalInterest, 66862, 5), `interest = ${r.totalInterest}`)
})

console.log(`\n${passed} passed, ${failed} failed out of ${passed + failed} tests`)
process.exit(failed > 0 ? 1 : 0)
