const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dbManager = require('./database/db');

const app = express();
const PORT = process.env.PORT || 5556;

// Ensure we're using the project root, not a backup directory
const PROJECT_ROOT = path.resolve(__dirname, '..');
if (PROJECT_ROOT.includes('backup') || PROJECT_ROOT.includes('backups')) {
    console.error('');
    console.error('❌ ERREUR: Le serveur ne doit pas être lancé depuis un dossier de backup!');
    console.error(`   Chemin détecté: ${PROJECT_ROOT}`);
    console.error('');
    console.error('💡 Solution: Lancez le serveur depuis le répertoire racine du projet:');
    console.error('   cd /Users/adrienbeyondcrypto/Desktop/DEV/HearstAI');
    console.error('   PORT=5556 node backend/server.js');
    console.error('');
    process.exit(1);
}

// Initialize database
try {
    dbManager.initialize();
} catch (error) {
    console.error('❌ Failed to initialize database:', error);
    // Continue anyway - routes will handle errors
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Serve frontend files with path validation
const FRONTEND_DIR = path.join(PROJECT_ROOT, 'frontend');
if (!fs.existsSync(FRONTEND_DIR)) {
    console.error('');
    console.error(`❌ ERREUR: Le dossier frontend est introuvable!`);
    console.error(`   Chemin attendu: ${FRONTEND_DIR}`);
    console.error(`   Répertoire projet: ${PROJECT_ROOT}`);
    console.error('');
    process.exit(1);
}
app.use(express.static(FRONTEND_DIR));

// API root endpoint
app.get('/api', (req, res) => {
    res.json({ 
        status: 'ok',
        message: 'Claude CI/CD Cockpit API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            projects: '/api/projects',
            jobs: '/api/jobs',
            versions: '/api/versions',
            prompts: '/api/prompts',
            logs: '/api/logs',
            stats: '/api/stats',
            electricity: '/api/electricity'
        },
        timestamp: new Date().toISOString()
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        environment: process.env.VERCEL ? 'vercel-serverless' : 'local'
    });
});

// API Routes
const projectsRouter = require('./routes/projects');
const jobsRouter = require('./routes/jobs');
const versionsRouter = require('./routes/versions');
const promptsRouter = require('./routes/prompts');
const logsRouter = require('./routes/logs');
const statsRouter = require('./routes/stats');
const electricityRouter = require('./routes/electricity');

app.use('/api/projects', projectsRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/versions', versionsRouter);
app.use('/api/prompts', promptsRouter);
app.use('/api/logs', logsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/electricity', electricityRouter);

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ 
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
    });
});

// Start server (only if not in Vercel serverless environment)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log('');
        console.log('🚀 Claude CI/CD Cockpit - Backend Server');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✅ Server running on: http://localhost:${PORT}`);
        console.log(`✅ API available at: http://localhost:${PORT}/api`);
        console.log('');
    });
}

module.exports = app;
