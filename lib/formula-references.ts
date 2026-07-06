/**
 * Per-calculator formula references and educational content.
 * Used by CalculatorSEOContent to render calculator-specific
 * formula boxes, step-by-step guidelines, and worked examples.
 */

export interface FormulaRef {
  formula: string        // The mathematical formula (LaTeX-like notation)
  variables: { symbol: string; name: string; unit?: string }[]
  example: { inputs: Record<string, string>; result: string }
  steps: { title: string; body: string }[]
  description: string    // Educational paragraph about the formula
}

// ─── Helper to keep entries concise ───
const f = (
  formula: string,
  description: string,
  variables: { symbol: string; name: string; unit?: string }[],
  steps: { title: string; body: string }[],
  example: { inputs: Record<string, string>; result: string }
): FormulaRef => ({ formula, description, variables, steps, example })

// ═══════════════════════════════════════════════════════════════════════
// MATH
// ═══════════════════════════════════════════════════════════════════════
const mathFormulas: Record<string, FormulaRef> = {
  'percentage': f(
    'Percentage = (Part / Whole) × 100',
    'A percentage expresses a number as a fraction of 100. To find what percentage a part is of a whole, divide the part by the whole and multiply by 100. To find a percentage of a number, multiply the number by the percentage divided by 100.',
    [{ symbol: 'Part', name: 'The portion of the whole' }, { symbol: 'Whole', name: 'The total amount' }],
    [
      { title: 'Identify the part and whole', body: 'Determine which value is the part (subset) and which is the whole (total).' },
      { title: 'Divide part by whole', body: 'Divide the part by the whole to get a decimal ratio.' },
      { title: 'Multiply by 100', body: 'Multiply the decimal by 100 to convert to a percentage.' },
    ],
    { inputs: { Part: '25', Whole: '200' }, result: '12.5%' }
  ),
  'quadratic': f(
    'x = (−b ± √(b² − 4ac)) / 2a',
    'The quadratic formula solves any equation of the form ax² + bx + c = 0. The discriminant (b² − 4ac) determines the nature of the roots: positive means two real roots, zero means one repeated root, and negative means two complex roots.',
    [{ symbol: 'a', name: 'Coefficient of x²' }, { symbol: 'b', name: 'Coefficient of x' }, { symbol: 'c', name: 'Constant term' }],
    [
      { title: 'Identify coefficients', body: 'Write the equation in standard form ax² + bx + c = 0 and identify a, b, and c.' },
      { title: 'Calculate the discriminant', body: 'Compute Δ = b² − 4ac to determine the number and type of roots.' },
      { title: 'Apply the formula', body: 'Substitute into x = (−b ± √Δ) / 2a to find both roots.' },
    ],
    { inputs: { a: '1', b: '-5', c: '6' }, result: 'x = 3 or x = 2' }
  ),
  'pythagorean': f(
    'c² = a² + b²',
    'The Pythagorean theorem states that in a right triangle, the square of the hypotenuse equals the sum of the squares of the other two sides. This fundamental relationship is used throughout geometry, trigonometry, and physics.',
    [{ symbol: 'a', name: 'First leg', unit: 'units' }, { symbol: 'b', name: 'Second leg', unit: 'units' }, { symbol: 'c', name: 'Hypotenuse', unit: 'units' }],
    [
      { title: 'Identify the known sides', body: 'Determine which two sides of the right triangle are known.' },
      { title: 'Square the known sides', body: 'Square each of the two known side lengths.' },
      { title: 'Add or subtract', body: 'If finding the hypotenuse, add the squares. If finding a leg, subtract the known leg\'s square from the hypotenuse\'s square.' },
      { title: 'Take the square root', body: 'Take the square root of the result to find the missing side.' },
    ],
    { inputs: { a: '3', b: '4' }, result: 'c = 5' }
  ),
  'factorial': f(
    'n! = n × (n−1) × (n−2) × ... × 1',
    'The factorial of a non-negative integer n is the product of all positive integers less than or equal to n. By convention, 0! = 1. Factorials are used in combinatorics, probability, and series expansions.',
    [{ symbol: 'n', name: 'Non-negative integer' }],
    [
      { title: 'Start with n', body: 'Begin with the number n itself.' },
      { title: 'Multiply descending integers', body: 'Multiply n by (n−1), then (n−2), and so on down to 1.' },
      { title: 'Special case', body: 'If n = 0, the result is 1 by definition.' },
    ],
    { inputs: { n: '5' }, result: '120' }
  ),
  'derivative': f(
    "f'(x) = lim[h→0] (f(x+h) − f(x)) / h",
    'The derivative measures the instantaneous rate of change of a function at a point. Numerically, it is approximated using the central difference formula: f\'(x) ≈ (f(x+h) − f(x−h)) / (2h) for small h.',
    [{ symbol: 'f(x)', name: 'Function to differentiate' }, { symbol: 'x', name: 'Point of evaluation' }, { symbol: 'h', name: 'Step size (small)' }],
    [
      { title: 'Choose a step size', body: 'Select a small value for h (e.g., 0.001) for the numerical approximation.' },
      { title: 'Evaluate the function', body: 'Compute f(x+h) and f(x−h) at the points around x.' },
      { title: 'Apply central difference', body: 'Calculate (f(x+h) − f(x−h)) / (2h) to approximate the derivative.' },
    ],
    { inputs: { 'f(x)': 'x²', x: '3', h: '0.001' }, result: "f'(3) ≈ 6.000" }
  ),
  'integral': f(
    '∫ₐᵇ f(x)dx ≈ (h/2)[f(x₀) + 2f(x₁) + ... + f(xₙ)]',
    'The definite integral computes the area under a curve between two bounds. The trapezoidal rule approximates this by dividing the area into trapezoids and summing their areas.',
    [{ symbol: 'a', name: 'Lower bound' }, { symbol: 'b', name: 'Upper bound' }, { symbol: 'n', name: 'Number of intervals' }],
    [
      { title: 'Divide the interval', body: 'Split [a, b] into n equal subintervals of width h = (b−a)/n.' },
      { title: 'Evaluate the function', body: 'Compute f(x) at each point x₀, x₁, ..., xₙ.' },
      { title: 'Apply trapezoidal rule', body: 'Sum: (h/2) × [f(x₀) + 2f(x₁) + ... + 2f(xₙ₋₁) + f(xₙ)].' },
    ],
    { inputs: { 'f(x)': 'x²', a: '0', b: '1', n: '10' }, result: '≈ 0.3335' }
  ),
}

