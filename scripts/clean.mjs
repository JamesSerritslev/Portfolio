import { rmSync } from "node:fs";

for (const dir of [".next", "node_modules/.cache"]) {
  try {
    rmSync(dir, { recursive: true, force: true });
    console.log(`Removed ${dir}`);
  } catch {
    // ignore
  }
}
