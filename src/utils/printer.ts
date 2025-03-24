import { type FSTree } from "./tree";
import pc from "picocolors";

type Parent = {
  level: number;
  name: string;
};

export const printer = (tree: FSTree) => {
  const itemPrefix = `+-- `;
  const pipe = pc.redBright("|");
  const tab = pipe + "   ";
  // yall: yet another lookup lol
  const parentMap = new Map<string, Parent>();

  const buffer = [];

  buffer.push(tree.name);
  buffer.push(tab);
  parentMap.set(tree.name, { level: 0, name: tree.name });
  traverseNodes(tree.childNodes);

  function traverseNodes(childNodes: FSTree["childNodes"]) {
    childNodes.forEach((node, index, array) => {
      const isLastItem = index === array.length - 1;
      const { name, type, parent, key } = node;
      if (!parent)
        throw new Error(`Node with key: ${key} doesn't have a parent`);
      const nodeParent = parentMap.get(parent);
      if (!nodeParent) throw new Error("Something went wrong");
      const tabs =
        nodeParent.level > 0
          ? tab.padEnd(tab.length * nodeParent.level, tab)
          : "";
      buffer.push(tabs + itemPrefix + name + (type === "directory" ? "/" : ""));
      if (type === "directory") {
        parentMap.set(name, { level: nodeParent.level + 1, name });
        if (
          !node.childNodes.length &&
          nodeParent.name === tree.name &&
          !isLastItem
        )
          return buffer.push(tab);
        traverseNodes(node.childNodes);
      }
      if (type === "file" && !isLastItem && nodeParent.name === tree.name)
        buffer.push(tab);
    });
  }

  console.log(buffer.join("\n"));
};