// ═══════════════════════════════════════════════════════════════════════
// FINANCE
// ═══════════════════════════════════════════════════════════════════════
const financeFormulas: Record<string, FormulaRef> = {
  'compound-interest': f(
    'A = P(1 + r/n)^(nt)',
    'Compound interest calculates interest on both the initial principal and the accumulated interest from previous periods. The frequency of compounding (n) significantly affects the final amount — more frequent compounding yields higher returns.',
    [{ symbol: 'P', name: 'Principal amount', unit: '$' }, { symbol: 'r', name: 'Annual interest rate', unit: '%' }, { symbol: 'n', name: 'Compounding frequency per year' }, { symbol: 't', name: 'Time in years', unit: 'yr' }],
    [
      { title: 'Gather your values', body: 'Identify the principal (P), annual rate (r as decimal), compounding frequency (n), and time (t).' },
      { title: 'Calculate the rate per period', body: 'Divide r by n to get the rate per compounding period.' },
      { title: 'Compute the growth factor', body: 'Calculate (1 + r/n) raised to the power of (n × t).' },
      { title: 'Multiply by principal', body: 'Multiply the growth factor by P to get the final amount A.' },
    ],
    { inputs: { P: '10000', r: '5%', n: '12', t: '10' }, result: 'A = $16,470.09' }
  ),
  'simple-interest': f(
    'I = P × r × t',
    'Simple interest is calculated only on the principal amount. Unlike compound interest, it does not earn interest on previously accumulated interest. It is commonly used for short-term loans and some bonds.',
    [{ symbol: 'P', name: 'Principal', unit: '$' }, { symbol: 'r', name: 'Annual rate', unit: '%' }, { symbol: 't', name: 'Time', unit: 'yr' }],
    [
      { title: 'Convert rate to decimal', body: 'Divide the annual interest rate by 100 to get the decimal form.' },
      { title: 'Multiply the three values', body: 'Calculate I = P × r × t using the decimal rate.' },
      { title: 'Add principal for total', body: 'The total amount to repay is P + I.' },
    ],
    { inputs: { P: '5000', r: '6%', t: '3' }, result: 'I = $900, Total = $5,900' }
  ),
  'loan-emi': f(
    'EMI = P × r × (1+r)^n / ((1+r)^n − 1)',
    'Equated Monthly Installment (EMI) is the fixed monthly payment a borrower makes to repay a loan. The formula accounts for both principal and interest, amortized evenly over the loan term.',
    [{ symbol: 'P', name: 'Loan principal', unit: '$' }, { symbol: 'r', name: 'Monthly rate (annual/12)', unit: '%' }, { symbol: 'n', name: 'Number of monthly payments' }],
    [
      { title: 'Convert annual rate to monthly', body: 'Divide the annual rate by 12 and convert to a decimal.' },
      { title: 'Determine the number of payments', body: 'Multiply the loan term in years by 12.' },
      { title: 'Apply the EMI formula', body: 'Substitute into EMI = P × r × (1+r)^n / ((1+r)^n − 1).' },
    ],
    { inputs: { P: '300000', r: '0.417%', n: '360' }, result: 'EMI = $1,610.46/mo' }
  ),
  'mortgage': f(
    'M = P × [r(1+r)^n] / [(1+r)^n − 1]',
    'A mortgage is a loan used to purchase real estate. The monthly payment includes both principal repayment and interest. The amortization schedule shows how each payment splits between principal and interest over time.',
    [{ symbol: 'P', name: 'Loan amount', unit: '$' }, { symbol: 'r', name: 'Monthly interest rate', unit: '%' }, { symbol: 'n', name: 'Total number of payments' }],
    [
      { title: 'Calculate monthly rate', body: 'Divide the annual interest rate by 12 to get the monthly rate as a decimal.' },
      { title: 'Determine total payments', body: 'Multiply the loan term in years by 12 months.' },
      { title: 'Apply the formula', body: 'Substitute values into M = P × [r(1+r)^n] / [(1+r)^n − 1].' },
      { title: 'Calculate total interest', body: 'Total interest = (M × n) − P.' },
    ],
    { inputs: { P: '400000', r: '0.417%', n: '360' }, result: 'M = $2,147.29/mo' }
  ),
  'roi': f(
    'ROI = ((Final Value − Initial Value) / Initial Value) × 100',
    'Return on Investment (ROI) measures the profitability of an investment as a percentage. It compares the net gain or loss relative to the initial cost. ROI does not account for the time period — for that, use annualized ROI or CAGR.',
    [{ symbol: 'Initial Value', name: 'Cost of investment', unit: '$' }, { symbol: 'Final Value', name: 'Current/sale value', unit: '$' }],
    [
      { title: 'Calculate the gain or loss', body: 'Subtract the initial value from the final value.' },
      { title: 'Divide by initial value', body: 'Divide the gain/loss by the initial investment cost.' },
      { title: 'Convert to percentage', body: 'Multiply by 100 to express ROI as a percentage.' },
    ],
    { inputs: { 'Initial Value': '10000', 'Final Value': '15000' }, result: 'ROI = 50%' }
  ),
  'cagr': f(
    'CAGR = (FV / PV)^(1/n) − 1',
    'Compound Annual Growth Rate (CAGR) measures the mean annual growth rate of an investment over a specified time period, assuming reinvestment. It smooths out volatility and provides a single growth rate.',
    [{ symbol: 'FV', name: 'Final value', unit: '$' }, { symbol: 'PV', name: 'Initial value', unit: '$' }, { symbol: 'n', name: 'Number of years', unit: 'yr' }],
    [
      { title: 'Calculate the ratio', body: 'Divide the final value (FV) by the initial value (PV).' },
      { title: 'Take the nth root', body: 'Raise the ratio to the power of 1/n where n is the number of years.' },
      { title: 'Subtract 1', body: 'Subtract 1 from the result and multiply by 100 to get the percentage.' },
    ],
    { inputs: { PV: '10000', FV: '25000', n: '5' }, result: 'CAGR = 20.11%' }
  ),
}

