#!/bin/bash

# HearstAI - Installation COMPLÈTE automatique
# Backend + Frontend + Toutes les pages

set -e

echo "🔥 HearstAI - Installation COMPLÈTE"
echo "====================================="
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_info() { echo -e "${YELLOW}ℹ️  $1${NC}"; }

if [ ! -f "package.json" ]; then
    log_error "Lance ce script depuis le dossier HearstAI/"
    exit 1
fi

log_info "Création des dossiers..."
mkdir -p backend/database backend/models backend/services backend/routes
mkdir -p frontend/css frontend/js data

log_success "Dossiers créés"

# ========== BACKEND FILES ==========

log_info "Installation du backend..."

# db.js
cat > backend/database/db.js << 'EOF'
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

class DatabaseManager {
    constructor() {
        this.db = null;
        this.dbPath = path.join(__dirname, '../../data/hearstai.db');
    }

    initialize() {
        try {
            const dataDir = path.dirname(this.dbPath);
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }
            this.db = new Database(this.dbPath);
            this.db.pragma('journal_mode = WAL');
            this.createTables();
            console.log('✅ Database initialized successfully');
            return true;
        } catch (error) {
            console.error('❌ Database initialization failed:', error);
            throw error;
        }
    }

    createTables() {
        const schema = \`
            CREATE TABLE IF NOT EXISTS projects (
                id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT,
                type TEXT NOT NULL, status TEXT DEFAULT 'active',
                repo_type TEXT NOT NULL, repo_url TEXT, repo_branch TEXT,
                local_path TEXT, stable_version_id TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS versions (
                id TEXT PRIMARY KEY, project_id TEXT NOT NULL,
                label TEXT NOT NULL, description TEXT,
                parent_version_id TEXT, is_stable INTEGER DEFAULT 0,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(id)
            );
            CREATE TABLE IF NOT EXISTS jobs (
                id TEXT PRIMARY KEY, project_id TEXT NOT NULL,
                type TEXT NOT NULL, status TEXT DEFAULT 'pending',
                input_prompt TEXT NOT NULL, output_result TEXT,
                prompt_profile_id TEXT, context_data TEXT, metadata TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                started_at TEXT, completed_at TEXT,
                FOREIGN KEY (project_id) REFERENCES projects(id)
            );
            CREATE TABLE IF NOT EXISTS job_logs (
                id TEXT PRIMARY KEY, job_id TEXT NOT NULL,
                level TEXT NOT NULL, message TEXT NOT NULL, metadata TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (job_id) REFERENCES jobs(id)
            );
            CREATE TABLE IF NOT EXISTS version_files (
                id TEXT PRIMARY KEY, version_id TEXT NOT NULL,
                file_path TEXT NOT NULL, content TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (version_id) REFERENCES versions(id)
            );
        \`;
        this.db.exec(schema);
        console.log('✅ Database tables created/verified');
    }

    getDb() {
        if (!this.db) throw new Error('Database not initialized');
        return this.db;
    }

    close() {
        if (this.db) {
            this.db.close();
            console.log('✅ Database connection closed');
        }
    }
}

const dbManager = new DatabaseManager();
module.exports = dbManager;
EOF

log_success "db.js installé"

# Project.js
cat > backend/models/Project.js << 'EOF'
const { v4: uuidv4 } = require('uuid');
const dbManager = require('../database/db');

class Project {
    static create(data) {
        const db = dbManager.getDb();
        const id = uuidv4();
        const now = new Date().toISOString();
        const stmt = db.prepare(\`
            INSERT INTO projects (id, name, description, type, repo_type, 
                repo_url, repo_branch, local_path, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        \`);
        stmt.run(id, data.name, data.description || null, data.type,
            data.repo_type, data.repo_url || null, data.repo_branch || 'main',
            data.local_path || null, now, now);
        return this.getById(id);
    }

    static getAll(filters = {}) {
        const db = dbManager.getDb();
        let query = 'SELECT * FROM projects WHERE 1=1';
        const params = [];
        if (filters.status) { query += ' AND status = ?'; params.push(filters.status); }
        if (filters.type) { query += ' AND type = ?'; params.push(filters.type); }
        query += ' ORDER BY created_at DESC';
        return db.prepare(query).all(...params);
    }

    static getById(id) {
        return dbManager.getDb().prepare('SELECT * FROM projects WHERE id = ?').get(id);
    }

    static getWithDetails(id) {
        const project = this.getById(id);
        if (!project) return null;
        const db = dbManager.getDb();
        const versions = db.prepare(\`SELECT * FROM versions WHERE project_id = ? ORDER BY created_at DESC\`).all(id);
        const jobs = db.prepare(\`SELECT * FROM jobs WHERE project_id = ? ORDER BY created_at DESC LIMIT 10\`).all(id);
        return { ...project, versions, jobs };
    }

    static update(id, data) {
        const db = dbManager.getDb();
        const fields = [], params = [];
        const allowedFields = ['name', 'description', 'type', 'status', 'repo_url', 'repo_branch', 'local_path', 'stable_version_id'];
        allowedFields.forEach(field => {
            if (data[field] !== undefined) {
                fields.push(\`\${field} = ?\`);
                params.push(data[field]);
            }
        });
        if (fields.length === 0) return this.getById(id);
        fields.push('updated_at = ?');
        params.push(new Date().toISOString());
        params.push(id);
        db.prepare(\`UPDATE projects SET \${fields.join(', ')} WHERE id = ?\`).run(...params);
        return this.getById(id);
    }

    static delete(id) {
        const db = dbManager.getDb();
        db.prepare('UPDATE projects SET status = ?, updated_at = ? WHERE id = ?')
            .run('archived', new Date().toISOString(), id);
        return this.getById(id);
    }
}

module.exports = Project;
EOF

log_success "Project.js installé"

# Job.js
cat > backend/models/Job.js << 'EOF'
const { v4: uuidv4 } = require('uuid');
const dbManager = require('../database/db');

class Job {
    static create(data) {
        const db = dbManager.getDb();
        const id = uuidv4();
        const now = new Date().toISOString();
        db.prepare(\`INSERT INTO jobs (id, project_id, type, status, input_prompt, prompt_profile_id, context_data, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)\`)
            .run(id, data.project_id, data.type, 'pending', data.input_prompt, data.prompt_profile_id || null, JSON.stringify(data.context_data || {}), JSON.stringify(data.metadata || {}), now);
        return this.getById(id);
    }

    static getAll(filters = {}) {
        const db = dbManager.getDb();
        let query = \`SELECT j.*, p.name as project_name FROM jobs j LEFT JOIN projects p ON j.project_id = p.id WHERE 1=1\`;
        const params = [];
        if (filters.project_id) { query += ' AND j.project_id = ?'; params.push(filters.project_id); }
        if (filters.status) { query += ' AND j.status = ?'; params.push(filters.status); }
        if (filters.type) { query += ' AND j.type = ?'; params.push(filters.type); }
        query += ' ORDER BY j.created_at DESC';
        if (filters.limit) { query += ' LIMIT ?'; params.push(filters.limit); }
        if (filters.offset) { query += ' OFFSET ?'; params.push(filters.offset); }
        return db.prepare(query).all(...params);
    }

    static getById(id) {
        return dbManager.getDb().prepare('SELECT * FROM jobs WHERE id = ?').get(id);
    }

    static getWithLogs(id) {
        const job = this.getById(id);
        if (!job) return null;
        const logs = dbManager.getDb().prepare(\`SELECT * FROM job_logs WHERE job_id = ? ORDER BY created_at ASC\`).all(id);
        return { ...job, logs };
    }

    static updateStatus(id, status, result = null) {
        const db = dbManager.getDb();
        const now = new Date().toISOString();
        let query = 'UPDATE jobs SET status = ?, updated_at = ?';
        const params = [status, now];
        if (status === 'running' && !this.getById(id).started_at) {
            query += ', started_at = ?'; params.push(now);
        }
        if (status === 'success' || status === 'failed') {
            query += ', completed_at = ?'; params.push(now);
        }
        if (result) { query += ', output_result = ?'; params.push(JSON.stringify(result)); }
        query += ' WHERE id = ?'; params.push(id);
        db.prepare(query).run(...params);
        return this.getById(id);
    }

    static addLog(jobId, level, message, metadata = {}) {
        const db = dbManager.getDb();
        db.prepare(\`INSERT INTO job_logs (id, job_id, level, message, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?)\`)
            .run(uuidv4(), jobId, level, message, JSON.stringify(metadata), new Date().toISOString());
    }

    static cancel(id) { return this.updateStatus(id, 'cancelled'); }
}

module.exports = Job;
EOF

log_success "Job.js installé"

# Version.js
cat > backend/models/Version.js << 'EOF'
const { v4: uuidv4 } = require('uuid');
const dbManager = require('../database/db');

class Version {
    static create(data) {
        const db = dbManager.getDb();
        const id = uuidv4();
        db.prepare(\`INSERT INTO versions (id, project_id, label, description, parent_version_id, created_at) VALUES (?, ?, ?, ?, ?, ?)\`)
            .run(id, data.project_id, data.label, data.description || null, data.parent_version_id || null, new Date().toISOString());
        return this.getById(id);
    }

    static getAll(projectId) {
        return dbManager.getDb().prepare(\`SELECT * FROM versions WHERE project_id = ? ORDER BY created_at DESC\`).all(projectId);
    }

    static getById(id) {
        return dbManager.getDb().prepare('SELECT * FROM versions WHERE id = ?').get(id);
    }

    static getFiles(versionId) {
        return dbManager.getDb().prepare(\`SELECT * FROM version_files WHERE version_id = ? ORDER BY file_path\`).all(versionId);
    }

    static markAsStable(id) {
        const db = dbManager.getDb();
        const version = this.getById(id);
        if (!version) throw new Error('Version not found');
        db.prepare(\`UPDATE versions SET is_stable = 0 WHERE project_id = ? AND id != ?\`).run(version.project_id, id);
        db.prepare('UPDATE versions SET is_stable = 1 WHERE id = ?').run(id);
        db.prepare('UPDATE projects SET stable_version_id = ? WHERE id = ?').run(id, version.project_id);
        return this.getById(id);
    }

    static delete(id) {
        const db = dbManager.getDb();
        db.prepare('DELETE FROM version_files WHERE version_id = ?').run(id);
        db.prepare('DELETE FROM versions WHERE id = ?').run(id);
    }

    static generateNextLabel(projectId) {
        const db = dbManager.getDb();
        const lastVersion = db.prepare(\`SELECT label FROM versions WHERE project_id = ? ORDER BY created_at DESC LIMIT 1\`).get(projectId);
        if (!lastVersion) return 'v1.0.0';
        const match = lastVersion.label.match(/v(\d+)\.(\d+)\.(\d+)/);
        if (match) {
            const [, major, minor, patch] = match;
            return \`v\${major}.\${minor}.\${parseInt(patch) + 1}\`;
        }
        return 'v1.0.0';
    }
}

module.exports = Version;
EOF

log_success "Version.js installé"

# JobExecutorService.js
cat > backend/services/JobExecutorService.js << 'EOF'
const Job = require('../models/Job');

class JobExecutorService {
    constructor() { this.runningJobs = new Map(); }

    async executeJobAsync(jobId) {
        setImmediate(() => {
            this.executeJob(jobId).catch(error => {
                console.error(\`Job \${jobId} execution failed:\`, error);
                Job.updateStatus(jobId, 'failed', { error: error.message });
            });
        });
    }

    async executeJob(jobId) {
        try {
            const job = Job.getById(jobId);
            if (!job) throw new Error('Job not found');
            Job.updateStatus(jobId, 'running');
            Job.addLog(jobId, 'info', 'Job execution started');
            this.runningJobs.set(jobId, { status: 'running', startedAt: Date.now() });
            await this.processJob(job);
            Job.updateStatus(jobId, 'success', { message: 'Job completed successfully', processed_at: new Date().toISOString() });
            Job.addLog(jobId, 'info', 'Job execution completed successfully');
            this.runningJobs.delete(jobId);
        } catch (error) {
            console.error(\`Error executing job \${jobId}:\`, error);
            Job.updateStatus(jobId, 'failed', { error: error.message });
            Job.addLog(jobId, 'error', \`Job execution failed: \${error.message}\`);
            this.runningJobs.delete(jobId);
            throw error;
        }
    }

    async processJob(job) {
        Job.addLog(job.id, 'info', \`Processing \${job.type} job\`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        const actions = {
            debug: 'Analyzing code for bugs',
            patch: 'Generating patch',
            refactor: 'Refactoring code',
            generate: 'Generating new code',
            review: 'Reviewing code quality'
        };
        if (actions[job.type]) {
            Job.addLog(job.id, 'info', \`\${actions[job.type]}...\`);
            await new Promise(resolve => setTimeout(resolve, 1500));
            Job.addLog(job.id, 'info', \`\${actions[job.type]} complete\`);
        }
    }

    getRunningJobs() {
        return Array.from(this.runningJobs.entries()).map(([id, data]) => ({ id, ...data }));
    }

    isJobRunning(jobId) { return this.runningJobs.has(jobId); }
}

const jobExecutor = new JobExecutorService();
module.exports = jobExecutor;
EOF

log_success "JobExecutorService.js installé"

log_success "Backend complet installé ✅"
echo ""

# ========== FRONTEND FILES ==========

log_info "Installation du frontend..."

# CSS global
cat > frontend/css/style.css << 'EOF'
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #000000;
    color: #ffffff;
    min-height: 100vh;
}

.container { max-width: 1400px; margin: 0 auto; padding: 20px; }

.header {
    margin-bottom: 40px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(138, 253, 129, 0.2);
}

.header h1 {
    font-size: 32px;
    font-weight: 700;
    color: #8afd81;
    margin-bottom: 8px;
}

.header p { color: #888; font-size: 14px; }

.nav {
    display: flex;
    gap: 20px;
    margin-bottom: 30px;
}

.nav a {
    color: #888;
    text-decoration: none;
    padding: 10px 20px;
    border-radius: 8px;
    transition: all 0.2s;
}

.nav a:hover, .nav a.active {
    background: rgba(138, 253, 129, 0.1);
    color: #8afd81;
}

.card {
    background: rgba(138, 253, 129, 0.05);
    border: 1px solid rgba(138, 253, 129, 0.2);
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 20px;
}

.btn {
    background: #8afd81;
    color: #000000;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn:hover {
    background: #7bed7f;
    transform: translateY(-2px);
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

table th {
    text-align: left;
    padding: 12px;
    color: #8afd81;
    border-bottom: 1px solid rgba(138, 253, 129, 0.2);
}

table td {
    padding: 12px;
    border-bottom: 1px solid rgba(138, 253, 129, 0.1);
}

.loading { text-align: center; padding: 60px 20px; color: #888; }
.error { background: rgba(255, 77, 77, 0.1); border: 1px solid rgba(255, 77, 77, 0.3); border-radius: 12px; padding: 20px; color: #ff4d4d; }
EOF

log_success "style.css installé"

# Dashboard index.html
cat > frontend/index.html << 'EOF'
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - HearstAI</title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 HearstAI Cockpit</h1>
            <p>Claude CI/CD Management Dashboard</p>
        </div>

        <nav class="nav">
            <a href="/" class="active">Dashboard</a>
            <a href="/projects.html">Projects</a>
            <a href="/jobs.html">Jobs</a>
            <a href="/electricity.html">Electricity</a>
        </nav>

        <div class="grid" id="stats-grid">
            <div class="card">
                <h3>Total Projects</h3>
                <p id="total-projects" style="font-size: 36px; color: #8afd81;">-</p>
            </div>
            <div class="card">
                <h3>Total Jobs</h3>
                <p id="total-jobs" style="font-size: 36px; color: #8afd81;">-</p>
            </div>
            <div class="card">
                <h3>Running Jobs</h3>
                <p id="running-jobs" style="font-size: 36px; color: #8afd81;">-</p>
            </div>
            <div class="card">
                <h3>Success Rate</h3>
                <p id="success-rate" style="font-size: 36px; color: #8afd81;">-</p>
            </div>
        </div>

        <div class="card" style="margin-top: 30px;">
            <h2 style="color: #8afd81; margin-bottom: 20px;">Recent Activity</h2>
            <div id="recent-activity">Loading...</div>
        </div>
    </div>

    <script>
        const API_URL = 'http://localhost:4000/api';

        async function loadDashboard() {
            try {
                const stats = await fetch(\`\${API_URL}/stats\`).then(r => r.json());
                document.getElementById('total-projects').textContent = stats.stats.total_projects;
                document.getElementById('total-jobs').textContent = stats.stats.total_jobs;
                document.getElementById('running-jobs').textContent = stats.stats.jobs_running;
                document.getElementById('success-rate').textContent = 
                    (stats.stats.jobs_success_rate * 100).toFixed(1) + '%';

                const jobs = await fetch(\`\${API_URL}/jobs?limit=5\`).then(r => r.json());
                const activityHTML = jobs.jobs.map(job => \`
                    <div style="padding: 10px; border-bottom: 1px solid rgba(138, 253, 129, 0.1);">
                        <strong>\${job.project_name}</strong> - \${job.type} - 
                        <span style="color: \${job.status === 'success' ? '#8afd81' : '#ff4d4d'}">
                            \${job.status}
                        </span>
                    </div>
                \`).join('');
                document.getElementById('recent-activity').innerHTML = activityHTML || 'No recent activity';
            } catch (error) {
                console.error('Error loading dashboard:', error);
            }
        }

        loadDashboard();
        setInterval(loadDashboard, 10000);
    </script>
</body>
</html>
EOF

log_success "index.html (Dashboard) installé"

# Projects page
cat > frontend/projects.html << 'EOF'
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Projects - HearstAI</title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📁 Projects</h1>
            <p>Manage your Claude AI projects</p>
        </div>

        <nav class="nav">
            <a href="/">Dashboard</a>
            <a href="/projects.html" class="active">Projects</a>
            <a href="/jobs.html">Jobs</a>
            <a href="/electricity.html">Electricity</a>
        </nav>

        <button class="btn" onclick="alert('Create project modal - Coming soon')">+ New Project</button>

        <div class="card" style="margin-top: 20px;">
            <table id="projects-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Created</th>
                    </tr>
                </thead>
                <tbody id="projects-body">
                    <tr><td colspan="4" style="text-align:center;">Loading...</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <script>
        const API_URL = 'http://localhost:4000/api';

        async function loadProjects() {
            try {
                const data = await fetch(\`\${API_URL}/projects\`).then(r => r.json());
                const tbody = document.getElementById('projects-body');
                if (data.projects.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No projects yet</td></tr>';
                    return;
                }
                tbody.innerHTML = data.projects.map(p => \`
                    <tr>
                        <td><strong>\${p.name}</strong></td>
                        <td>\${p.type}</td>
                        <td><span style="color: #8afd81">\${p.status}</span></td>
                        <td>\${new Date(p.created_at).toLocaleDateString()}</td>
                    </tr>
                \`).join('');
            } catch (error) {
                console.error('Error loading projects:', error);
            }
        }

        loadProjects();
    </script>
</body>
</html>
EOF

log_success "projects.html installé"

# Jobs page
cat > frontend/jobs.html << 'EOF'
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jobs - HearstAI</title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚙️ Jobs</h1>
            <p>Monitor Claude AI execution jobs</p>
        </div>

        <nav class="nav">
            <a href="/">Dashboard</a>
            <a href="/projects.html">Projects</a>
            <a href="/jobs.html" class="active">Jobs</a>
            <a href="/electricity.html">Electricity</a>
        </nav>

        <button class="btn" onclick="alert('Create job modal - Coming soon')">+ New Job</button>

        <div class="card" style="margin-top: 20px;">
            <table id="jobs-table">
                <thead>
                    <tr>
                        <th>Project</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Created</th>
                    </tr>
                </thead>
                <tbody id="jobs-body">
                    <tr><td colspan="4" style="text-align:center;">Loading...</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <script>
        const API_URL = 'http://localhost:4000/api';

        async function loadJobs() {
            try {
                const data = await fetch(\`\${API_URL}/jobs\`).then(r => r.json());
                const tbody = document.getElementById('jobs-body');
                if (data.jobs.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No jobs yet</td></tr>';
                    return;
                }
                tbody.innerHTML = data.jobs.map(j => \`
                    <tr>
                        <td><strong>\${j.project_name || 'Unknown'}</strong></td>
                        <td>\${j.type}</td>
                        <td><span style="color: \${j.status === 'success' ? '#8afd81' : j.status === 'failed' ? '#ff4d4d' : '#ffa500'}">\${j.status}</span></td>
                        <td>\${new Date(j.created_at).toLocaleString()}</td>
                    </tr>
                \`).join('');
            } catch (error) {
                console.error('Error loading jobs:', error);
            }
        }

        loadJobs();
        setInterval(loadJobs, 5000);
    </script>
</body>
</html>
EOF

log_success "jobs.html installé"

log_success "Frontend complet installé ✅"
echo ""

log_success "🎉 Installation TERMINÉE !"
echo ""
log_info "Redémarre le serveur avec : npm run backend"
log_info "Puis ouvre : http://localhost:4000"

