const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const pagesDir = path.join(root, 'pages');
const files = [path.join(root, 'index.html'), ...fs.readdirSync(pagesDir).filter(f => f.endsWith('.html')).map(f => path.join(pagesDir, f))];

const oldConfig = `        webhookConfig: {\n            method: 'POST',\n            headers: {}\n        },\n        target: '#n8n-chat',\n`;
const newConfig = `        webhookConfig: {\n            method: 'POST',\n            headers: {\n                'Content-Type': 'application/json',\n                'Accept': 'application/json'\n            }\n        },\n        target: '#n8n-chat',\n`;

for (const filepath of files) {
  let text = fs.readFileSync(filepath, 'utf8');
  if (text.includes(oldConfig)) {
    text = text.replace(oldConfig, newConfig);
    fs.writeFileSync(filepath, text, 'utf8');
    console.log('Updated:', path.relative(root, filepath));
  } else {
    console.log('No match for:', path.relative(root, filepath));
  }
}
