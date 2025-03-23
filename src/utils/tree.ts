import { isDirectory, isFile, dirName } from "./fs-utils";
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
    // console.log("Current Node: ", childNode);
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
        `Cannot insert a child with key '${childNode.key}' into a non-directory node with key '${parentNodeKey}'.`
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
  static getNodeKey(itemPath: string) {
    return dirName(itemPath).replaceAll(path.basename(CURR_DIR), "root");
  }

  static createNodeFromPath(nodePath: string): FSTreeNode {
    const parent = dirName(nodePath);
    if (!parent) throw new Error("Path is incomplete");
    const name = path.basename(nodePath);
    // const key = this.getNodeKey(nodePath);

    if (isDirectory(nodePath)) {
      return {
        key: name,
        name,
        type: "directory",
        parent,
        childNodes: [],
      };
    }

    if (isFile(nodePath)) {
      return {
        key: name,
        name,
        type: "file",
        parent,
      };
    }

    throw new Error(`Invalid node type for path: ${nodePath}`);
  }
}

export const buildTree = (itemPaths: Array<string>) => {
  const tree = new Tree({
    key: "root",
    name: path.basename(CURR_DIR),
    type: "directory",
    childNodes: [],
  });

  itemPaths.forEach((itemPath) => {
    const nodeKey = Tree.getNodeKey(itemPath);
    tree.insertChildAt(nodeKey, Tree.createNodeFromPath(itemPath));
  });

  return tree.tree;
};
