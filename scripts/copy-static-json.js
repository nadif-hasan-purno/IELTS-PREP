const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const src = path.join(root, "static.json");
const destDir = path.join(root, "dist"); // change to 'build' if that's your publish folder
const dest = path.join(destDir, "static.json");

if (!fs.existsSync(src)) {
  console.error("ERROR: static.json not found at repo root:", src);
  process.exit(1);
}
if (!fs.existsSync(destDir)) {
  console.error(
    "ERROR: dist directory not found; run the build first:",
    destDir
  );
  process.exit(1);
}
fs.copyFileSync(src, dest);
console.log("Copied static.json to", dest);
