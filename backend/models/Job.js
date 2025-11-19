const { v4: uuidv4 } = require('uuid');
const dbManager = require('../database/db');

class Job {
    static create(data) {
        const db = dbManager.getDb();
        const id = uuidv4();
        const now = new Date().toISOString();
        db.prepare(`INSERT INTO jobs (id, project_id, type, status, input_prompt, prompt_profile_id, context_data, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
            .run(id, data.project_id, data.type, 'pending', data.input_prompt, data.prompt_profile_id || null, JSON.stringify(data.context_data || {}), JSON.stringify(data.metadata || {}), now);
        return this.getById(id);
    }

    static getAll(filters = {}) {
        const db = dbManager.getDb();
        let query = `SELECT j.*, p.name as project_name FROM jobs j LEFT JOIN projects p ON j.project_id = p.id WHERE 1=1`;
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
        const logs = dbManager.getDb().prepare(`SELECT * FROM job_logs WHERE job_id = ? ORDER BY created_at ASC`).all(id);
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
        db.prepare(`INSERT INTO job_logs (id, job_id, level, message, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?)`)
            .run(uuidv4(), jobId, level, message, JSON.stringify(metadata), new Date().toISOString());
    }

    static cancel(id) { return this.updateStatus(id, 'cancelled'); }
}

module.exports = Job;
