const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('🚀 Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('https://www.amazon.in/gp/new-releases/', { waitUntil: 'domcontentloaded' });

  const product = await page.evaluate(() => {
    const titleEl = document.querySelector('.p13n-sc-truncated');
    const imgEl = document.querySelector('.zg-item img');
    const linkEl = document.querySelector('.zg-item a');

    return {
      title: titleEl ? titleEl.innerText.trim() : 'Trending Product',
      image: imgEl ? imgEl.src : '',
      link: linkEl ? linkEl.href : ''
    };
  });

  await browser.close();

  const affiliateLink = product.link.includes('?') ?
    `${product.link}&tag=dineshtechblo-21` :
    `${product.link}?tag=dineshtechblo-21`;

  const today = new Date().toISOString().split('T')[0];
  const postPath = `_posts/${today}-daily-product.md`;

  const content = `---
title: "${product.title}"
date: ${today}
---

<img src="${product.image}" alt="${product.title}" style="max-width:100%;"/>

[🛒 Buy on Amazon](${affiliateLink})
`;

  fs.mkdirSync('_posts', { recursive: true });
  fs.writeFileSync(postPath, content.trim());

  console.log(`✅ Blog post created: ${postPath}`);
})();
