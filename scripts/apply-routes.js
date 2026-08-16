const fs = require('fs');
const path = require('path');

const routesConfig = {
  version: 1,
  description: "Optimized Cloudflare Pages routing table for ClapCulture to bypass Workers on all static assets and static pages",
  include: [
    "/*"
  ],
  exclude: [
    "/_next/static/*",
    "/_next/data/*",
    "/allu-arjun.jpeg",
    "/apple-touch-icon.png",
    "/favicon.ico",
    "/favicon.png",
    "/favicon.svg",
    "/file.svg",
    "/globe.svg",
    "/happyfan1.webp",
    "/happyfan2.webp",
    "/happyfan3.webp",
    "/herobg1-desktop.png",
    "/herobg1-mobile.png",
    "/herobg2-desktop.png",
    "/herobg2-mobile.png",
    "/herobg3-desktop.png",
    "/herobg3-mobile.png",
    "/mahesh-babu.jpeg",
    "/manifest.json",
    "/next.svg",
    "/ntr.jpeg",
    "/pawankalyan.jpeg",
    "/prabhas.jpeg",
    "/qrcode.png",
    "/ramcharan.jpeg",
    "/sw.js",
    "/vercel.svg",
    "/window.svg",
    "/terms",
    "/privacy",
    "/refund-policy",
    "/shipping-policy",
    "/contact",
    "/size-guide",
    "/faq",
    "/refund",
    "/cookie",
    "/cookie-policy",
    "/returns",
    "/shipping",
    "/about"
  ]
};

const targetPath = path.join(__dirname, '../apps/web/.vercel/output/static/_routes.json');
const publicPath = path.join(__dirname, '../apps/web/public/_routes.json');

fs.writeFileSync(targetPath, JSON.stringify(routesConfig, null, 2), 'utf8');
fs.writeFileSync(publicPath, JSON.stringify(routesConfig, null, 2), 'utf8');
console.log(`✅ Applied optimized _routes.json with ${routesConfig.exclude.length} excluded static asset paths!`);
