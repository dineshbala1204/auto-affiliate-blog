const fs = require("fs");

const post = `# Affiliate Marketing Tips - ${new Date().toDateString()}

Learn how to start earning with Amazon affiliate links. Post shared on ${new Date().toLocaleDateString()}.

[👉 Check this trending product on Amazon](https://www.amazon.in/dp/B07X1KT6LD?tag=dineshtechblo-21)
`;

fs.writeFileSync("posts.md", post);
console.log("✅ Blog post generated.");

