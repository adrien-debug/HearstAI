const { v4: uuidv4 } = require('uuid');
const dbManager = require('../database/db');

class Project {
    static create(data) {
        const db = dbManager.getDb();
        const id = uuidv4();
        const now = new Date().toISOString();
        const stmt = db.prepare(`
            INSERT INTO projects (id, name, description, type, repo_type, 
                repo_url, repo_branch, local_path, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
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
        const versions = db.prepare(`SELECT * FROM versions WHERE project_id = ? ORDER BY created_at DESC`).all(id);
        const jobs = db.prepare(`SELECT * FROM jobs WHERE project_id = ? ORDER BY created_at DESC LIMIT 10`).all(id);
        return { ...project, versions, jobs };
    }

    static update(id, data) {
        const db = dbManager.getDb();
        const fields = [], params = [];
        const allowedFields = ['name', 'description', 'type', 'status', 'repo_url', 'repo_branch', 'local_path', 'stable_version_id'];
        allowedFields.forEach(field => {
            if (data[field] !== undefined) {
                fields.push(`${field} = ?`);
                params.push(data[field]);
            }
        });
        if (fields.length === 0) return this.getById(id);
        fields.push('updated_at = ?');
        params.push(new Date().toISOString());
        params.push(id);
        db.prepare(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`).run(...params);
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
