import { isDirectory, isFile, dirName } from "./fs-utils";
import path from "path";

const CURR_DIR = process.cwd();

type FSTreeNodeFile = {
  key: string;
  name: string;
  type: "file";
  parent: string | null;
};

type FSTreeNodeDirectory = {
  key: string;
  name: string;
  type: "directory";
  childNodes: Array<FSTreeNode>;
  parent: string | null;
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
   * Inserts a child node into a parent node at the end of its children array
   * @param parentNodeKey - The key of the parent node to insert into
   * @param childNode - The node to insert as a child
   * @returns The updated tree
   * @throws Error if tree is not initialized
   * @throws Error if parent node doesn't exist
   * @throws Error if parent node is not a directory
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
        `Cannot insert a child with key '${childNode.key}' into a non-directory node with key '${parentNodeKey}'.`
      );
    }
    parentNode.childNodes.push(childNode);
    this.nodeMap.set(childNode.key, childNode);
    return this.tree;
  }

  /**
   * Gets the parent node key by extracting the directory name from the item path
   * and replacing all occurrences of the current directory basename with "root"
   * @param itemPath - The path of the item
   * @returns The parent node key string
   */
  static getParentNodeKey(itemPath: string) {
    return dirName(itemPath).replaceAll(path.basename(CURR_DIR), "root");
  }

  /**
   * Creates a new file system tree node object from a given path
   * @param itemPath - The file system path to create a node from
   * @returns A new FSTreeNode representing either a file or directory
   * @throws Error if path is incomplete or invalid
   */
  static createNodeFromPath(itemPath: string): FSTreeNode {
    const parent = dirName(itemPath);
    if (!parent) throw new Error("Path is incomplete");
    const name = path.basename(itemPath);

    if (isDirectory(itemPath)) {
      return {
        key: name,
        name,
        type: "directory",
        parent,
        childNodes: [],
      };
    }

    if (isFile(itemPath)) {
      return {
        key: name,
        name,
        type: "file",
        parent,
      };
    }

    throw new Error(`Invalid node type for path: ${itemPath}`);
  }
}

export const buildTree = (itemPaths: Array<string>) => {
  const tree = new Tree({
    key: "root",
    name: path.basename(CURR_DIR),
    type: "directory",
    parent: null,
    childNodes: [],
  });

  itemPaths.forEach((itemPath) => {
    const parentNodeKey = Tree.getParentNodeKey(itemPath);
    tree.insertChildAt(parentNodeKey, Tree.createNodeFromPath(itemPath));
  });

  return tree.tree;
};
