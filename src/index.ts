#!/usr/bin/env node

import fsp from "fs/promises";
import path from "path";
import { program } from "commander";
import pc from "picocolors";
import { buildTree } from "./utils/tree";
import { isDirectory } from "./utils/fs-utils";
import { printer } from "./utils/printer";

const CURR_DIR = process.cwd();

interface ScanOptions {
  recursive: boolean;
  ignorePatterns: string[];
}

class DirectoryScanner {
  private readonly options: ScanOptions;
  private readonly itemPaths: string[] = [];

  constructor(options: ScanOptions) {
    this.options = options;
  }

  private shouldIgnore(name: string): boolean {
    return this.options.ignorePatterns.some((pattern) => {
      if (pattern.startsWith(".")) {
        return name === pattern || name.startsWith(pattern);
      }
      return name === pattern;
    });
  }

  private async scanDirectory(dirPath: string): Promise<void> {
    try {
      const dir = await fsp.opendir(dirPath);

      for await (const dirent of dir) {
        if (this.shouldIgnore(dirent.name)) continue;

        const entryPath = path.join(dirent.parentPath, dirent.name);
        this.itemPaths.push(entryPath);

        if (this.options.recursive && isDirectory(entryPath)) {
          await this.scanDirectory(entryPath);
        }
      }
    } catch (error) {
      console.error(
        pc.yellow(`Warning: Could not read directory ${dirPath}`),
        error
      );
    }
  }

  async scan(targetPath: string): Promise<string[]> {
    this.itemPaths.length = 0; // Reset array
    await this.scanDirectory(targetPath);
    return [...this.itemPaths];
  }
}

const traceHandler = async (
  targetDir: string,
  { recursive = false }: { recursive: boolean }
): Promise<void> => {
  try {
    const dirPath = path.resolve(CURR_DIR, targetDir);

    if (!isDirectory(dirPath)) {
      console.error(pc.red(`Error: ${dirPath} is not a directory`));
      process.exit(1);
    }

    const scanner = new DirectoryScanner({
      recursive,
      ignorePatterns: [
        "node_modules",
        ".git",
        "dist",
        ".env",
        ".DS_Store",
        ".vscode",
        "Thumbs.db",
      ],
    });

    console.log(
      pc.blue(`Scanning ${dirPath}${recursive ? " (recursive)" : ""} ...`)
    );

    const itemPaths = await scanner.scan(dirPath);

    if (itemPaths.length === 0) {
      console.log(pc.yellow("No files found to trace."));
      return;
    }

    const tree = buildTree(itemPaths);
    printer(tree);
  } catch (error) {
    console.error(pc.red("Error during directory tracing:"), error);
    process.exit(1);
  }
};

program
  .name("tracedir")
  .description(
    "Trace your directory structure. Copy and paste the output into LLMs"
  )
  .version("1.0.0")
  .argument("[targetDir]", "path to target directory", ".")
  .option(
    "-r, --recursive",
    "trace directory and directory content recursively",
    false
  )
  .action(traceHandler);

program.parse();
