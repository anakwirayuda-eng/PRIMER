import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * @reflection
 * [IDENTITY]: Pathfinder Watchdog
 * [PURPOSE]: Automates the mapping of project folder topology for documentation sync.
 * [STATE]: Production
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../../");
const OUTPUT_JSON = path.resolve(ROOT, "megalog/outputs/folder_map.json");

const EXCLUDE_DIRS = [
    "node_modules",
    ".git",
    ".gemini",
    "dist",
    "build",
    ".DS_Store",
    "coverage",
    ".system_generated"
];

const EXCLUDE_FILES = [
    "package-lock.json",
    "yarn.lock",
    ".gitignore",
    ".eslintignore"
];

function generateTree(dir, depth = 0, maxDepth = 3) {
    if (depth > maxDepth) return null;

    const stats = fs.statSync(dir);
    if (!stats.isDirectory()) return null;

    const items = fs.readdirSync(dir);
    const tree = {
        name: path.basename(dir) || ".",
        type: "directory",
        children: []
    };

    for (const item of items) {
        if (EXCLUDE_DIRS.includes(item) || EXCLUDE_FILES.includes(item)) continue;

        const fullPath = path.join(dir, item);
        const itemStats = fs.statSync(fullPath);

        if (itemStats.isDirectory()) {
            const childTree = generateTree(fullPath, depth + 1, maxDepth);
            if (childTree) tree.children.push(childTree);
        } else {
            tree.children.push({
                name: item,
                type: "file",
                size: itemStats.size
            });
        }
    }

    return tree;
}

function treeToAscii(node, prefix = "") {
    if (!node) return "";

    let result = "";
    const children = node.children || [];

    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const isLast = i === children.length - 1;
        const connector = isLast ? "└── " : "├── ";

        result += `${prefix}${connector}${child.name}${child.type === 'directory' ? '/' : ''}\n`;

        if (child.type === "directory") {
            const newPrefix = prefix + (isLast ? "    " : "│   ");
            result += treeToAscii(child, newPrefix);
        }
    }

    return result;
}

function main() {
    console.log("📂 Mapping project topology...");

    const tree = generateTree(ROOT);
    const ascii = ".\n" + treeToAscii(tree);

    const output = {
        generatedAt: new Date().toISOString(),
        root: ROOT,
        ascii,
        raw: tree
    };

    if (!fs.existsSync(path.dirname(OUTPUT_JSON))) {
        fs.mkdirSync(path.dirname(OUTPUT_JSON), { recursive: true });
    }

    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(output, null, 2), "utf8");
    console.log("✅ Folder map generated.");
}

main();
