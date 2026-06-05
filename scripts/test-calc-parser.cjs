// Parser sanity test - extracts the logic from ScientificCalculator.tsx
// and runs assertions against expected math results.
const fs = require('fs');
const src = fs.readFileSync('components/calculators/math/ScientificCalculator.tsx', 'utf8');

// Extract the three core functions
const fn1Start = src.indexOf('function tokenize');
const fn1End = src.indexOf('/* Inject');
const fn2Start = src.indexOf('function injectImplicitMultiplication');
const fn2End = src.indexOf('/* Recursive-descent');
const fn3Start = src.indexOf('function evaluate(tokens');
const fn3End = src.indexOf('function formatNumberForDisplay');

let code = src.substring(fn1Start, fn1End) + src.substring(fn2Start, fn2End) + src.substring(fn3Start, fn3End);

// Aggressively strip TS type annotations.
code = code
  // variable declarations like `const t: Token[]` -> `const t` (then leave a stray `= []` we keep)
  .replace(/(const|let|var)\s+(\w+)\s*:\s*[A-Za-z_][\w<>\[\] ,|]*?\s*=\s*/g, '$1 $2 = ')
  // function parameter types: `function name(input: string)` -> `function name(input)`
  .replace(/(function\s+\w+)\s*\(([^)]*)\)\s*:\s*\w+(\[\])?\s*\{/g, function(_m, head, params) { return head + '(' + params + ') {'; })
  // function parameter types: `(...): string {` etc. for inner arrow funcs (handled separately)
  // function parameter types: `input: string` -> `input`
  .replace(/(\w+)\s*:\s*string(?=\s*[,)])/g, '$1')
  .replace(/(\w+)\s*:\s*number(?=\s*[,)])/g, '$1')
  .replace(/(\w+)\s*:\s*boolean(?=\s*[,)])/g, '$1')
  .replace(/(\w+)\s*:\s*Token(?=\s*[,)])/g, '$1')
  .replace(/(\w+)\s*:\s*FnName(?=\s*[,)])/g, '$1')
  .replace(/(\w+)\s*:\s*AngleMode(?=\s*[,)])/g, '$1')
  // parameter arrays
  .replace(/(\w+)\s*:\s*\w+\[\](?=\s*[,)])/g, '$1')
  // function return types: `): Token[]` -> `)`
  .replace(/\)\s*:\s*\w+(\[\])?\s*\{/g, ') {')
  // arrow function param types: `(fn, val): number =>` -> `(fn, val) =>`
  .replace(/\)\s*:\s*\w+(\[\])?\s*=>/g, ') =>')
  // `as FnName` casts
  .replace(/\s+as\s+\w+/g, '');

code = code + '\nreturn { tokenize, evaluate, injectImplicitMultiplication };';

const m = { exports: {} };
new Function('module', 'exports', code)(m, m.exports);
const { tokenize, evaluate } = m.exports;

const tests = [
  ['sqrt(8)', 'DEG', Math.sqrt(8)],
  ['2+3*4', 'DEG', 14],
  ['(2+3)*4', 'DEG', 20],
  ['2pi', 'DEG', 2 * Math.PI],
  ['pi/4', 'DEG', Math.PI / 4],
  ['sin(30)', 'DEG', 0.5],
  ['sin(pi/2)', 'DEG', 1],
  ['2^10', 'DEG', 1024],
  ['fact(5)', 'DEG', 120],
  ['sqrt(2)+sqrt(3)', 'DEG', Math.sqrt(2) + Math.sqrt(3)],
  ['1+2+3+4', 'DEG', 10],
  ['-5+3', 'DEG', -2],
  ['2sin(30)', 'DEG', 1],
  ['(2)(3)', 'DEG', 6],
  ['log(100)', 'DEG', 2],
  ['ln(e)', 'DEG', 1],
  ['sqrt(2)*2', 'DEG', Math.sqrt(2) * 2],
  ['abs(-7)', 'DEG', 7],
  ['inv(4)', 'DEG', 0.25],
  ['cos(0)', 'DEG', 1],
  ['2^3^2', 'DEG', 512],
];
let passed = 0;
for (const [expr, mode, expected] of tests) {
  let got;
  try { got = evaluate(tokenize(expr), mode); } catch (e) { got = 'ERR:' + e.message; }
  const ok = typeof got === 'number' && Math.abs(got - expected) < 1e-9;
  console.log(ok ? 'PASS' : 'FAIL', JSON.stringify(expr), '=', typeof got === 'number' ? got.toFixed(4) : got, '(expected', expected.toFixed(4) + ')');
  if (ok) passed++;
}
console.log('---');
console.log(passed + '/' + tests.length + ' tests passed');
