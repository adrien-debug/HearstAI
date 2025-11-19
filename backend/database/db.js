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
        this.db.exec(`
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
        `);
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
