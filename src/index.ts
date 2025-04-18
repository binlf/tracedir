#!/usr/bin/env node

import fsp from "fs/promises";
import path from "path";
import { program } from "commander";
import pc from "picocolors";
import { buildTree } from "./utils/tree";
import { isDirectory } from "./utils/fs-utils";
import { printer } from "./utils/printer";

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
  const ignoreList = ["node_modules", ".git", "dist"];

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

  readdir(dirPath)
    .then(() => {
      const dirs: Array<string> = [];
      const files: Array<string> = [];

      // todo: revise this logic
      itemPaths.forEach((itemPath) =>
        isDirectory(itemPath) ? dirs.push(itemPath) : files.push(itemPath)
      );
      // todo: revise this ASAP
      const tree = buildTree([...dirs.sort(), ...files.sort()]);
      return tree;
    })
    .then((tree) => {
      if (!tree) return;
      // todo: don't show hidden files
      printer(tree);
    });
};

program
  .name("tracedir")
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
