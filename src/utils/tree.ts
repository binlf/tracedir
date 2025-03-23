import { isDirectory, isFile } from "./fs-utils";
import path from "path";

const CURR_DIR = process.cwd();

type FSTreeNodeFile = {
  key: string;
  name: string;
  type: "file";
  parent?: string | null;
};

type FSTreeNodeDirectory = {
  key: string;
  name: string;
  type: "directory";
  childNodes: Array<FSTreeNode>;
  parent?: string | null;
};

type FSTreeNode = FSTreeNodeFile | FSTreeNodeDirectory;

export type FSTree = FSTreeNodeDirectory;

export class Tree {
  tree: FSTree | null = null;
  nodeMap: Map<string, FSTreeNode> = new Map();

  constructor(rootNode: FSTree) {
    this.tree = rootNode;
    this.nodeMap.set("root", this.tree);
  }

  // this approach could also be applied to setting the `childNodes` of a node,
  // we shouldn't require the consumer to pass in the `childNodes` property, we can handle that internally
  // such that, during insertion, every node is without the `childNodes` property until an insertion is to happen on that node
  // this can also help us strip down probably unnecessary metadata like `type`
  // but then again, we want to be able to handle potential errors that come up when insertion of a node is attempted on a "file" node type
  // this could be covered by a test

  /**
   * Inserts a new child node into the parent node identified by the given key.
   *
   * Validates that the tree is initialized, the parent node exists, and that the parent node is of type "directory".
   *
   * @param parentNodeKey - The key of the parent node where the child node will be inserted.
   * @param childNode - The child node to insert.
   * @returns The updated tree.
   * @throws Error if the tree is uninitialized, the parent node is not found, or if the parent node is not a directory.
   */
  insertChildAt(parentNodeKey: string, childNode: FSTreeNode): FSTree {
    if (!this.tree) {
      throw new Error("Tree is not initialized.");
    }
    const parentNode = this.nodeMap.get(parentNodeKey);
    if (!parentNode) {
      throw new Error(
        `Parent node with key '${parentNodeKey}' does not exist.`
      );
    }
    if (parentNode.type !== "directory") {
      throw new Error(
        `Cannot insert a child into a non-directory node with key '${parentNodeKey}'.`
      );
    }
    parentNode.childNodes.push(childNode);
    this.nodeMap.set(childNode.key, childNode);
    return this.tree;
  }

  /**
   * Generates a unique node key using the provided node name. It's a concatenation of the parent name and the current node's name
   *
   * similar to path.join() internally
   * @example Tree.getNodeKey("root", "src") // "root__src", "src__index.tsx"
   *
   * @param name - The name of the node for which the key will be generated.
   * @returns A string that concatenates the prefix "nk-" with the given node name.
   */
  static getNodeKey(parent: string, name: string) {
    return `${parent}_${name}`;
  }

  // path: src/app/routes/not-found.tsx
  /**
   * node: {
   *  key: "routes_not-found",
   * name: "not-found.tsx",
   * parent: "routes",
   * type: "file"
   * }
   */
  static createNodeFromPath(nodePath: string): FSTreeNode {
    const parent = path.dirname(nodePath);
    const name = path.basename(nodePath);
    const key = this.getNodeKey(parent, name);

    if (isDirectory(nodePath)) {
      return {
        key,
        name,
        type: "directory",
        parent,
        childNodes: [],
      };
    }

    if (isFile(nodePath)) {
      return {
        key,
        name,
        type: "file",
        parent,
      };
    }

    throw new Error(`Invalid node type for path: ${nodePath}`);
  }
}

export const buildTree = (itemPaths: Array<string>) => {
  // const tree = new Tree({
  //   key: "root",
  //   name: path.basename(CURR_DIR),
  //   type: "directory",
  // });

  // console.log("Tree: ", tree);

  // itemPaths.forEach((itemPath) =>
  //   console.log(tree.insertChildAt("root", Tree.createNodeFromPath(itemPath)))
  // );

  // return tree;
  // tree.insertNodeAt("root", {
  //   key: tree.getNodeKey("root", "src"),
  //   name: "src",
  //   type: "directory",
  // });
  // tree.insertNodeAt(
  //   "root",
  //   tree.createNodeFromPath("src/app/routes/not-found.tsx")
  // );
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
    key: "root",
    name: "src",
    type: "directory",
    childNodes: [
      {
        key: "root__dir_app",
        name: "app",
        type: "directory",
        parent: "src",
        childNodes: [
          {
            key: "app__dir_routes",
            name: "routes",
            type: "directory",
            parent: "app",
            childNodes: [
              {
                key: "app__file_not-found",
                name: "not-found.tsx",
                type: "file",
                parent: "routes",
              },
            ],
          },
          {
            key: "app__file_router",
            name: "router.tsx",
            type: "file",
            parent: "app",
          },
          {
            key: "app__file_index",
            name: "index.tsx",
            type: "file",
            parent: "app",
          },
          {
            key: "app__dir_public",
            name: "public",
            type: "directory",
            parent: "app",
            childNodes: [
              {
                key: "public__dir_images",
                name: "images",
                type: "directory",
                parent: "public",
                childNodes: [
                  {
                    key: "images__file_boku",
                    name: "boku.png",
                    type: "file",
                    parent: "images",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        key: "root__dir_assets",
        name: "assets",
        type: "directory",
        parent: "src",
        childNodes: [],
      },
    ],
  };

  // tree.insertNodeAt("public__dir_images", {
  //   key: "images__file_gang",
  //   name: "gang.png",
  //   type: "file",
  //   parent: "images",
  // });

  // createNodeAtPath = (nodeKey) => tre.childNodes.find((node) => node.name === nodeKey)
  // tree.insertAt(nodeKey, node)
  // itemPaths.forEach((itemPath) => {});
  // return tree;
};