// ═══════════════════════════════════════════════════════════════════════
// HEALTH
// ═══════════════════════════════════════════════════════════════════════
const healthFormulas: Record<string, FormulaRef> = {
  'bmi': f(
    'BMI = weight(kg) / height(m)²',
    'Body Mass Index (BMI) is a screening tool that uses height and weight to categorize individuals as underweight, normal, overweight, or obese. While widely used, BMI does not directly measure body fat and may not be accurate for athletes or the elderly.',
    [{ symbol: 'weight', name: 'Body weight', unit: 'kg' }, { symbol: 'height', name: 'Height', unit: 'm' }],
    [
      { title: 'Measure height and weight', body: 'Record your height in meters and weight in kilograms. If using imperial units, convert first.' },
      { title: 'Square the height', body: 'Multiply your height in meters by itself to get height².' },
      { title: 'Divide weight by height²', body: 'Divide your weight in kg by the squared height to get your BMI.' },
      { title: 'Interpret the result', body: 'Below 18.5 = underweight, 18.5–24.9 = normal, 25–29.9 = overweight, 30+ = obese.' },
    ],
    { inputs: { weight: '70', height: '1.75' }, result: 'BMI = 22.86 (Normal)' }
  ),
  'bmr': f(
    'BMR = 10×weight(kg) + 6.25×height(cm) − 5×age + gender_offset',
    'Basal Metabolic Rate (BMR) is the number of calories your body needs to maintain basic physiological functions at rest. The Mifflin-St Jeor equation is the most accurate formula for estimating BMR in the general population.',
    [{ symbol: 'weight', name: 'Weight', unit: 'kg' }, { symbol: 'height', name: 'Height', unit: 'cm' }, { symbol: 'age', name: 'Age', unit: 'yr' }, { symbol: 'gender_offset', name: '+5 for men, −161 for women' }],
    [
      { title: 'Gather measurements', body: 'Record your weight in kg, height in cm, age in years, and biological sex.' },
      { title: 'Apply the formula', body: 'Compute 10×weight + 6.25×height − 5×age, then add +5 for men or −161 for women.' },
      { title: 'Interpret the result', body: 'The result is the calories your body burns at complete rest.' },
    ],
    { inputs: { weight: '70', height: '175', age: '30', gender: 'male' }, result: 'BMR = 1,640.5 kcal/day' }
  ),
  'tdee': f(
    'TDEE = BMR × Activity Factor',
    'Total Daily Energy Expenditure (TDEE) estimates the total calories you burn per day, including physical activity. It is calculated by multiplying your BMR by an activity factor that ranges from 1.2 (sedentary) to 1.9 (very active).',
    [{ symbol: 'BMR', name: 'Basal Metabolic Rate', unit: 'kcal' }, { symbol: 'Activity Factor', name: '1.2–1.9 based on activity level' }],
    [
      { title: 'Calculate your BMR', body: 'Use the Mifflin-St Jeor equation to find your Basal Metabolic Rate.' },
      { title: 'Choose your activity level', body: 'Sedentary=1.2, Light=1.375, Moderate=1.55, Active=1.725, Very Active=1.9.' },
      { title: 'Multiply', body: 'Multiply BMR by the activity factor to get your TDEE.' },
    ],
    { inputs: { BMR: '1640', Activity: 'Moderate (1.55)' }, result: 'TDEE = 2,542 kcal/day' }
  ),
  'body-fat': f(
    'Body Fat % = 86.010×log₁₀(waist−neck) − 70.041×log₁₀(height) + 36.76 (men)',
    'The US Navy Body Fat formula estimates body fat percentage using circumference measurements. It is a practical alternative to DEXA scans, though less precise. Different formulas apply to men and women.',
    [{ symbol: 'waist', name: 'Waist circumference', unit: 'cm' }, { symbol: 'neck', name: 'Neck circumference', unit: 'cm' }, { symbol: 'height', name: 'Height', unit: 'cm' }],
    [
      { title: 'Take measurements', body: 'Measure waist (at navel), neck (below larynx), and height in cm. Measure in the morning before eating.' },
      { title: 'Apply the formula', body: 'Use the appropriate gender-specific US Navy formula with log₁₀.' },
      { title: 'Interpret', body: 'Healthy range: men 10–20%, women 18–28%.' },
    ],
    { inputs: { waist: '85', neck: '38', height: '175' }, result: 'Body Fat ≈ 15.2%' }
  ),
}

// ═══════════════════════════════════════════════════════════════════════
// PHYSICS
// ═══════════════════════════════════════════════════════════════════════
const physicsFormulas: Record<string, FormulaRef> = {
  'newton-force': f(
    'F = m × a',
    "Newton's Second Law of Motion states that the acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. The unit of force is the Newton (N), where 1 N = 1 kg·m/s².",
    [{ symbol: 'm', name: 'Mass', unit: 'kg' }, { symbol: 'a', name: 'Acceleration', unit: 'm/s²' }, { symbol: 'F', name: 'Force', unit: 'N' }],
    [
      { title: 'Identify the mass', body: 'Determine the mass of the object in kilograms (kg).' },
      { title: 'Determine acceleration', body: 'Find the acceleration in meters per second squared (m/s²).' },
      { title: 'Multiply', body: 'Force = mass × acceleration. The result is in Newtons (N).' },
    ],
    { inputs: { m: '10', a: '2' }, result: 'F = 20 N' }
  ),
  'kinetic-energy': f(
    'KE = ½ × m × v²',
    'Kinetic energy is the energy possessed by an object due to its motion. It depends on both the mass and the square of the velocity — doubling the speed quadruples the kinetic energy. The unit is the Joule (J).',
    [{ symbol: 'm', name: 'Mass', unit: 'kg' }, { symbol: 'v', name: 'Velocity', unit: 'm/s' }],
    [
      { title: 'Record mass and velocity', body: 'Identify the mass in kg and velocity in m/s.' },
      { title: 'Square the velocity', body: 'Calculate v² by multiplying the velocity by itself.' },
      { title: 'Apply the formula', body: 'KE = 0.5 × m × v². The result is in Joules (J).' },
    ],
    { inputs: { m: '5', v: '10' }, result: 'KE = 250 J' }
  ),
  'potential-energy': f(
    'PE = m × g × h',
    'Gravitational potential energy is the energy stored in an object due to its height above a reference point. It depends on mass, gravitational acceleration (g ≈ 9.81 m/s² on Earth), and height.',
    [{ symbol: 'm', name: 'Mass', unit: 'kg' }, { symbol: 'g', name: 'Gravitational acceleration', unit: '9.81 m/s²' }, { symbol: 'h', name: 'Height', unit: 'm' }],
    [
      { title: 'Identify the mass', body: 'Record the mass of the object in kilograms.' },
      { title: 'Determine the height', body: 'Measure the height above the reference point in meters.' },
      { title: 'Multiply all three', body: 'PE = m × 9.81 × h. The result is in Joules (J).' },
    ],
    { inputs: { m: '2', h: '10' }, result: 'PE = 196.2 J' }
  ),
  'velocity': f(
    'v = d / t',
    'Velocity is the rate of change of position. It is a vector quantity, meaning it has both magnitude (speed) and direction. In its simplest form, average velocity equals distance divided by time.',
    [{ symbol: 'd', name: 'Distance', unit: 'm' }, { symbol: 't', name: 'Time', unit: 's' }],
    [
      { title: 'Measure the distance', body: 'Record the total distance traveled in meters.' },
      { title: 'Record the time', body: 'Note the time taken to travel that distance in seconds.' },
      { title: 'Divide', body: 'Velocity = distance / time. The result is in m/s.' },
    ],
    { inputs: { d: '100', t: '10' }, result: 'v = 10 m/s' }
  ),
  'momentum': f(
    'p = m × v',
    'Momentum is the quantity of motion of a moving body, measured as the product of its mass and velocity. It is a vector quantity and is conserved in a closed system (law of conservation of momentum).',
    [{ symbol: 'm', name: 'Mass', unit: 'kg' }, { symbol: 'v', name: 'Velocity', unit: 'm/s' }],
    [
      { title: 'Identify mass and velocity', body: 'Record the mass in kg and velocity in m/s.' },
      { title: 'Multiply', body: 'Momentum = mass × velocity. The unit is kg·m/s.' },
    ],
    { inputs: { m: '10', v: '5' }, result: 'p = 50 kg·m/s' }
  ),
}

