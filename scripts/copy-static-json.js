import { existsSync, copyFileSync, mkdirSync } from "fs";
import { join, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = new URL(".", import.meta.url).pathname;
const root = resolve(__dirname, "..");
const src = join(root, "static.json");
const publishDir = process.env.PUBLISH_DIR || "dist";
const destDir = join(root, publishDir);
const dest = join(destDir, "static.json");

try {
  if (!existsSync(src)) {
    console.error("WARN: static.json not found at repo root:", src);
    console.log("Skipping copy; static.json must exist if you need redirects.");
    process.exit(0);
  }

  if (!existsSync(destDir)) {
    console.warn("WARN: publish directory does not exist yet:", destDir);
    try {
      mkdirSync(destDir, { recursive: true });
    } catch (e) {
      /* ignore */
    }
  }

  copyFileSync(src, dest);
  console.log("Copied static.json to", dest);
} catch (err) {
  console.error("ERROR copying static.json:", err);
  process.exit(0);
}
