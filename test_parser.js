const { evaluateFormula } = require('./lib/formula-parser.js');

const variables = {
  x: 5,
  y: 10,
  value_1: 20
};

console.log("x + y:", evaluateFormula("x + y", variables));
console.log("value_1 * 2:", evaluateFormula("value_1 * 2", variables));
console.log("pow(x, 2):", evaluateFormula("pow(x, 2)", variables));
console.log("sqrt(value_1 + 5):", evaluateFormula("sqrt(value_1 + 5)", variables));
