const express = require('express');
const cors = require('cors');
const path = require('path');
const dbManager = require('./database/db');

const app = express();
const PORT = process.env.PORT || 4000;

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

app.use(express.static(path.join(__dirname, '../frontend')));

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
            stats: '/api/stats'
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
const businessDevRouter = require('./routes/business-dev');

app.use('/api/projects', projectsRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/versions', versionsRouter);
app.use('/api/prompts', promptsRouter);
app.use('/api/logs', logsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/business-dev', businessDevRouter);

// Electricity endpoint (mock data for now)
app.get('/api/electricity', (req, res) => {
    res.json({
        data: {
            current_power: 0,
            daily_consumption: 0,
            monthly_consumption: 0,
            cost_per_kwh: 0,
            total_cost: 0
        }
    });
});

// Collateral endpoint (mock data for now)
app.get('/api/collateral', (req, res) => {
    res.json({
        data: []
    });
});

// Cockpit endpoint (mock data for now)
app.get('/api/cockpit', (req, res) => {
    res.json({
        data: {}
    });
});

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
    const HOST = process.env.HOST || '0.0.0.0'; // Écouter sur toutes les interfaces réseau
    app.listen(PORT, HOST, () => {
        console.log('');
        console.log('🚀 Claude CI/CD Cockpit - Backend Server');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✅ Server running on: http://localhost:${PORT}`);
        console.log(`✅ Server accessible on network: http://0.0.0.0:${PORT}`);
        console.log(`✅ API available at: http://localhost:${PORT}/api`);
        console.log('');
    });
}

module.exports = app;
