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

const printer = (items: Array<string>) => {
  const chars = ["|", "+", "-"];
  const entryPrefix = `+--`;
  const crlf = pc.redBright("|");

  // print cwd
  console.log(path.basename(CURR_DIR) + "\n" + crlf);

  // print directory tree
  items.map((item, idx, arr) => {
    console.log(entryPrefix + " " + item);
    idx !== arr.length - 1 && console.log(crlf);
  });

  return;
};

const traceHandler = (
  targetDir: string,
  { recursive }: { recursive: boolean }
) => {
  const dirPath = path.resolve(CURR_DIR, targetDir);
  if (!isDirectory(dirPath)) {
    console.error(pc.red(`Error: ${dirPath} is not a directory`));
    process.exit(1);
  }

  const fsItems = fs.readdirSync(CURR_DIR);
  // todo: don't show hidden files
  printer(
    fsItems.sort((fsItem, nextFsItem) => {
      const itemPath = path.join(CURR_DIR, fsItem);
      const nextItemPath = path.join(CURR_DIR, nextFsItem);

      if (isFile(itemPath) && isDirectory(nextItemPath)) return 1;
      if (isDirectory(itemPath) && isFile(nextItemPath)) return -1;
      if (
        (isFile(itemPath) && isFile(nextItemPath)) ||
        (isDirectory(itemPath) && isDirectory(nextItemPath))
      )
        return 0;
      return 0;
    })
  );
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