// ═══════════════════════════════════════════════════════════════════════
// CHEMISTRY
// ═══════════════════════════════════════════════════════════════════════
const chemistryFormulas: Record<string, FormulaRef> = {
  'ph': f(
    'pH = −log₁₀[H⁺]',
    'The pH scale measures the acidity or alkalinity of a solution. It is the negative logarithm (base 10) of the hydrogen ion concentration. A pH of 7 is neutral, below 7 is acidic, and above 7 is basic.',
    [{ symbol: '[H⁺]', name: 'Hydrogen ion concentration', unit: 'mol/L' }],
    [
      { title: 'Determine H⁺ concentration', body: 'Find the molar concentration of hydrogen ions in the solution.' },
      { title: 'Take the negative log', body: 'Calculate −log₁₀ of the H⁺ concentration.' },
      { title: 'Interpret the result', body: 'pH < 7 = acidic, pH = 7 = neutral, pH > 7 = basic.' },
    ],
    { inputs: { '[H⁺]': '0.001' }, result: 'pH = 3.0 (acidic)' }
  ),
  'molar-mass': f(
    'M = m / n',
    'Molar mass is the mass of one mole of a substance, expressed in g/mol. It is calculated by dividing the mass of the sample by the number of moles. One mole contains 6.022 × 10²³ particles (Avogadro\'s number).',
    [{ symbol: 'm', name: 'Mass of sample', unit: 'g' }, { symbol: 'n', name: 'Amount in moles', unit: 'mol' }],
    [
      { title: 'Measure the mass', body: 'Weigh the sample in grams.' },
      { title: 'Determine moles', body: 'Calculate the number of moles from the known molar mass or reaction stoichiometry.' },
      { title: 'Divide', body: 'Molar mass = mass / moles. The unit is g/mol.' },
    ],
    { inputs: { m: '58.44', n: '1' }, result: 'M = 58.44 g/mol (NaCl)' }
  ),
  'moles': f(
    'n = m / M',
    'The mole is the SI unit for amount of substance. To convert between grams and moles, divide the mass by the molar mass. This is fundamental for stoichiometric calculations in chemistry.',
    [{ symbol: 'm', name: 'Mass', unit: 'g' }, { symbol: 'M', name: 'Molar mass', unit: 'g/mol' }],
    [
      { title: 'Record the mass', body: 'Weigh the substance in grams.' },
      { title: 'Look up molar mass', body: 'Find the molar mass from the periodic table or reference.' },
      { title: 'Divide', body: 'Moles = mass / molar mass.' },
    ],
    { inputs: { m: '36', M: '18' }, result: 'n = 2.0 mol (water)' }
  ),
}

// ═══════════════════════════════════════════════════════════════════════
// CONSTRUCTION
// ═══════════════════════════════════════════════════════════════════════
const constructionFormulas: Record<string, FormulaRef> = {
  'concrete': f(
    'Volume = Length × Width × Thickness',
    'Concrete volume is calculated by multiplying the length, width, and thickness of the slab or footing. The result is typically in cubic meters or cubic yards, which is then converted to bags of concrete needed.',
    [{ symbol: 'L', name: 'Length', unit: 'm' }, { symbol: 'W', name: 'Width', unit: 'm' }, { symbol: 'T', name: 'Thickness', unit: 'm' }],
    [
      { title: 'Measure the dimensions', body: 'Record the length, width, and thickness of the area to be filled with concrete.' },
      { title: 'Calculate volume', body: 'Multiply L × W × T to get the volume in cubic meters.' },
      { title: 'Convert to bags', body: 'Divide the volume by the yield per bag (typically 0.015 m³ for a 40kg bag).' },
    ],
    { inputs: { L: '5', W: '3', T: '0.1' }, result: 'Volume = 1.5 m³, ~100 bags' }
  ),
  'paint': f(
    'Paint (gallons) = Wall Area / Coverage per gallon',
    'Paint quantity is calculated by dividing the total wall area by the coverage rate of the paint. Most paints cover 350–400 sq ft per gallon per coat. Always add 10% for waste and touch-ups.',
    [{ symbol: 'Area', name: 'Total wall area', unit: 'sq ft' }, { symbol: 'Coverage', name: 'Paint coverage', unit: 'sq ft/gal' }],
    [
      { title: 'Calculate wall area', body: 'Multiply wall height by wall length, subtract openings (doors/windows).' },
      { title: 'Determine coverage', body: 'Check the paint can for coverage per gallon (typically 350–400 sq ft).' },
      { title: 'Divide and add waste', body: 'Divide area by coverage, then add 10% for waste and second coat.' },
    ],
    { inputs: { Area: '800', Coverage: '400' }, result: '2.2 gallons (with 10% waste)' }
  ),
}

