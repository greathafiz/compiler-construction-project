import {
  Expr,
  Int,
  Bool,
  Var,
  Add,
  Sub,
  Let,
  If,
  Fun,
  App,
  Tuple,
  TupleAccess,
} from "./ast";

class Parser {
  private tokens: string[];
  private pos: number;

  constructor(input: string) {
    this.tokens = input.split(/\s+/).filter((token) => token.length > 0);
    this.pos = 0;
  }

  private peek(): string {
    return this.tokens[this.pos];
  }

  private consume(): string {
    return this.tokens[this.pos++];
  }

  private expect(token: string): void {
    if (this.consume() !== token) {
      throw new Error(`Expected ${token}`);
    }
  }

  parseExpr(): Expr {
    if (this.peek() === "let") {
      return this.parseLet();
    } else if (this.peek() === "if") {
      return this.parseIf();
    } else if (this.peek() === "fun") {
      return this.parseFun();
    } else {
      return this.parseAddSub();
    }
  }

  private parseLet(): Expr {
    this.expect("let");
    const varName = this.consume();
    this.expect("=");
    const value = this.parseExpr();
    this.expect("in");
    const body = this.parseExpr();
    return new Let(varName, value, body);
  }

  private parseIf(): Expr {
    this.expect("if");
    const cond = this.parseExpr();
    this.expect("then");
    const thenExpr = this.parseExpr();
    this.expect("else");
    const elseExpr = this.parseExpr();
    return new If(cond, thenExpr, elseExpr);
  }

  private parseFun(): Expr {
    this.expect("fun");
    const param = this.consume();
    this.expect("->");
    const body = this.parseExpr();
    return new Fun(param, body);
  }

  private parseAddSub(): Expr {
    let expr = this.parsePrimary();
    while (this.peek() === "+" || this.peek() === "-") {
      const op = this.consume();
      const right = this.parsePrimary();
      expr = op === "+" ? new Add(expr, right) : new Sub(expr, right);
    }
    return expr;
  }

  private parsePrimary(): Expr {
    if (this.peek().match(/^\d+$/)) {
      return new Int(Number(this.consume()));
    } else if (this.peek() === "true" || this.peek() === "false") {
      return new Bool(this.consume() === "true");
    } else if (this.peek().match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
      const varName = this.consume();
      if (this.peek() === ".") {
        this.consume();
        const index = Number(this.consume());
        return new TupleAccess(new Var(varName), index);
      }
      return new Var(varName);
    } else if (this.peek() === "(") {
      this.consume();
      const elements: Expr[] = [];
      while (this.peek() !== ")") {
        elements.push(this.parseExpr());
        if (this.peek() === ",") {
          this.consume();
        }
      }
      this.expect(")");
      return new Tuple(elements);
    } else {
      throw new Error(`Unexpected token: ${this.peek()}`);
    }
  }
}

export function parse(input: string): Expr {
  const parser = new Parser(input);
  return parser.parseExpr();
}
