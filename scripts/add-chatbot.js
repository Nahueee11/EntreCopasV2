const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const pagesDir = path.join(root, 'pages');
const files = [path.join(root, 'index.html'), ...fs.readdirSync(pagesDir).filter(f => f.endsWith('.html')).map(f => path.join(pagesDir, f))];

const headSnip = '<link href="https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css" rel="stylesheet">\n';
const bodySnip = `<div id="n8n-chat"></div>\n<script type="module">\n    import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';\n\n    createChat({\n        webhookUrl: 'http://localhost:5678/webhook/5b10a946-58e7-4fd5-8341-70388b37becc/chat',\n        webhookConfig: {\n            method: 'POST',\n            headers: {}\n        },\n        target: '#n8n-chat',\n        mode: 'window',\n        chatInputKey: 'chatInput',\n        chatSessionKey: 'sessionId',\n        loadPreviousSession: true,\n        metadata: {},\n        showWelcomeScreen: true,\n        defaultLanguage: 'es',\n        initialMessages: [\n            '¡Hola! 👋',\n            'Soy tu asistente virtual de Entre Copas. ¿En qué puedo ayudarte hoy?'\n        ],\n        i18n: {\n            es: {\n                title: 'Entre Copas',\n                subtitle: 'Tu asistente de experiencias en bodegas.',\n                footer: '',\n                getStarted: 'Nueva Conversación',\n                inputPlaceholder: 'Escribe tu pregunta aquí...',\n            },\n        },\n        enableStreaming: false,\n    });\n</script>\n`;

for (const filepath of files) {
    let text = fs.readFileSync(filepath, 'utf8');
    let changed = false;

    if (!text.includes('https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css')) {
        if (text.includes('</head>')) {
            text = text.replace('</head>', headSnip + '</head>');
            changed = true;
        }
    }

    if (!text.includes('<div id="n8n-chat"></div>')) {
        if (text.includes('</body>')) {
            text = text.replace('</body>', bodySnip + '</body>');
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(filepath, text, 'utf8');
        console.log(`Updated: ${path.relative(root, filepath)}`);
    } else {
        console.log(`Skipped: ${path.relative(root, filepath)}`);
    }
}
