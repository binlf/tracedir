# tracedir

`tracedir` is a command-line utility that visualizes directory structures in a clean, tree-like format. Perfect for quickly understanding project layouts and generating LLM-friendly directory outlines that you can copy and paste into documentation or AI conversations.

## Features

- 🌳 **Clean Tree Visualization** - Displays directories and files in an intuitive tree structure
- 🔄 **Recursive Scanning** - Optional deep directory traversal with the `-r` flag
- 🚫 **Smart Filtering** - Automatically ignores common build artifacts and system files
- 🎨 **Colored Output** - Uses colors to enhance readability in the terminal
- 📋 **LLM-Ready** - Generates copy-paste friendly output for AI tools and documentation
- ⚡ **Fast & Lightweight** - Built with TypeScript and optimized for performance

## Installation

Install globally via npm:

```bash
npm install -g tracedir
```

Or run directly with bunx:

```bash
bunx tracedir
```

## Usage

### Basic Syntax

```bash
tracedir [targetDir] [options]
```

### Examples

**Trace current directory (non-recursive):**

```bash
tracedir
```

**Trace a specific directory:**

```bash
tracedir ./my-project
```

**Recursive directory tracing:**

```bash
tracedir ./my-project -r
```

**Trace with long option:**

```bash
tracedir ./my-project --recursive
```

### Options

| Option        | Short | Description                                        |
| ------------- | ----- | -------------------------------------------------- |
| `--recursive` | `-r`  | Trace directory and all subdirectories recursively |
| `--help`      | `-h`  | Display help information                           |
| `--version`   | `-V`  | Show version number                                |

### Sample Output

```
my-project
|
+-- src/
|   +-- index.ts
|   +-- utils/
|       +-- fs-utils.ts
|       +-- printer.ts
|       +-- tree.ts
+-- package.json
+-- README.md
+-- tsconfig.json
```

## Ignored Patterns

The tool automatically ignores common files and directories that are typically not relevant for project structure visualization:

- `node_modules/` - Node.js dependencies
- `.git/` - Git repository data
- `dist/` - Build output directories
- `.env` - Environment files
- `.DS_Store` - macOS system files
- `.vscode/` - VS Code settings
- `Thumbs.db` - Windows thumbnail cache

## Use Cases

- **Project Documentation** - Generate directory trees for README files
- **Code Reviews** - Quickly understand project structure
- **LLM Context** - Provide directory structure to AI coding assistants
- **Onboarding** - Help new team members understand codebase organization
- **Architecture Planning** - Visualize and plan project structure

## Requirements

- Node.js 16+ or Bun runtime
- Works on Windows, macOS, and Linux

## License

This project is licensed under the MIT License - see the LICENSE file for details.