// ═══════════════════════════════════════════════════════════════════════
// ASTRONOMY
// ═══════════════════════════════════════════════════════════════════════
const astronomyFormulas: Record<string, FormulaRef> = {
  'escape-velocity': f(
    'v = √(2GM/r)',
    'Escape velocity is the minimum speed needed for an object to escape from the gravitational influence of a massive body without further propulsion. It depends on the body\'s mass (M) and radius (r), and the gravitational constant G.',
    [{ symbol: 'G', name: 'Gravitational constant', unit: '6.674×10⁻¹¹ N·m²/kg²' }, { symbol: 'M', name: 'Body mass', unit: 'kg' }, { symbol: 'r', name: 'Distance from center', unit: 'm' }],
    [
      { title: 'Identify the body', body: 'Determine the mass M and radius r of the planet or star.' },
      { title: 'Calculate 2GM', body: 'Multiply 2 × G × M where G = 6.674×10⁻¹¹.' },
      { title: 'Divide by r', body: 'Divide the result by the radius r in meters.' },
      { title: 'Take the square root', body: 'The square root gives the escape velocity in m/s.' },
    ],
    { inputs: { M: '5.972e24', r: '6.371e6' }, result: 'v ≈ 11,186 m/s (Earth)' }
  ),
  'light-year': f(
    '1 ly = 9.461 × 10¹² km',
    'A light-year is the distance that light travels in one year in a vacuum. Since light moves at 299,792 km/s, one light-year equals approximately 9.461 trillion kilometers or 63,241 astronomical units.',
    [{ symbol: 'c', name: 'Speed of light', unit: '299,792 km/s' }, { symbol: 't', name: 'One year', unit: '31,536,000 s' }],
    [
      { title: 'Understand the unit', body: 'One light-year = speed of light × seconds in one year.' },
      { title: 'Convert to kilometers', body: 'Multiply light-years by 9.461 × 10¹² to get kilometers.' },
      { title: 'Convert to parsecs', body: 'Divide light-years by 3.262 to get parsecs.' },
    ],
    { inputs: { 'Light Years': '4.24' }, result: '4.00 × 10¹³ km (Proxima Centauri)' }
  ),
  'stellar-luminosity': f(
    'L = 4πR²σT⁴',
    'The Stefan-Boltzmann law calculates the total energy radiated per unit area of a black body. For a star, multiplying by the surface area (4πR²) gives the total luminosity. Temperature has a fourth-power effect — doubling temperature increases luminosity 16×.',
    [{ symbol: 'R', name: 'Star radius', unit: 'm' }, { symbol: 'σ', name: 'Stefan-Boltzmann constant', unit: '5.67×10⁻⁸ W/m²K⁴' }, { symbol: 'T', name: 'Surface temperature', unit: 'K' }],
    [
      { title: 'Determine the star\'s radius', body: 'Find the radius in solar radii and convert to meters (1 R☉ = 6.96×10⁸ m).' },
      { title: 'Find surface temperature', body: 'Record the effective temperature in Kelvin.' },
      { title: 'Apply the formula', body: 'L = 4π × R² × σ × T⁴. Compare to solar luminosity (3.828×10²⁶ W).' },
    ],
    { inputs: { R: '1 R☉', T: '5778 K' }, result: 'L = 1 L☉ (Sun)' }
  ),
  'hubble-law': f(
    'v = H₀ × d',
    "Hubble's Law describes the expansion of the universe: galaxies are moving away from us at a velocity proportional to their distance. H₀ (Hubble constant) ≈ 70 km/s/Mpc. This was the first observational evidence of cosmic expansion.",
    [{ symbol: 'H₀', name: 'Hubble constant', unit: '~70 km/s/Mpc' }, { symbol: 'd', name: 'Distance', unit: 'Mpc' }],
    [
      { title: 'Determine the distance', body: 'Find the distance to the galaxy in megaparsecs (Mpc).' },
      { title: 'Multiply by Hubble constant', body: 'Velocity = 70 × distance. The result is in km/s.' },
    ],
    { inputs: { d: '100 Mpc' }, result: 'v = 7,000 km/s' }
  ),
}

// ═══════════════════════════════════════════════════════════════════════
// ENVIRONMENT
// ═══════════════════════════════════════════════════════════════════════
const environmentFormulas: Record<string, FormulaRef> = {
  'carbon-footprint': f(
    'CO₂ = Electricity×0.4×12 + Gas×2.3×12 + Miles×0.4',
    'Your carbon footprint is the total greenhouse gas emissions caused by your activities. Electricity usage, natural gas consumption, and driving are the three largest contributors for most households.',
    [{ symbol: 'Electricity', name: 'Monthly kWh', unit: 'kWh' }, { symbol: 'Gas', name: 'Monthly therms', unit: 'therms' }, { symbol: 'Miles', name: 'Annual miles driven', unit: 'mi' }],
    [
      { title: 'Gather your usage data', body: 'Find your monthly electricity (kWh), gas (therms), and annual driving miles.' },
      { title: 'Calculate electricity emissions', body: 'Multiply kWh by 0.4 kg CO₂/kWh, then by 12 months.' },
      { title: 'Calculate gas emissions', body: 'Multiply therms by 2.3 kg CO₂/therm, then by 12 months.' },
      { title: 'Calculate driving emissions', body: 'Multiply miles by 0.4 kg CO₂/mile.' },
      { title: 'Sum all sources', body: 'Add all three to get your annual CO₂ emissions in kg.' },
    ],
    { inputs: { Electricity: '300', Gas: '50', Miles: '12000' }, result: '~5,520 kg CO₂/yr' }
  ),
  'solar-panel': f(
    'P = Area × Efficiency × Irradiance × Sun Hours',
    'Solar panel output depends on the panel area, efficiency rating (typically 15-22%), solar irradiance (~1000 W/m² at peak), and the number of peak sun hours per day at your location.',
    [{ symbol: 'Area', name: 'Panel area', unit: 'm²' }, { symbol: 'Efficiency', name: 'Panel efficiency', unit: '%' }, { symbol: 'Sun Hours', name: 'Peak sun hours/day', unit: 'h' }],
    [
      { title: 'Determine panel area', body: 'Calculate total panel surface area in square meters.' },
      { title: 'Find efficiency', body: 'Check your panel specifications (typically 15-22%).' },
      { title: 'Calculate daily output', body: 'Daily Wh = Area × (Efficiency/100) × 1000 × Sun Hours.' },
      { title: 'Convert to kWh', body: 'Divide by 1000 to get daily kWh output.' },
    ],
    { inputs: { Area: '20', Efficiency: '18%', 'Sun Hours': '5' }, result: '~18 kWh/day' }
  ),
}

