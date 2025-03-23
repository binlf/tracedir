import { dirName } from "./fs-utils";
import { test, expect } from "bun:test";

test("`dirName` returns only the last directory segment of a path", () => {
  const parent = dirName(process.cwd());
  console.log("Current directory name:", parent);
  expect(parent).toBe("peak");

  const path1 = dirName(
    "C:\\Users\\user\\Documents\\bin\\peak\\tracedir\\something-something\\file.ts"
  );
  console.log("Path 1 directory name:", path1);
  expect(path1).toBe("something-something");

  const path2 = dirName(
    "C:\\Users\\user\\Documents\\bin\\peak\\tracedir\\something-something\\"
  );
  console.log("Path 2 directory name:", path2);
  expect(path2).toBe("tracedir");
});
