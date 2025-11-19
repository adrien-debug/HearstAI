// Simple Development Server for Claude CI/CD Cockpit Frontend
// Usage: node dev-server.js

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5555;

// Ensure we're using the project root, not a backup directory
const PROJECT_ROOT = path.resolve(__dirname);
if (PROJECT_ROOT.includes('backup') || PROJECT_ROOT.includes('backups')) {
    console.error('');
    console.error('❌ ERREUR: Le serveur ne doit pas être lancé depuis un dossier de backup!');
    console.error(`   Chemin détecté: ${PROJECT_ROOT}`);
    console.error('');
    console.error('💡 Solution: Lancez le serveur depuis le répertoire racine du projet:');
    console.error('   cd /Users/adrienbeyondcrypto/Desktop/DEV/HearstAI');
    console.error('   node dev-server.js');
    console.error('');
    process.exit(1);
}

const FRONTEND_DIR = path.join(PROJECT_ROOT, 'frontend');

// Verify frontend directory exists
if (!fs.existsSync(FRONTEND_DIR)) {
    console.error('');
    console.error(`❌ ERREUR: Le dossier frontend est introuvable!`);
    console.error(`   Chemin attendu: ${FRONTEND_DIR}`);
    console.error(`   Répertoire actuel: ${PROJECT_ROOT}`);
    console.error('');
    process.exit(1);
}

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    // Remove query string and normalize path
    let filePath = req.url.split('?')[0];
    
    // Default to index.html for root
    if (filePath === '/') {
        filePath = '/index.html';
    }
    
    const fullPath = path.join(FRONTEND_DIR, filePath);
    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'text/plain';
    
    // Security check - prevent directory traversal
    if (!fullPath.startsWith(FRONTEND_DIR)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }
    
    fs.readFile(fullPath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error: ' + err.code);
            }
        } else {
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Cache-Control': 'no-cache'
            });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log('');
    console.log('🚀 Claude CI/CD Cockpit - Development Server');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Server running at: http://localhost:${PORT}`);
    console.log(`📁 Serving from: ${FRONTEND_DIR}`);
    console.log('');
    console.log('Press Ctrl+C to stop');
    console.log('');
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error('');
        console.error(`❌ Error: Port ${PORT} is already in use`);
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('');
        console.error('💡 Solutions:');
        console.error(`   1. Kill the process using port ${PORT}:`);
        console.error(`      lsof -ti:${PORT} | xargs kill -9`);
        console.error('');
        console.error('   2. Or find and kill manually:');
        console.error(`      lsof -i:${PORT}`);
        console.error('');
        process.exit(1);
    } else {
        console.error('❌ Server error:', err);
        process.exit(1);
    }
});
