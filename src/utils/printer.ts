import { type Tree } from "./tree";
import pc from "picocolors";

export const printer = (tree: Tree) => {
  const chars = ["|", "+", "-"];
  const itemPrefix = `+--`;
  const crlf = pc.redBright("|");
  const tab = "    ";

  // print cwd
  // console.log(path.basename(CURR_DIR) + "\n" + crlf);

  return;
};
