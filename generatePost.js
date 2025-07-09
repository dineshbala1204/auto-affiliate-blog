const puppeteer = require('puppeteer');
const fs = require('fs');

// 🗓️ Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

(async () => {
  console.log("🚀 Launching browser...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  console.log("🌐 Navigating to Amazon Best Sellers...");
  await page.goto('https://www.amazon.in/gp/bestsellers/kitchen/', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  console.log("🔍 Scraping product details...");
  const product = await page.evaluate(() => {
    const el = document.querySelector('div.zg-grid-general-faceout');
    if (!el) return null;

    const title = el.querySelector('._cDEzb_p13n-sc-css-line-clamp-3_g3dy1')?.innerText || 'No Title';
    const url = el.querySelector('a')?.href || '#';
    const image = el.querySelector('img')?.src || '';

    return { title, url, image };
  });

  await browser.close();

  if (!product || !product.url || !product.title) {
    console.error("❌ Failed to extract product data.");
    process.exit(1);
  }

  const today = getTodayDate();
  const mdFileName = `${today}-daily-product.md`;

  const mdContent = `---
title: "${product.title}"
date: ${today}
---

![Product Image](${product.image})

👉 [Buy Now on Amazon](${product.url}?tag=dineshtechblo-21)
`;

  fs.writeFileSync(mdFileName, mdContent);
  console.log(`✅ Blog post created: ${mdFileName}`);

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Dinesh’s Auto Blog</title>
</head>
<body style="font-family: Arial, sans-serif;">
  <h1>🔥 Latest Product Pick (${today})</h1>
  <h2>${product.title}</h2>
  <img src="${product.image}" width="300" />
  <br><br>
  <a href="${product.url}?tag=dineshtechblo-21" target="_blank" style="font-size: 18px;">👉 Buy Now on Amazon</a>
  <p style="margin-top: 50px;">Auto-posted by Dinesh’s bot 🤖</p>
</body>
</html>
`;

  fs.writeFileSync('index.html', htmlContent);
  console.log("✅ index.html updated!");
})();
