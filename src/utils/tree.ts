import { isDirectory, isFile, dirName } from "./fs-utils";
import path from "path";

const CURR_DIR = process.cwd();

interface FSTreeNodeBase {
  key: string;
  name: string;
  parent: string | null;
}

interface FSTreeNodeFile extends FSTreeNodeBase {
  type: "file";
}

interface FSTreeNodeDirectory extends FSTreeNodeBase {
  type: "directory";
  childNodes: FSTreeNode[];
}

type FSTreeNode = FSTreeNodeFile | FSTreeNodeDirectory;

export type FSTree = FSTreeNodeDirectory;

// Type guards
const isDirectoryNode = (node: FSTreeNode): node is FSTreeNodeDirectory =>
  node.type === "directory";

export class Tree {
  private readonly tree: FSTree;
  private readonly nodeMap = new Map<string, FSTreeNode>();

  constructor(rootNode: FSTree) {
    this.tree = rootNode;
    this.nodeMap.set(rootNode.key, rootNode);
  }

  getTree(): FSTree {
    return this.tree;
  }

  getHashTable() {
    return this.nodeMap;
  }

  /**
   * Sorts child nodes with directories first, then files, both alphabetically
   */
  private sortChildNodes(childNodes: FSTreeNode[]): void {
    childNodes.sort((a, b) => {
      // Directories come before files
      if (a.type === "directory" && b.type === "file") return -1;
      if (a.type === "file" && b.type === "directory") return 1;

      // Within same type, sort alphabetically (case-insensitive)
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
  }

  /**
   * Inserts a child node into a parent directory node
   * @param parentNodeKey - The key of the parent node to insert into
   * @param childNode - The node to insert as a child
   * @throws Error if parent node doesn't exist or is not a directory
   */
  insertChild(parentNodeKey: string, childNode: FSTreeNode): void {
    const parentNode = this.nodeMap.get(parentNodeKey);

    if (!parentNode) {
      throw new Error(`Parent node '${parentNodeKey}' not found`);
    }

    if (!isDirectoryNode(parentNode)) {
      throw new Error(`Node '${parentNodeKey}' is not a directory`);
    }

    parentNode.childNodes.push(childNode);
    this.sortChildNodes(parentNode.childNodes);
    this.nodeMap.set(childNode.key, childNode);
  }

  /**
   * Creates a node key from a file path relative to the current directory
   */
  private static createNodeKey(itemPath: string): string {
    const relativePath = path.relative(CURR_DIR, itemPath);
    return relativePath || path.basename(CURR_DIR);
  }

  /**
   * Gets the parent node key for a given item path
   */
  static getParentNodeKey(itemPath: string): string {
    const dirPath = path.parse(itemPath).dir;
    const nodeKey = Tree.createNodeKey(dirPath);
    return dirPath === CURR_DIR ? "root" : nodeKey;
  }

  /**
   * Creates a file system tree node from a path
   * @param itemPath - The file system path to create a node from
   * @returns A new FSTreeNode
   * @throws Error if path type cannot be determined
   */
  static createNode(itemPath: string): FSTreeNode {
    const name = path.basename(itemPath);
    const key = this.createNodeKey(itemPath);
    const parent = this.getParentNodeKey(itemPath);

    const baseNode: FSTreeNodeBase = { key, name, parent };

    if (isDirectory(itemPath)) {
      return {
        ...baseNode,
        type: "directory",
        childNodes: [],
      } as FSTreeNodeDirectory;
    }

    if (isFile(itemPath)) {
      return {
        ...baseNode,
        type: "file",
      } as FSTreeNodeFile;
    }

    throw new Error(`Cannot determine type for path: ${itemPath}`);
  }
}

export const buildTree = (itemPaths: string[]): FSTree => {
  const rootKey = "root";
  const tree = new Tree({
    key: rootKey,
    name: path.basename(CURR_DIR),
    type: "directory",
    parent: null,
    childNodes: [],
  });

  for (const itemPath of itemPaths) {
    try {
      const node = Tree.createNode(itemPath);
      const parentKey = Tree.getParentNodeKey(itemPath) || rootKey;
      tree.insertChild(parentKey, node);
    } catch (error) {
      console.warn(`Failed to add node for path '${itemPath}':`, error);
    }
  }

  return tree.getTree();
};