// ═══════════════════════════════════════════════════════════════════════
// AUTOMOTIVE
// ═══════════════════════════════════════════════════════════════════════
const automotiveFormulas: Record<string, FormulaRef> = {
  'fuel-cost-trip': f(
    'Cost = (Distance / MPG) × Gas Price',
    'Trip fuel cost is calculated by dividing the trip distance by your vehicle\'s fuel efficiency (MPG) to get gallons needed, then multiplying by the current gas price per gallon.',
    [{ symbol: 'Distance', name: 'Trip distance', unit: 'mi' }, { symbol: 'MPG', name: 'Fuel efficiency', unit: 'mi/gal' }, { symbol: 'Gas Price', name: 'Price per gallon', unit: '$/gal' }],
    [
      { title: 'Determine trip distance', body: 'Find the total distance of your trip in miles.' },
      { title: 'Know your MPG', body: 'Check your vehicle\'s average miles per gallon.' },
      { title: 'Calculate gallons needed', body: 'Gallons = Distance / MPG.' },
      { title: 'Multiply by gas price', body: 'Cost = Gallons × Price per gallon.' },
    ],
    { inputs: { Distance: '500', MPG: '25', 'Gas Price': '$3.50' }, result: '$70.00' }
  ),
  'brake-distance': f(
    'd = v² / (2μg)',
    'Braking distance is the distance a vehicle travels from the moment brakes are applied until it stops. It depends on speed (squared), road friction coefficient, and gravity. Doubling speed quadruples braking distance.',
    [{ symbol: 'v', name: 'Initial speed', unit: 'm/s' }, { symbol: 'μ', name: 'Friction coefficient', unit: '0.7 dry, 0.4 wet' }, { symbol: 'g', name: 'Gravity', unit: '9.81 m/s²' }],
    [
      { title: 'Convert speed to m/s', body: 'Multiply mph by 0.447 to get meters per second.' },
      { title: 'Determine friction', body: 'Use 0.7 for dry roads, 0.4 for wet roads.' },
      { title: 'Apply the formula', body: 'd = v² / (2 × μ × 9.81). The result is in meters.' },
    ],
    { inputs: { v: '60 mph', μ: '0.7' }, result: '~33 m (108 ft)' }
  ),
  'engine-displacement': f(
    'V = (π/4) × B² × S × C',
    'Engine displacement is the total volume swept by all pistons in an engine. It is calculated from the bore (cylinder diameter), stroke (piston travel distance), and number of cylinders.',
    [{ symbol: 'B', name: 'Bore diameter', unit: 'mm' }, { symbol: 'S', name: 'Stroke length', unit: 'mm' }, { symbol: 'C', name: 'Number of cylinders' }],
    [
      { title: 'Record bore and stroke', body: 'Find the bore diameter and stroke length in millimeters.' },
      { title: 'Calculate single cylinder volume', body: 'V₁ = (π/4) × B² × S. This gives volume in mm³.' },
      { title: 'Multiply by cylinders', body: 'Total V = V₁ × C. Convert mm³ to cc by dividing by 1000.' },
    ],
    { inputs: { B: '86', S: '86', C: '4' }, result: '~1998 cc (2.0L)' }
  ),
}

// ═══════════════════════════════════════════════════════════════════════
// SPORTS
// ═══════════════════════════════════════════════════════════════════════
const sportsFormulas: Record<string, FormulaRef> = {
  'calorie-burn': f(
    'kcal = MET × weight(kg) × time(hours)',
    'Calories burned during exercise are calculated using MET (Metabolic Equivalent of Task) values. One MET equals the energy expended at rest. Higher intensity activities have higher MET values (running ≈ 8-12, walking ≈ 3-4).',
    [{ symbol: 'MET', name: 'Metabolic equivalent', unit: '1-15+' }, { symbol: 'weight', name: 'Body weight', unit: 'kg' }, { symbol: 'time', name: 'Duration', unit: 'hours' }],
    [
      { title: 'Find the MET value', body: 'Look up the MET for your activity (e.g., running 8 mph = 11.5).' },
      { title: 'Convert time to hours', body: 'Divide minutes by 60 to get hours.' },
      { title: 'Multiply all three', body: 'kcal = MET × weight × hours.' },
    ],
    { inputs: { MET: '8', weight: '70', time: '0.5h' }, result: '280 kcal' }
  ),
  'vo2-max': f(
    'VO₂max = (22.351 × distance_m) / time_min − 11.288',
    "The Cooper test estimates VO₂ max (maximal oxygen uptake) from a 12-minute run. VO₂ max is the gold standard measure of cardiovascular fitness, indicating how efficiently your body uses oxygen during intense exercise.",
    [{ symbol: 'distance', name: 'Distance run in 12 min', unit: 'm' }, { symbol: 'time', name: 'Time elapsed', unit: 'min' }],
    [
      { title: 'Run for 12 minutes', body: 'Run as far as possible in exactly 12 minutes on a flat track.' },
      { title: 'Record distance', body: 'Measure the total distance covered in meters.' },
      { title: 'Apply the formula', body: 'VO₂max = (22.351 × distance) / 12 − 11.288.' },
      { title: 'Interpret', body: 'Excellent: >50, Good: 40-50, Average: 30-40, Poor: <30 ml/kg/min.' },
    ],
    { inputs: { distance: '2400', time: '12' }, result: 'VO₂max ≈ 33.4 ml/kg/min' }
  ),
  'max-heart-rate': f(
    'MHR = 220 − Age',
    'Maximum Heart Rate (MHR) is the highest number of beats your heart can pump per minute. The classic formula (220 − age) is simple but has a standard error of ±10 bpm. Training zones are percentages of MHR.',
    [{ symbol: 'Age', name: 'Your age', unit: 'years' }],
    [
      { title: 'Calculate MHR', body: 'Subtract your age from 220 to get your estimated maximum heart rate.' },
      { title: 'Determine training zones', body: 'Zone 1: 50-60%, Zone 2: 60-70%, Zone 3: 70-80%, Zone 4: 80-90%, Zone 5: 90-100%.' },
      { title: 'Use during exercise', body: 'Monitor your heart rate to stay in the desired training zone.' },
    ],
    { inputs: { Age: '30' }, result: 'MHR = 190 bpm' }
  ),
}

