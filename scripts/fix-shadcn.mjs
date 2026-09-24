#!/usr/bin/env node
/**
 * Post-process shadcn-generated components.
 *
 * shadcn emits `import { cn } from "cn"` and installs a standalone package
 * to satisfy it. This project already has cn() in lib/utils wrapping clsx +
 * tailwind-merge, so the generated import is wrong and the package is dead
 * weight. It comes back on every `shadcn add`, hence a script rather than a
 * note someone has to remember.
 *
 * Usage:  npx shadcn@latest add <component>  &&  npm run ui:fix
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const UI_DIR = join(process.cwd(), "src", "components", "ui");
const BAD = /^import \{ cn \} from "cn"$/m;

let fixed = 0;
for (const file of readdirSync(UI_DIR).filter((f) => f.endsWith(".tsx"))) {
  const path = join(UI_DIR, file);
  const src = readFileSync(path, "utf8");
  if (!BAD.test(src)) continue;
  writeFileSync(path, src.replace(BAD, 'import { cn } from "@/lib/utils"'));
  console.log(`  fixed cn import: ${file}`);
  fixed++;
}

console.log(fixed ? `\n${fixed} file(s) corrected.` : "  no cn imports needed fixing.");

const pkg = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8"));
if (pkg.dependencies?.cn) {
  console.log("\n  The 'cn' package is installed and unused. Remove it with:");
  console.log("    npm uninstall cn");
  process.exitCode = 1;
}
