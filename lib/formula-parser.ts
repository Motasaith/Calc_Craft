/**
 * Safe mathematical expression parser and evaluator.
 * Tokenizes, parses, and evaluates arithmetic formulas containing variables and standard math functions.
 * Does NOT use eval() to ensure security and prevent arbitrary code execution.
 */

type TokenType = 'NUMBER' | 'IDENTIFIER' | 'PLUS' | 'MINUS' | 'MULTIPLY' | 'DIVIDE' | 'MODULO' | 'POWER' | 'LPAREN' | 'RPAREN' | 'COMMA' | 'EOF';

interface Token {
  type: TokenType;
  value: string;
}

class Lexer {
  private input: string;
  private pos: number = 0;

  constructor(input: string) {
    this.input = input;
  }

  private peek(): string {
    return this.pos < this.input.length ? this.input[this.pos] : '';
  }

  private next(): string {
    return this.pos < this.input.length ? this.input[this.pos++] : '';
  }

  public tokenize(): Token[] {
    const tokens: Token[] = [];

    while (this.pos < this.input.length) {
      const char = this.peek();

      if (/\s/.test(char)) {
        this.next(); // Skip whitespace
        continue;
      }

      if (/[0-9.]/.test(char)) {
        let value = '';
        let dotCount = 0;
        while (/[0-9.]/.test(this.peek())) {
          const c = this.peek();
          if (c === '.') {
            dotCount++;
            if (dotCount > 1) break; // Invalid float, stop reading digits
          }
          value += this.next();
        }
        tokens.push({ type: 'NUMBER', value });
        continue;
      }

      if (/[a-zA-Z_]/.test(char)) {
        let value = '';
        while (/[a-zA-Z0-9_]/.test(this.peek())) {
          value += this.next();
        }
        tokens.push({ type: 'IDENTIFIER', value });
        continue;
      }

      this.next(); // Consume operator/parenthesis
      switch (char) {
        case '+': tokens.push({ type: 'PLUS', value: '+' }); break;
        case '-': tokens.push({ type: 'MINUS', value: '-' }); break;
        case '*': tokens.push({ type: 'MULTIPLY', value: '*' }); break;
        case '/': tokens.push({ type: 'DIVIDE', value: '/' }); break;
        case '%': tokens.push({ type: 'MODULO', value: '%' }); break;
        case '^': tokens.push({ type: 'POWER', value: '^' }); break;
        case '(': tokens.push({ type: 'LPAREN', value: '(' }); break;
        case ')': tokens.push({ type: 'RPAREN', value: ')' }); break;
        case ',': tokens.push({ type: 'COMMA', value: ',' }); break;
        default:
          // Ignore invalid characters or treat as syntax error in parser
          break;
      }
    }

    tokens.push({ type: 'EOF', value: '' });
    return tokens;
  }
}

class Parser {
  private tokens: Token[];
  private currentIdx: number = 0;
  private variables: Record<string, number>;

  constructor(tokens: Token[], variables: Record<string, number>) {
    this.tokens = tokens;
    this.variables = {
      pi: Math.PI,
      PI: Math.PI,
      e: Math.E,
      E: Math.E,
      ...variables,
    };
  }

  private peek(): Token {
    return this.tokens[this.currentIdx];
  }

  private next(): Token {
    return this.tokens[this.currentIdx++];
  }

  private consume(type: TokenType): Token {
    const token = this.peek();
    if (token.type !== type) {
      throw new Error(`Expected token ${type}, but got ${token.type} ('${token.value}')`);
    }
    return this.next();
  }

  public parse(): number {
    const result = this.parseExpression();
    if (this.peek().type !== 'EOF') {
      throw new Error(`Unexpected extra tokens at end of formula: '${this.peek().value}'`);
    }
    return result;
  }

  // Expression: Term ((PLUS | MINUS) Term)*
  private parseExpression(): number {
    let result = this.parseTerm();

    while (this.peek().type === 'PLUS' || this.peek().type === 'MINUS') {
      const op = this.next();
      const term = this.parseTerm();
      if (op.type === 'PLUS') {
        result += term;
      } else {
        result -= term;
      }
    }

    return result;
  }

  // Term: Power ((MULTIPLY | DIVIDE | MODULO) Power)*
  private parseTerm(): number {
    let result = this.parsePower();

    while (
      this.peek().type === 'MULTIPLY' ||
      this.peek().type === 'DIVIDE' ||
      this.peek().type === 'MODULO'
    ) {
      const op = this.next();
      const nextPower = this.parsePower();
      if (op.type === 'MULTIPLY') {
        result *= nextPower;
      } else if (op.type === 'DIVIDE') {
        if (nextPower === 0) {
          // Gracefully return 0 or Infinity instead of throwing crash
          result = 0;
        } else {
          result /= nextPower;
        }
      } else {
        result = nextPower === 0 ? 0 : result % nextPower;
      }
    }

    return result;
  }

