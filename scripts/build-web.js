// Builds the app's web files from src/journal.html:
//   www/index.html   - Android app (libraries bundled, ads on)
//   docs/index.html  - web version for GitHub Pages (no ads)
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'src/journal.html'), 'utf8');
const head = (extra) => '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">' +
  '<meta name="theme-color" content="#e1264a">' + extra +
  '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style></head><body>';

// Android: load Chart.js and SheetJS from local files so the app works offline
let app = src
  .replace(/<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/Chart\.js\/[^"]+"><\/script>/, '<script src="libs/chart.umd.js"></script>')
  .replace(/<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/xlsx\/[^"]+"><\/script>/, '<script src="libs/xlsx.full.min.js"></script>')
  .replace("Open the phone version of the journal (the link Claude gave you), or check your internet connection.", "Check your internet connection and try again.");
fs.mkdirSync(path.join(root, 'www/libs'), { recursive: true });
fs.copyFileSync(path.join(root, 'node_modules/chart.js/dist/chart.umd.js'), path.join(root, 'www/libs/chart.umd.js'));
fs.copyFileSync(path.join(root, 'node_modules/xlsx/dist/xlsx.full.min.js'), path.join(root, 'www/libs/xlsx.full.min.js'));
fs.copyFileSync(path.join(root, 'src/ads-config.js'), path.join(root, 'www/ads-config.js'));
fs.copyFileSync(path.join(root, 'src/ads.js'), path.join(root, 'www/ads.js'));
fs.writeFileSync(path.join(root, 'www/index.html'), head('') + app + '<script src="ads-config.js"></script><script src="ads.js"></script></body></html>');

// Web version
fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
fs.writeFileSync(path.join(root, 'docs/index.html'), head('<meta name="mobile-web-app-capable" content="yes">') +
  src.replace("Open the phone version of the journal (the link Claude gave you), or check your internet connection.", "Check your internet connection and try again.") + '</body></html>');
if (fs.existsSync(path.join(root, 'store/privacy-policy.html'))) fs.copyFileSync(path.join(root, 'store/privacy-policy.html'), path.join(root, 'docs/privacy.html'));
console.log('Built www/ and docs/');
