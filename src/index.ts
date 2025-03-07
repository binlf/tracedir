#!/usr/bin/env node

import fs from "fs-extra";
import path from "path";
import { program } from "commander";
import pc from "picocolors";

const CURR_DIR = process.cwd();

function isDirectory(path: string): boolean {
  try {
    return fs.pathExistsSync(path) && fs.statSync(path).isDirectory();
  } catch (err) {
    return false;
  }
}

function isFile(path: string): boolean {
  try {
    return fs.pathExistsSync(path) && fs.statSync(path).isFile();
  } catch (err) {
    return false;
  }
}
const isDotFile = (filePath: string) => {
  const file = path.basename(filePath);
  return isFile(filePath) && file.at(0) === ".";
};

const printer = (tree: Tree) => {
  const chars = ["|", "+", "-"];
  const itemPrefix = `+--`;
  const crlf = pc.redBright("|");
  const tab = "    ";

  // print cwd
  console.log(path.basename(CURR_DIR) + "\n" + crlf);

  // print directory tree
  // items.map((item, idx, arr) => {
  //   console.log(itemPrefix + " " + item);
  //   idx !== arr.length - 1 && console.log(crlf);
  // });

  return;
};

const buildTree = (itemPaths: Array<string>): Tree => {
  const tree = {};

  return tree;
};

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

type FsItem = FsItemFile | FsItemDirectory;

type Tree = {
  cwd: string;
  items: Array<FsItem>;
};

const tree: Tree = {
  cwd: "cwd",
  items: [
    {
      type: "directory",
      name: "app",
      items: [
        {
          type: "directory",
          name: "routes",
          items: [],
        },
        {
          type: "file",
          name: "app.tsx",
        },
        {
          type: "file",
          name: "provider.tsx",
        },
        {
          type: "file",
          name: "router.tsx",
        },
      ],
    },
    {
      type: "directory",
      name: "assets",
      items: [],
    },
    {
      type: "directory",
      name: "assets",
      items: [],
    },
    {
      type: "directory",
      name: "components",
      items: [],
    },
    {
      type: "directory",
      name: "config",
      items: [],
    },
    {
      type: "directory",
      name: "features",
      items: [],
    },
    {
      type: "directory",
      name: "hook",
      items: [],
    },
    {
      type: "directory",
      name: "lib",
      items: [],
    },
    {
      type: "directory",
      name: "stores",
      items: [],
    },
    {
      type: "directory",
      name: "testing",
      items: [],
    },
    {
      type: "directory",
      name: "types",
      items: [],
    },
    {
      type: "directory",
      name: "utils",
      items: [],
    },
  ],
};

const traceHandler = (
  targetDir: string,
  { recursive = false }: { recursive: boolean }
) => {
  return console.log("Top of the morning to ya!");
  const dirPath = path.resolve(CURR_DIR, targetDir);
  if (!isDirectory(dirPath)) {
    console.error(pc.red(`Error: ${dirPath} is not a directory`));
    process.exit(1);
  }

  // get all items
  const fsItems = fs.readdirSync(dirPath);

  // parse ignore list(dotfiles, dotdirectories)
  const ignoreList = ["node_modules", ".git"];

  const itemsToRead = fsItems.filter((item) => !ignoreList.includes(item));

  const itemPaths: string[] = [];
  const readItems = (items: string[]) => {
    items.forEach((item) => {
      const currItemPath = path.join(CURR_DIR, item);

      // console.log("Current Item Path: ", currItemPath);
      if (isFile(currItemPath)) return itemPaths.push(currItemPath);
      if (isDirectory(currItemPath)) {
        itemPaths.push(currItemPath);
        if (recursive) {
          // console.log("Path: ", currItemPath);
          readItems(
            fs
              .readdirSync(currItemPath)
              .map((item) => path.join(path.basename(currItemPath), item))
          );
        }
      }
    });
  };

  readItems(itemsToRead);
  console.log(itemPaths);

  buildTree(itemPaths);

  // todo: don't show hidden files
  // printer(
  //   fsItems.sort((fsItem, nextFsItem) => {
  //     const itemPath = path.join(CURR_DIR, fsItem);
  //     const nextItemPath = path.join(CURR_DIR, nextFsItem);

  //     if (isFile(itemPath) && isDirectory(nextItemPath)) return 1;
  //     if (isDirectory(itemPath) && isFile(nextItemPath)) return -1;
  //     if (
  //       (isFile(itemPath) && isFile(nextItemPath)) ||
  //       (isDirectory(itemPath) && isDirectory(nextItemPath))
  //     )
  //       return 0;
  //     return 0;
  //   })
  // );

  // printer(tree);
  // console.log("Items: ", fsItems);
};

program
  .name("dirtrace")
  .alias("drtr")
  .description(
    "Trace your directory structure. Copy and paste the output into LLM's"
  )
  .version("0.0.1")
  .argument("[targetDir]", "path to target directory", ".")
  .option(
    "-r, --recursive",
    "trace directory and directory content recursively",
    false
  )
  .action(traceHandler);

program.parse();