  // Power: Factor (POWER Power)? (Right-associative exponentiation)
  private parsePower(): number {
    let result = this.parseFactor();

    if (this.peek().type === 'POWER') {
      this.next(); // consume '^'
      const exponent = this.parsePower();
      result = Math.pow(result, exponent);
    }

    return result;
  }

  // Factor: UnaryMinus | UnaryPlus | Number | FunctionCall | Variable | Parentheses
  private parseFactor(): number {
    const token = this.peek();

    if (token.type === 'MINUS') {
      this.next();
      return -this.parseFactor();
    }

    if (token.type === 'PLUS') {
      this.next();
      return this.parseFactor();
    }

    if (token.type === 'NUMBER') {
      this.next();
      return parseFloat(token.value);
    }

    if (token.type === 'IDENTIFIER') {
      const name = token.value;
      this.next();

      // Check if it's a function call
      if (this.peek().type === 'LPAREN') {
        this.consume('LPAREN');
        const args: number[] = [];

        if (this.peek().type !== 'RPAREN') {
          args.push(this.parseExpression());
          while (this.peek().type === 'COMMA') {
            this.consume('COMMA');
            args.push(this.parseExpression());
          }
        }
        this.consume('RPAREN');

        return this.evaluateFunction(name, args);
      }

      // Otherwise it's a variable
      if (name in this.variables) {
        return this.variables[name];
      }

      // If variable value is missing or empty, return 0 instead of crashing
      return 0;
    }

    if (token.type === 'LPAREN') {
      this.consume('LPAREN');
      const result = this.parseExpression();
      this.consume('RPAREN');
      return result;
    }

    throw new Error(`Unexpected token inside factor: '${token.value}'`);
  }

  private evaluateFunction(name: string, args: number[]): number {
    const n = name.toLowerCase();

    switch (n) {
      case 'pow':
        if (args.length !== 2) throw new Error(`pow() expects exactly 2 arguments, got ${args.length}`);
        return Math.pow(args[0], args[1]);
      case 'sqrt':
        if (args.length !== 1) throw new Error(`sqrt() expects exactly 1 argument, got ${args.length}`);
        return Math.sqrt(args[0]);
      case 'abs':
        if (args.length !== 1) throw new Error(`abs() expects exactly 1 argument, got ${args.length}`);
        return Math.abs(args[0]);
      case 'round':
        if (args.length !== 1) throw new Error(`round() expects exactly 1 argument, got ${args.length}`);
        return Math.round(args[0]);
      case 'ceil':
        if (args.length !== 1) throw new Error(`ceil() expects exactly 1 argument, got ${args.length}`);
        return Math.ceil(args[0]);
      case 'floor':
        if (args.length !== 1) throw new Error(`floor() expects exactly 1 argument, got ${args.length}`);
        return Math.floor(args[0]);
      case 'sin':
        if (args.length !== 1) throw new Error(`sin() expects exactly 1 argument, got ${args.length}`);
        return Math.sin(args[0]);
      case 'cos':
        if (args.length !== 1) throw new Error(`cos() expects exactly 1 argument, got ${args.length}`);
        return Math.cos(args[0]);
      case 'tan':
        if (args.length !== 1) throw new Error(`tan() expects exactly 1 argument, got ${args.length}`);
        return Math.tan(args[0]);
      case 'log': // Natural log (ln)
        if (args.length !== 1) throw new Error(`log() expects exactly 1 argument, got ${args.length}`);
        return args[0] <= 0 ? 0 : Math.log(args[0]);
      case 'log10':
        if (args.length !== 1) throw new Error(`log10() expects exactly 1 argument, got ${args.length}`);
        return args[0] <= 0 ? 0 : Math.log10(args[0]);
      case 'ln':
        if (args.length !== 1) throw new Error(`ln() expects exactly 1 argument, got ${args.length}`);
        return args[0] <= 0 ? 0 : Math.log(args[0]);
      default:
        throw new Error(`Unknown mathematical function: ${name}`);
    }
  }
}

/**
 * Parses and evaluates a math formula with input variables.
 * Returns the numeric result. Returns 0 if there's any syntax or validation error.
 */
export function evaluateFormula(formula: string, variables: Record<string, number>): number {
  if (!formula.trim()) return 0;

  try {
    const lexer = new Lexer(formula);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens, variables);
    const result = parser.parse();
    return isNaN(result) || !isFinite(result) ? 0 : result;
  } catch (err) {
    console.warn(`Formula evaluation error for '${formula}':`, err);
    return 0;
  }
}
