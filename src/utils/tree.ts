import { isDirectory, isFile } from "./fs-utils";
import path from "path";

const CURR_DIR = process.cwd();

type FsItemFile = {
  type: "file";
  name: string;
  comment?: string;
};

type FsItemDirectory = {
  type: "directory";
  name: string;
  items: Array<FsItem>;
  comment?: string;
};

// type FSTreeNode = {
//   type: "directory" | "file";
//   name: string | null;
//   parent?: string | null;
//   childNodes?: Array<FSTreeNode>;
// };

type FSTreeNode = {
  key: string;
  name: string;
  type?: "file" | "directory";
  childNodes?: Array<FSTreeNode>;
  parent?: null | string;
};

type FsItem = FsItemFile | FsItemDirectory;

export type FSTree = FSTreeNode;

class Tree {
  tree: FSTree | null = null;

  constructor(rootNode: FSTree) {
    this.tree = rootNode;
  }

  // this function can handle setting the "edge" -- the parent property of the node
  // this could be safer as it's handled internally reducing the mispelling index

  // this approach could also be applied to setting the `childNodes` of a node,
  // we shouldn't require the consumer to pass in the `childNodes` property, we can handle that internally
  // such that, during insertion, every node is without the `childNodes` property until an insertion is to happen on that node
  // this can also help us strip down probably unnecessary metadata like `type`
  // but then again, we want to be able to handle potential errors that come up when insertion of a node is attempted on a "file" node type
  insertNodeAt(nodeKey: string, node: FSTreeNode): string {
    return Tree.getNodeKey(node.name);
  }

  /**
   * Generates a unique node key using the provided node name. It's a concatenation of the parent name and the current node's name
   *
   * @param name - The name of the node for which the key will be generated.
   * @returns A string that concatenates the prefix "nk-" with the given node name.
   */
  static getNodeKey(name: string) {
    return `nk-${name}`;
  }
}

export const buildTree = (itemPaths: Array<string>): Tree => {
  const tree = new Tree({ key: "root", name: path.basename(CURR_DIR) });
  tree.insertNodeAt("root", {
    key: Tree.getNodeKey("src"),
    name: "src",
    type: "directory",
  });
  // tree.insertNodeAt("file", {
  //   name: "filing.tsx",
  //   type: "file",
  // });
  // const tree: Tree = {
  //   name: CURR_DIR,
  //   type: "directory",
  //   childNodes: [],
  // };

  // createNode -> search for parent key -> append new node into list of `childNodes`
  // src/app/routes/not-found.tsx
  // src/app/router.tsx
  // insert -> src/app/provider.tsx
  const tre = {
    name: "src",
    type: "directory",
    childNodes: [
      {
        name: "app",
        type: "directory",
        parent: "src",
        childNodes: [
          {
            name: "routes",
            type: "directory",
            parent: "app",
            childNodes: [
              {
                name: "not-found.tsx",
                type: "file",
                parent: "routes",
              },
            ],
          },
          {
            name: "router.tsx",
            type: "file",
            parent: "app",
          },
        ],
      },
    ],
  };

  // createNodeAtPath = (nodeKey) => tre.childNodes.find((node) => node.name === nodeKey)
  // tree.insertAt(nodeKey, node)
  itemPaths.forEach((itemPath) => {});
  return tree;
};