// ═══════════════════════════════════════════════════════════════════════
// COOKING
// ═══════════════════════════════════════════════════════════════════════
const cookingFormulas: Record<string, FormulaRef> = {
  'recipe-scaler': f(
    'New Amount = Original × (Desired Servings / Original Servings)',
    'Recipe scaling adjusts ingredient quantities proportionally when changing the number of servings. The scaling factor is the ratio of desired servings to original servings, applied to every ingredient.',
    [{ symbol: 'Original Servings', name: 'Recipe\'s original yield' }, { symbol: 'Desired Servings', name: 'How many you want' }],
    [
      { title: 'Determine the scaling factor', body: 'Divide desired servings by original servings.' },
      { title: 'Multiply each ingredient', body: 'Multiply every ingredient amount by the scaling factor.' },
      { title: 'Adjust cooking time', body: 'Cooking time may need adjustment — larger batches take longer, smaller batches less time.' },
    ],
    { inputs: { 'Original Servings': '4', 'Desired Servings': '6' }, result: 'Scale factor = 1.5×' }
  ),
  'bread-hydration': f(
    'Hydration % = (Water weight / Flour weight) × 100',
    'Bread hydration is the ratio of water to flour by weight, expressed as a percentage. It determines dough consistency: 60-65% is standard, 70-80% is wet (ciabatta), and 80%+ is very wet (focaccia). Higher hydration creates larger, more open crumb.',
    [{ symbol: 'Water', name: 'Water weight', unit: 'g' }, { symbol: 'Flour', name: 'Flour weight', unit: 'g' }],
    [
      { title: 'Weigh your ingredients', body: 'Measure flour and water in grams (always by weight, not volume).' },
      { title: 'Divide water by flour', body: 'Divide the water weight by the flour weight.' },
      { title: 'Convert to percentage', body: 'Multiply by 100 to get the hydration percentage.' },
    ],
    { inputs: { Flour: '500', Water: '350' }, result: '70% hydration (standard-wet)' }
  ),
  'coffee-ratio': f(
    'Coffee (g) = Water (g) / Ratio',
    'Coffee brewing ratio determines the strength of your brew. A ratio of 1:15 is strong, 1:16 is standard, and 1:17 is mild. Always measure by weight (grams) for consistency, not by volume.',
    [{ symbol: 'Water', name: 'Water weight', unit: 'g' }, { symbol: 'Ratio', name: 'Brewing ratio (1:X)' }],
    [
      { title: 'Decide your ratio', body: 'Choose 1:15 for strong, 1:16 for standard, 1:17 for mild coffee.' },
      { title: 'Weigh your water', body: 'Measure the water in grams.' },
      { title: 'Divide by ratio', body: 'Coffee grounds (g) = Water (g) / Ratio number.' },
    ],
    { inputs: { Water: '300', Ratio: '16' }, result: '18.75 g coffee' }
  ),
}

// ═══════════════════════════════════════════════════════════════════════
// ENGINEERING
// ═══════════════════════════════════════════════════════════════════════
const engineeringFormulas: Record<string, FormulaRef> = {
  'ohms-law': f(
    'V = I × R, P = V × I',
    "Ohm's Law describes the relationship between voltage (V), current (I), and resistance (R) in an electrical circuit. Voltage equals current times resistance. Power (P) equals voltage times current, measured in Watts.",
    [{ symbol: 'V', name: 'Voltage', unit: 'V' }, { symbol: 'I', name: 'Current', unit: 'A' }, { symbol: 'R', name: 'Resistance', unit: 'Ω' }],
    [
      { title: 'Identify known values', body: 'Determine which two of V, I, R you know.' },
      { title: 'Solve for the unknown', body: 'V=IR, I=V/R, or R=V/I depending on what you need.' },
      { title: 'Calculate power', body: 'P = V × I (or P = I²R, or P = V²/R).' },
    ],
    { inputs: { V: '12', I: '2' }, result: 'R = 6Ω, P = 24W' }
  ),
  'density': f(
    'ρ = m / V',
    'Density is the mass per unit volume of a substance. It is an intensive property, meaning it does not depend on the amount of material. Water has a density of 1,000 kg/m³; gold is 19,300 kg/m³.',
    [{ symbol: 'm', name: 'Mass', unit: 'kg' }, { symbol: 'V', name: 'Volume', unit: 'm³' }],
    [
      { title: 'Measure the mass', body: 'Weigh the object in kilograms.' },
      { title: 'Determine volume', body: 'Calculate or measure the volume in cubic meters.' },
      { title: 'Divide', body: 'Density = mass / volume. The unit is kg/m³.' },
    ],
    { inputs: { m: '500', V: '0.5' }, result: 'ρ = 1000 kg/m³ (water)' }
  ),
}

// ═══════════════════════════════════════════════════════════════════════
// GEOMETRY
// ═══════════════════════════════════════════════════════════════════════
const geometryFormulas: Record<string, FormulaRef> = {
  'sphere': f(
    'V = (4/3)πr³, A = 4πr²',
    'A sphere is a perfectly round 3D shape where every point on the surface is equidistant from the center. The volume scales with the cube of the radius, while surface area scales with the square.',
    [{ symbol: 'r', name: 'Radius', unit: 'units' }],
    [
      { title: 'Find the radius', body: 'Determine the radius of the sphere (half the diameter).' },
      { title: 'Calculate volume', body: 'V = (4/3) × π × r³.' },
      { title: 'Calculate surface area', body: 'A = 4 × π × r².' },
    ],
    { inputs: { r: '5' }, result: 'V = 523.6, A = 314.2' }
  ),
  'cylinder-geo': f(
    'V = πr²h, A = 2πr(r+h)',
    'A cylinder is a 3D shape with two circular bases connected by a curved surface. Volume depends on the base area and height. Surface area includes both circular bases and the lateral surface.',
    [{ symbol: 'r', name: 'Base radius', unit: 'units' }, { symbol: 'h', name: 'Height', unit: 'units' }],
    [
      { title: 'Measure radius and height', body: 'Record the base radius and the height of the cylinder.' },
      { title: 'Calculate volume', body: 'V = π × r² × h.' },
      { title: 'Calculate surface area', body: 'A = 2πr(r + h) = 2πr² + 2πrh.' },
    ],
    { inputs: { r: '3', h: '10' }, result: 'V = 282.7, A = 244.9' }
  ),
}

