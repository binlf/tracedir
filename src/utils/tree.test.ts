import { test, expect } from "bun:test";
import { buildTree, Tree } from "./tree";
import path from "path";

const itemPaths = [
  "src/index.ts",
  "src/utils/tree.ts",
  "src/utils/tree.test.ts",
  "docs/readme.md",
];

test("Tree builds a correct tree and initializes the nodeMap correctly", () => {
  const tree = new Tree({
    key: "root",
    name: path.basename(process.cwd()),
    type: "directory",
    childNodes: [],
  });
  expect(tree.nodeMap.get("root")).toContainAllKeys(Object.keys(tree.tree!));
});

test("`insertChildAt` method inserts a node correctly while properly adding the entry to `nodeMap`", () => {
  const tree = new Tree({
    key: "root",
    name: path.basename(process.cwd()),
    type: "directory",
    childNodes: [],
  });
  const modTree = tree.insertChildAt("root", {
    key: "uniqueKey",
    name: "NodeName",
    type: "file",
    childNodes: [],
  });
  const moddedTree = tree.insertChildAt("uniqueKey", {
    key: "unkey",
    name: "UNKEY",
    type: "directory",
  });
  // console.log("Mod Tree: ", modTree);
  // console.log("Node Map: ", tree.nodeMap);
  console.log("Modded Tree: ", moddedTree);
  console.log("Latest Node Map: ", tree.nodeMap);
  // expect(tree.nodeMap.get("root")).toContainAllKeys(Object.keys(tree.tree!));
});

// test("buildTree builds a correct directory tree", () => {
//   const tree = buildTree(itemPaths);
//   console.log("Tree", tree);
//   // expect(tree).toHaveProperty("src");
//   // expect(tree).toHaveProperty("docs");
// });
