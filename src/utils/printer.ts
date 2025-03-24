import { type FSTree } from "./tree";
import pc from "picocolors";

export const printer = (tree: FSTree) => {
  const chars = ["|", "+", "-"];
  const itemPrefix = `+--`;
  const crlf = pc.redBright("|");
  const tab = "    ";

  // print cwd
  // console.log(path.basename(CURR_DIR) + "\n" + crlf);

  return;
};
