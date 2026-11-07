// Renders HTML files to A4 PDFs with Chromium (Playwright).
//   node render.js <dir> <name> [<name> ...]     reads <dir>/<name>.html, writes <dir>/<name>.pdf
const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const [dir, ...names] = process.argv.slice(2);
  if (!dir || !names.length) {
    console.error("usage: node render.js <dir> <name> [<name> ...]");
    process.exit(2);
  }
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const name of names) {
    await page.goto("file://" + path.resolve(dir, name + ".html"));
    await page.pdf({
      path: path.resolve(dir, name + ".pdf"),
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });
  }
  await browser.close();
})();
