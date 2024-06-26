// src/index.ts

import { parse } from "./parser";
import { TypeInfer, unify, applySubstitution } from "./typeInfer";
import { TypeEnv } from "./typeEnv";

// Example program
const input = `let add = fun x -> fun y -> x + y in add 3 4`;

// Parse the input to get the AST
const exampleExpr = parse(input);

// Perform type inference
const typeInfer = new TypeInfer();
const env = new TypeEnv();
const [exprType, constraints] = typeInfer.infer(exampleExpr, env);
// console.log("Constraints:", constraints);

const substitution = unify(constraints);
// console.log("Substitutions:", substitution);

const finalType = applySubstitution(exprType, substitution);
console.log(`Final type: ${finalType}`);
