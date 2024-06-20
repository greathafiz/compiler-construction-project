// src/typeInfer.ts

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
} from "./ast";
import { Type, IntType, BoolType, VarType, FunType, TupleType } from "./types";
import { TypeEnv } from "./typeEnv";

type Constraint = [Type, Type];

export class TypeInfer {
  private varCount: number = 0;

  private newVar(): VarType {
    this.varCount += 1;
    return new VarType(`v${this.varCount}`);
  }

  infer(expr: Expr, env: TypeEnv): [Type, Constraint[]] {
    if (expr instanceof Int) {
      return [new IntType(), []];
    } else if (expr instanceof Bool) {
      return [new BoolType(), []];
    } else if (expr instanceof Var) {
      const typ = env.lookup(expr.name);
      if (!typ) {
        throw new Error(`Unbound variable ${expr.name}`);
      }
      return [typ, []];
    } else if (expr instanceof Add || expr instanceof Sub) {
      const [leftType, leftConstraints] = this.infer(expr.left, env);
      const [rightType, rightConstraints] = this.infer(expr.right, env);
      return [
        new IntType(),
        [
          [leftType, new IntType()],
          [rightType, new IntType()],
          ...leftConstraints,
          ...rightConstraints,
        ],
      ];
    } else if (expr instanceof Let) {
      const [valueType, valueConstraints] = this.infer(expr.value, env);
      const newEnv = env.extend(expr.varName, valueType);
      const [bodyType, bodyConstraints] = this.infer(expr.body, newEnv);
      return [bodyType, [...valueConstraints, ...bodyConstraints]];
    } else if (expr instanceof If) {
      const [condType, condConstraints] = this.infer(expr.cond, env);
      const [thenType, thenConstraints] = this.infer(expr.thenExpr, env);
      const [elseType, elseConstraints] = this.infer(expr.elseExpr, env);
      return [
        thenType,
        [
          [condType, new BoolType()],
          [thenType, elseType],
          ...condConstraints,
          ...thenConstraints,
          ...elseConstraints,
        ],
      ];
    } else if (expr instanceof Fun) {
      const paramType = this.newVar();
      const newEnv = env.extend(expr.param, paramType);
      const [bodyType, bodyConstraints] = this.infer(expr.body, newEnv);
      return [new FunType(paramType, bodyType), bodyConstraints];
    } else if (expr instanceof App) {
      const [funcType, funcConstraints] = this.infer(expr.func, env);
      const [argType, argConstraints] = this.infer(expr.arg, env);
      const returnType = this.newVar();
      return [
        returnType,
        [
          [funcType, new FunType(argType, returnType)],
          ...funcConstraints,
          ...argConstraints,
        ],
      ];
    } else if (expr instanceof Tuple) {
      const elementTypesConstraints = expr.elements.map((e) =>
        this.infer(e, env)
      );
      const elementTypes = elementTypesConstraints.map(([t, _]) => t);
      const constraints = elementTypesConstraints.flatMap(([_, cs]) => cs);
      return [new TupleType(elementTypes), constraints];
    } else {
      throw new Error("Unknown expression type");
    }
  }
}

export function unify(constraints: Constraint[]): { [key: string]: Type } {
  const subst: { [key: string]: Type } = {};
  while (constraints.length > 0) {
    const [a, b] = constraints.shift()!;
    if (a === b) {
      continue;
    } else if (a instanceof VarType) {
      subst[a.name] = b;
      constraints = constraints.map(([x, y]) => [
        applySubstitution(x, subst),
        applySubstitution(y, subst),
      ]);
    } else if (b instanceof VarType) {
      subst[b.name] = a;
      constraints = constraints.map(([x, y]) => [
        applySubstitution(x, subst),
        applySubstitution(y, subst),
      ]);
    } else if (a instanceof FunType && b instanceof FunType) {
      constraints.push(
        [a.paramType, b.paramType],
        [a.returnType, b.returnType]
      );
    } else if (a instanceof TupleType && b instanceof TupleType) {
      if (a.elementTypes.length !== b.elementTypes.length) {
        throw new Error("Tuple lengths do not match");
      }
      constraints.push(
        ...a.elementTypes.map((t, i) => [t, b.elementTypes[i]] as [Type, Type])
      );
    } else {
      throw new Error(`Cannot unify ${a} with ${b}`);
    }
  }
  return subst;
}

export function applySubstitution(
  typ: Type,
  subst: { [key: string]: Type }
): Type {
  //   if (typ instanceof VarType) {
  //     return subst[typ.name] || typ;
  //   } else if (typ instanceof FunType) {
  //     return new FunType(
  //       applySubstitution(typ.paramType, subst),
  //       applySubstitution(typ.returnType, subst)
  //     );
  //   } else if (typ instanceof TupleType) {
  //     return new TupleType(
  //       typ.elementTypes.map((t) => applySubstitution(t, subst))
  //     );
  //   } else {
  return typ.applySubstitution(subst);
  //   }
}