// ═══════════════════════════════════════════════════════════════════════
// STATISTICS
// ═══════════════════════════════════════════════════════════════════════
const statisticsFormulas: Record<string, FormulaRef> = {
  'standard-deviation': f(
    'σ = √(Σ(xᵢ − μ)² / N)',
    'Standard deviation measures how spread out data values are from the mean. A low standard deviation means values cluster close to the mean; a high standard deviation means values are spread over a wider range.',
    [{ symbol: 'xᵢ', name: 'Each data value' }, { symbol: 'μ', name: 'Mean of the data' }, { symbol: 'N', name: 'Number of values' }],
    [
      { title: 'Calculate the mean', body: 'Sum all values and divide by the count to get μ.' },
      { title: 'Find deviations', body: 'Subtract the mean from each value: (xᵢ − μ).' },
      { title: 'Square and average', body: 'Square each deviation, sum them, and divide by N (population) or N−1 (sample).' },
      { title: 'Take the square root', body: 'The square root of the variance is the standard deviation.' },
    ],
    { inputs: { Data: '2, 4, 4, 4, 5, 5, 7, 9' }, result: 'σ ≈ 2.14' }
  ),
  'correlation': f(
    'r = Σ((x−x̄)(y−ȳ)) / √(Σ(x−x̄)² × Σ(y−ȳ)²)',
    'The Pearson correlation coefficient (r) measures the linear relationship between two variables. It ranges from -1 (perfect negative) to +1 (perfect positive). A value of 0 means no linear correlation.',
    [{ symbol: 'x, y', name: 'Paired data sets' }, { symbol: 'x̄, ȳ', name: 'Means of x and y' }],
    [
      { title: 'Calculate means', body: 'Find the mean of both x and y datasets.' },
      { title: 'Compute deviations', body: 'For each pair, calculate (x−x̄) and (y−ȳ).' },
      { title: 'Sum the products', body: 'Sum all (x−x̄)(y−ȳ) products for the numerator.' },
      { title: 'Calculate denominator', body: 'Take the square root of Σ(x−x̄)² × Σ(y−ȳ)².' },
      { title: 'Divide', body: 'r = numerator / denominator. Range: -1 to +1.' },
    ],
    { inputs: { x: '1,2,3,4,5', y: '2,4,5,4,5' }, result: 'r ≈ 0.78' }
  ),
}

// ═══════════════════════════════════════════════════════════════════════
// TAX
// ═══════════════════════════════════════════════════════════════════════
const taxFormulas: Record<string, FormulaRef> = {
  'income-tax': f(
    'Tax = Income × Tax Rate',
    'Income tax is calculated by applying the applicable tax rate to your taxable income. In progressive tax systems, different portions of income are taxed at increasing rates (tax brackets).',
    [{ symbol: 'Income', name: 'Taxable income', unit: '$' }, { symbol: 'Rate', name: 'Tax rate', unit: '%' }],
    [
      { title: 'Determine taxable income', body: 'Subtract deductions and exemptions from your gross income.' },
      { title: 'Apply the tax rate', body: 'Multiply taxable income by the applicable rate (or apply bracket calculations).' },
      { title: 'Subtract credits', body: 'Deduct any tax credits from the calculated tax.' },
    ],
    { inputs: { Income: '75000', Rate: '22%' }, result: 'Tax = $16,500' }
  ),
  'vat': f(
    'VAT = Amount × (Rate / 100)',
    'Value Added Tax (VAT) is a consumption tax added to goods and services. To add VAT, multiply the net amount by the rate. To extract VAT from a gross amount, divide by (1 + rate/100).',
    [{ symbol: 'Amount', name: 'Net amount', unit: '$' }, { symbol: 'Rate', name: 'VAT rate', unit: '%' }],
    [
      { title: 'Identify the net amount', body: 'Determine the pre-tax price of the goods or services.' },
      { title: 'Calculate VAT', body: 'VAT = Amount × Rate / 100.' },
      { title: 'Calculate gross', body: 'Total = Amount + VAT.' },
    ],
    { inputs: { Amount: '100', Rate: '20%' }, result: 'VAT = $20, Total = $120' }
  ),
}

// ═══════════════════════════════════════════════════════════════════════
// REAL ESTATE
// ═══════════════════════════════════════════════════════════════════════
const realEstateFormulas: Record<string, FormulaRef> = {
  'cap-rate': f(
    'Cap Rate = (NOI / Property Value) × 100',
    'The capitalization rate (cap rate) measures the rate of return on a real estate investment property. It is the ratio of Net Operating Income (NOI) to the property value, expressed as a percentage.',
    [{ symbol: 'NOI', name: 'Net Operating Income', unit: '$/yr' }, { symbol: 'Value', name: 'Property value', unit: '$' }],
    [
      { title: 'Calculate NOI', body: 'NOI = Gross rental income − operating expenses (excluding mortgage).' },
      { title: 'Determine property value', body: 'Use the current market value or purchase price.' },
      { title: 'Divide and multiply', body: 'Cap Rate = (NOI / Value) × 100. Higher cap rate = higher return but higher risk.' },
    ],
    { inputs: { NOI: '24000', Value: '300000' }, result: 'Cap Rate = 8.0%' }
  ),
  'ltv': f(
    'LTV = (Loan Amount / Property Value) × 100',
    'Loan-to-Value ratio compares the loan amount to the appraised property value. Lenders use LTV to assess risk — a lower LTV means more equity and less risk. Most lenders require LTV ≤ 80% to avoid PMI.',
    [{ symbol: 'Loan', name: 'Loan amount', unit: '$' }, { symbol: 'Value', name: 'Property value', unit: '$' }],
    [
      { title: 'Determine loan amount', body: 'This is the amount you want to borrow.' },
      { title: 'Get property value', body: 'Use the appraised value or purchase price (whichever is lower).' },
      { title: 'Calculate ratio', body: 'LTV = (Loan / Value) × 100. Below 80% is generally preferred.' },
    ],
    { inputs: { Loan: '240000', Value: '300000' }, result: 'LTV = 80%' }
  ),
}

// ═══════════════════════════════════════════════════════════════════════
// Merge all formula references
// ═══════════════════════════════════════════════════════════════════════
export const FORMULA_REFERENCES: Record<string, FormulaRef> = {
  ...mathFormulas,
  ...financeFormulas,
  ...healthFormulas,
  ...physicsFormulas,
  ...chemistryFormulas,
  ...constructionFormulas,
  ...astronomyFormulas,
  ...environmentFormulas,
  ...automotiveFormulas,
  ...sportsFormulas,
  ...cookingFormulas,
  ...engineeringFormulas,
  ...geometryFormulas,
  ...statisticsFormulas,
  ...taxFormulas,
  ...realEstateFormulas,
}

/**
 * Get a formula reference for a calculator by slug.
 * Returns null if no specific formula is registered.
 */
export function getFormulaRef(slug: string): FormulaRef | null {
  return FORMULA_REFERENCES[slug] || null
}