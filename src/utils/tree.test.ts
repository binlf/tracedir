import { test, expect } from "bun:test";
import { buildTree, Tree } from "./tree";
import path from "path";

const itemPaths = [
  "src/index.ts",
  "src/utils/tree.ts",
  "src/utils/tree.test.ts",
  "docs/readme.md",
];

test("Tree builds a correct tree and initializes the nodeMap correctly", () => {});
test("`insertChildAt` method inserts a node correctly while properly adding the entry to `nodeMap`", () => {});
test("`Tree` properly handles the recursive option", () => {});
