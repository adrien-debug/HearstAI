const { v4: uuidv4 } = require('uuid');
const dbManager = require('../database/db');

class Version {
    static create(data) {
        const db = dbManager.getDb();
        const id = uuidv4();
        db.prepare(`INSERT INTO versions (id, project_id, label, description, parent_version_id, created_at) VALUES (?, ?, ?, ?, ?, ?)`)
            .run(id, data.project_id, data.label, data.description || null, data.parent_version_id || null, new Date().toISOString());
        return this.getById(id);
    }

    static getAll(projectId) {
        return dbManager.getDb().prepare(`SELECT * FROM versions WHERE project_id = ? ORDER BY created_at DESC`).all(projectId);
    }

    static getById(id) {
        return dbManager.getDb().prepare('SELECT * FROM versions WHERE id = ?').get(id);
    }

    static getFiles(versionId) {
        return dbManager.getDb().prepare(`SELECT * FROM version_files WHERE version_id = ? ORDER BY file_path`).all(versionId);
    }

    static markAsStable(id) {
        const db = dbManager.getDb();
        const version = this.getById(id);
        if (!version) throw new Error('Version not found');
        db.prepare(`UPDATE versions SET is_stable = 0 WHERE project_id = ? AND id != ?`).run(version.project_id, id);
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
        const lastVersion = db.prepare(`SELECT label FROM versions WHERE project_id = ? ORDER BY created_at DESC LIMIT 1`).get(projectId);
        if (!lastVersion) return 'v1.0.0';
        const match = lastVersion.label.match(/v(\d+)\.(\d+)\.(\d+)/);
        if (match) {
            const [, major, minor, patch] = match;
            return `v${major}.${minor}.${parseInt(patch) + 1}`;
        }
        return 'v1.0.0';
    }
}

module.exports = Version;
