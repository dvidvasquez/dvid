import assert from "node:assert/strict";
import test from "node:test";
import { parseTags } from "../parseTags";

test("separa los tags por coma", () => {
  assert.deepEqual(parseTags("nextjs,react,frontend"), ["nextjs", "react", "frontend"]);
});

test("quita los espacios alrededor de cada tag", () => {
  assert.deepEqual(parseTags("Next.js, TypeScript , Prisma"), ["Next.js", "TypeScript", "Prisma"]);
});

test("descarta tags vacios", () => {
  assert.deepEqual(parseTags("react,, ,nextjs,"), ["react", "nextjs"]);
});

test("retorna una lista vacia cuando no hay tags", () => {
  assert.deepEqual(parseTags(""), []);
});
