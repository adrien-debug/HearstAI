const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.use(express.static(path.join(__dirname, '../frontend')));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        environment: 'vercel-serverless'
    });
});

// Mock API endpoints
app.get('/api/projects', (req, res) => {
    res.json({
        projects: [],
        message: 'Backend connected successfully'
    });
});

app.get('/api/jobs', (req, res) => {
    res.json({ jobs: [] });
});

app.get('/api/versions', (req, res) => {
    res.json({ versions: [] });
});

app.get('/api/prompts', (req, res) => {
    res.json({ prompts: [] });
});

app.get('/api/logs', (req, res) => {
    res.json({ logs: [] });
});

app.get('/api/stats', (req, res) => {
    res.json({ 
        projects: 0,
        jobs: 0,
        versions: 0
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

// Export for Vercel serverless
module.exports = app;
