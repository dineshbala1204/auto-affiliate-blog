const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Helper to get today’s date
const getTodayDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

(async () => {
  // 🧱 Launch browser in no-sandbox mode (GitHub compatible)
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 🌍 Visit Amazon's best sellers page (example: Kitchen)
  await page.goto('https://www.amazon.in/gp/bestsellers/kitchen/', { waitUntil: 'networkidle2' });

  // 🧠 Scrape first product
  const product = await page.evaluate(() => {
    const el = document.querySelector('.p13n-sc-uncoverable-faceout');
    if (!el) return null;

    const title = el.querySelector('._cDEzb_p13n-sc-css-line-clamp-3_g3dy1')?.innerText || 'No Title';
    const url = el.querySelector('a')?.href || '#';
    const image = el.querySelector('img')?.src || '';

    return { title, url, image };
  });

  await browser.close();

  if (!product) {
    console.error('❌ No product found');
    process.exit(1);
  }

  // 🧾 Create markdown content
  const mdContent = `---
title: "${product.title}"
date: ${getTodayDate()}
---

![Product Image](${product.image})

👉 [Buy Now on Amazon](${product.url}?tag=dineshtechblo-21)

`;

  // 📁 Save markdown post
  const filename = `${getTodayDate()}-daily-product.md`;
  fs.writeFileSync(filename, mdContent);
  console.log(`✅ Blog post created: ${filename}`);

  // 🏡 Update index.html (homepage)
  const homepage = `
<html>
<head>
  <title>Dinesh’s Daily Affiliate Blog</title>
</head>
<body>
  <h1>🔥 Latest Product Pick (${getTodayDate()})</h1>
  <h2>${product.title}</h2>
  <img src="${product.image}" width="300" />
  <br/>
  <a href="${product.url}?tag=dineshtechblo-21" target="_blank">
    👉 Buy on Amazon
  </a>
</body>
</html>
`;

  fs.writeFileSync('index.html', homepage);
  console.log('✅ index.html updated!');
})();
