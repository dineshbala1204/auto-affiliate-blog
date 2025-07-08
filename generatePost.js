const puppeteer = require("puppeteer");
const fs = require("fs");

// Set keyword to search for
const keyword = "tech gadgets under 999";

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  const searchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(keyword)}`;
  await page.goto(searchUrl, { waitUntil: "domcontentloaded" });

  // Wait for product to load
  await page.waitForSelector(".s-title-instructions-style");

  // Extract first product info
  const product = await page.evaluate(() => {
    const item = document.querySelector(".s-title-instructions-style");
    const link = item.querySelector("a")?.href;
    const title = item.querySelector("h2 span")?.innerText;
    return { title, link };
  });

  await browser.close();

  if (!product || !product.link) {
    console.log("❌ No product found.");
    return;
  }

  // Add affiliate tag
  const affiliateLink = product.link + "&tag=dineshtechblo-21";
  const today = new Date().toISOString().slice(0, 10);
  const filename = `${today}-trending-product.md`;

  const content = `# ${product.title}

🔥 Buy now: [Amazon Link](${affiliateLink})

_Auto-posted from trending search: "${keyword}"_`;

  fs.writeFileSync(filename, content);
  console.log("✅ Post created:", filename);

  // Update index.html
  const allFiles = fs.readdirSync(".").filter(f => f.endsWith(".md")).sort().reverse();
  let index = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Dinesh's Auto Affiliate Blog</title></head><body><h1>Daily Affiliate Blog</h1><ul>`;
  for (let file of allFiles) {
    index += `<li><a href="${file}">${file.replace(".md", "")}</a></li>`;
  }
  index += `</ul><p style="color:#999">Affiliate ID: dineshtechblo-21</p></body></html>`;
  fs.writeFileSync("index.html", index);

})();
