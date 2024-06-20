// src/ast.ts

export type Expr = Int | Bool | Var | Add | Sub | Let | If | Fun | App | Tuple;

export class Int {
  constructor(public value: number) {}
}

export class Bool {
  constructor(public value: boolean) {}
}

export class Var {
  constructor(public name: string) {}
}

export class Add {
  constructor(public left: Expr, public right: Expr) {}
}

export class Sub {
  constructor(public left: Expr, public right: Expr) {}
}

export class Let {
  constructor(public varName: string, public value: Expr, public body: Expr) {}
}

export class If {
  constructor(
    public cond: Expr,
    public thenExpr: Expr,
    public elseExpr: Expr
  ) {}
}

export class Fun {
  constructor(public param: string, public body: Expr) {}
}

export class App {
  constructor(public func: Expr, public arg: Expr) {}
}

export class Tuple {
  constructor(public elements: Expr[]) {}
}
