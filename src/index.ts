#!/usr/bin/env node

import fsp from "fs/promises";
import path from "path";
import { program } from "commander";
import pc from "picocolors";
import { buildTree } from "./utils/tree";
import { isDirectory } from "./utils/fs-utils";

const CURR_DIR = process.cwd();

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

  // todo: it currently implicitly has a `maxDepth` -- the recursive call doesn't go all the way
  const readdir = async (dirPath: string) => {
    const dir = await fsp.opendir(dirPath);

    try {
      for await (const dirent of dir) {
        const entryPath = path.join(dirent.parentPath, dirent.name);
        if (ignoreList.includes(dirent.name)) continue;
        itemPaths.push(entryPath);
        if (recursive && isDirectory(entryPath)) readdir(entryPath);
      }
    } catch (error) {
      console.error(error);
    }
  };

  readdir(dirPath).then(() => {
    console.log("Item Paths: ", itemPaths.sort());
    const tree = buildTree([
      ...itemPaths.sort((currItemPath, nextItemPath) => {
        if (isDirectory(currItemPath)) return -1;
        return 1;
      }),
    ]);

    console.log("Tree: ", tree);
  });

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
