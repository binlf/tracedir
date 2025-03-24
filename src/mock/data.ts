const tree1 = {
  key: "root",
  name: "tracedir",
  type: "directory",
  parent: null,
  childNodes: [
    {
      key: "dist",
      name: "dist",
      type: "directory",
      parent: "tracedir",
      childNodes: [
        {
          key: "index.js",
          name: "index.js",
          type: "file",
          parent: "dist",
        },
      ],
    },
    {
      key: "src",
      name: "src",
      type: "directory",
      parent: "tracedir",
      childNodes: [Array],
    },
    {
      key: ".gitignore",
      name: ".gitignore",
      type: "file",
      parent: "tracedir",
    },
    {
      key: "bun.lock",
      name: "bun.lock",
      type: "file",
      parent: "tracedir",
    },
    {
      key: "license.md",
      name: "license.md",
      type: "file",
      parent: "tracedir",
    },
    {
      key: "package.json",
      name: "package.json",
      type: "file",
      parent: "tracedir",
    },
    {
      key: "process.txt",
      name: "process.txt",
      type: "file",
      parent: "tracedir",
    },
    {
      key: "readme.md",
      name: "readme.md",
      type: "file",
      parent: "tracedir",
    },
    {
      key: "tsconfig.json",
      name: "tsconfig.json",
      type: "file",
      parent: "tracedir",
    },
  ],
};
