import { type FSTree } from "./tree";
import pc from "picocolors";

type Parent = {
  level: number;
  key: string;
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
  parentMap.set(tree.key, { level: 0, key: tree.key });
  traverseNodes(tree.childNodes);

  function traverseNodes(childNodes: FSTree["childNodes"]) {
    childNodes.forEach((node, index, array) => {
      const isLastNode = index === array.length - 1;
      const { name, type, parent, key } = node;
      if (!parent)
        throw new Error(`Node with key: ${key} doesn't have a parent`);

      const parentNode = parentMap.get(parent);
      if (!parentNode) {
        throw new Error(`Parent node '${parent}' not found in parent map`);
      }

      const tabs = parentNode.level > 0 ? tab.repeat(parentNode.level) : "";

      buffer.push(tabs + itemPrefix + name + (type === "directory" ? "/" : ""));

      if (type === "directory") {
        parentMap.set(key, { level: parentNode.level + 1, key: key });

        if (
          !node.childNodes.length &&
          parentNode.key === tree.key &&
          !isLastNode
        ) {
          buffer.push(tab);
        } else {
          traverseNodes(node.childNodes);
        }
      }

      if (type === "file" && !isLastNode && parentNode.key === tree.key) {
        buffer.push(tab);
      }
    });
  }

  console.log(buffer.join("\n"));
};
