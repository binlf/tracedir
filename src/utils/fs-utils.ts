import fs from "fs-extra";
import path from "path";

export function isDirectory(path: string): boolean {
  try {
    return fs.pathExistsSync(path) && fs.statSync(path).isDirectory();
  } catch (err) {
    return false;
  }
}

export function isFile(path: string): boolean {
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
