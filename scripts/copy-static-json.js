const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const src = path.join(root, "static.json");
const publishDir = process.env.PUBLISH_DIR || "dist"; // fallback; change via env if needed
const destDir = path.join(root, publishDir);
const dest = path.join(destDir, "static.json");

try {
  if (!fs.existsSync(src)) {
    console.error("WARN: static.json not found at repo root:", src);
    console.log("Skipping copy; static.json must exist if you need redirects.");
    process.exit(0);
  }

  // Ensure destDir exists (create it if build created a slightly different structure)
  if (!fs.existsSync(destDir)) {
    console.warn("WARN: publish directory does not exist yet:", destDir);
    // try to create it (harmless if build will replace it)
    try {
      fs.mkdirSync(destDir, { recursive: true });
    } catch (e) {
      /* ignore */
    }
  }

  fs.copyFileSync(src, dest);
  console.log("Copied static.json to", dest);
} catch (err) {
  console.error("ERROR copying static.json:", err);
  // Do not fail the whole build; surface a warning but exit 0 so deploy can continue.
  process.exit(0);
}
