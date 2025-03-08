#!/usr/bin/env node

import fs from "fs-extra";
import fsp from "fs/promises";
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

// fs.opendirSync()
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

const traceHandler = (
  targetDir: string,
  { recursive = false }: { recursive: boolean }
) => {
  // return console.log("Top of the morning to ya!");
  const dirPath = path.resolve(CURR_DIR, targetDir);
  if (!isDirectory(dirPath)) {
    console.error(pc.red(`Error: ${dirPath} is not a directory`));
    process.exit(1);
  }

  // parse ignore list(dotfiles, dotdirectories)
  const ignoreList = ["node_modules", ".git"];

  // get all items
  // todo: instead open the directory(recursively)
  // todo: loop through the directory entries while skipping entries that are found in the ignore list

  const itemPaths: Array<string> = [];
  const readItems = async () => {
    const dir = await fsp.opendir(dirPath, { recursive });

    try {
      for await (const dirent of dir) {
        console.log("Dirent: ", dirent);
        if (ignoreList.includes(dirent.name)) continue;
        itemPaths.push(path.join(dirent.parentPath), dirent.name);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return readItems();

  const itemsToRead = fsItems.filter((item) => !ignoreList.includes(item));

  const readItem = (items: string[]) => {
    items.forEach((item) => {
      const currItemPath = path.join(CURR_DIR, item);

      // console.log("Current Item Path: ", currItemPath);
      if (isFile(currItemPath)) return itemPaths.push(currItemPath);
      if (isDirectory(currItemPath)) {
        itemPaths.push(currItemPath);
        if (recursive) {
          // console.log("Path: ", currItemPath);
          readItem(
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
