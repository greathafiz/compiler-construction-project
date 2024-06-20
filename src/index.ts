// src/index.ts

import { Int, Bool, Var, Add, Let, Fun, App, Tuple } from "./ast";
import { TypeInfer, unify, applySubstitution } from "./typeInfer";
import { TypeEnv } from "./typeEnv";

// Example program: let id = fun x -> x in (id 5, id true)
const idFun = new Fun("x", new Var("x"));
const exampleExpr = new Let(
  "id",
  idFun,
  new Tuple([
    new App(new Var("id"), new Int(5)),
    new App(new Var("id"), new Bool(true)),
  ])
);

// Perform type inference
const typeInfer = new TypeInfer();
const env = new TypeEnv();

const [exprType, constraints] = typeInfer.infer(exampleExpr, env);
console.log("Constraints:", constraints);

const substitution = unify(constraints);
// console.log("Substitutions:", substitution);

const finalType = applySubstitution(exprType, substitution);

console.log(`Final type: ${finalType}`);
