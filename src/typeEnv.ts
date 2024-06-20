// src/typeEnv.ts

import { Type } from "./types";

export class TypeEnv {
  private env: { [key: string]: Type } = {};

  lookup(varName: string): Type | undefined {
    return this.env[varName];
  }

  extend(varName: string, typ: Type): TypeEnv {
    const newEnv = new TypeEnv();
    newEnv.env = { ...this.env, [varName]: typ };
    return newEnv;
  }
}
