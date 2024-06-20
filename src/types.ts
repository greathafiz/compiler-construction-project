// src/types.ts

export interface Substitutable {
  applySubstitution(subst: { [key: string]: Type }): Type;
}

export type Type = IntType | BoolType | VarType | FunType | TupleType;

export class IntType implements Substitutable {
  toString() {
    return "Int";
  }

  applySubstitution(_subst: { [key: string]: Type }): Type {
    return this;
  }
}

export class BoolType implements Substitutable {
  toString() {
    return "Bool";
  }

  applySubstitution(_subst: { [key: string]: Type }): Type {
    return this;
  }
}

export class VarType implements Substitutable {
  constructor(public name: string) {}

  toString() {
    return this.name;
  }

  applySubstitution(_subst: { [key: string]: Type }): Type {
    return this;
  }
}

export class FunType implements Substitutable {
  constructor(public paramType: Type, public returnType: Type) {}

  toString() {
    return `(${this.paramType} -> ${this.returnType})`;
  }

  applySubstitution(subst: { [key: string]: Type }): Type {
    return new FunType(
      this.paramType.applySubstitution(subst),
      this.paramType.applySubstitution(subst)
    );
  }
}

export class TupleType implements Substitutable {
  constructor(public elementTypes: Type[]) {}

  toString() {
    return `(${this.elementTypes.join(", ")})`;
  }

  applySubstitution(subst: { [key: string]: Type }): Type {
    return new TupleType(
      this.elementTypes.map((t) => t.applySubstitution(subst))
    );
  }
}
