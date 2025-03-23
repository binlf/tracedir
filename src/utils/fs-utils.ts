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

export const isDotFile = (filePath: string) => {
  const file = path.basename(filePath);
  return isFile(filePath) && file.at(0) === ".";
};

export const dirName = (itemPath: string) => {
  // parent should be the "latest" parent directory of the current item
  // e.g 'C:\\Users\\user\\Documents\\bin\\peak\\tracedir\\.gitignore' -> parent: "tracedir"
  const pathObj = path.parse(itemPath);
  return pathObj.dir.split(path.sep).at(-1) || "";
};
