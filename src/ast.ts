// src/ast.ts

export abstract class Expr {}

export class Int extends Expr {
  constructor(public value: number) {
    super();
  }
}

export class Bool extends Expr {
  constructor(public value: boolean) {
    super();
  }
}

export class Var extends Expr {
  constructor(public name: string) {
    super();
  }
}

export class Add extends Expr {
  constructor(public left: Expr, public right: Expr) {
    super();
  }
}

export class Sub extends Expr {
  constructor(public left: Expr, public right: Expr) {
    super();
  }
}

export class Let extends Expr {
  constructor(public varName: string, public value: Expr, public body: Expr) {
    super();
  }
}

export class If extends Expr {
  constructor(public cond: Expr, public thenExpr: Expr, public elseExpr: Expr) {
    super();
  }
}

export class Fun extends Expr {
  constructor(public param: string, public body: Expr) {
    super();
  }
}

export class App extends Expr {
  constructor(public func: Expr, public arg: Expr) {
    super();
  }
}

export class Tuple extends Expr {
  constructor(public elements: Expr[]) {
    super();
  }
}

export class TupleAccess extends Expr {
  constructor(public tuple: Expr, public index: number) {
    super();
  }
}
