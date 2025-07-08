const fs = require("fs");
const path = require("path");

// 1. Generate a new post file
const today = new Date().toISOString().slice(0, 10);
const filename = `${today}-daily-product.md`;
const content = `# Top Amazon Pick for ${today}

Check out this hot deal:  
[🔥 Amazon Product Link](https://www.amazon.in/dp/B07X1KT61D?tag=dineshtechblo-21)

Auto-generated blog post.`;

fs.writeFileSync(filename, content);

// 2. Read all `.md` files to build index.html
const allPosts = fs.readdirSync(".").filter(f => f.endsWith(".md"));

let indexHtml = `<!DOCTYPE html>
<html><head>
  <meta charset="UTF-8">
  <title>Dinesh's Auto Affiliate Blog</title>
  <style>
    body { font-family: Arial; padding: 40px; }
    h1 { color: #333; }
    ul { padding-left: 20px; }
    a { text-decoration: none; color: #1a0dab; }
  </style>
</head><body>
<h1>📚 Dinesh's Auto Affiliate Blog</h1>
<p>Daily updated blog with Amazon affiliate products.</p>
<ul>
`;

for (let file of allPosts.sort().reverse()) {
  indexHtml += `<li><a href="${file}">${file.replace(".md", "")}</a></li>\n`;
}

indexHtml += `</ul><p style="color:#888">Affiliate ID: <strong>dineshtechblo-21</strong></p></body></html>`;

fs.writeFileSync("index.html", indexHtml);

console.log("✅ Blog post + index.html generated.");
