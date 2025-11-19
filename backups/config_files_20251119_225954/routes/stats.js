// Stats Routes
const express = require('express');
const router = express.Router();
const dbManager = require('../database/db');

/**
 * GET /api/stats
 * Get global statistics
 */
router.get('/', (req, res) => {
    try {
        const db = dbManager.getDb();

        // Total projects
        const totalProjects = db.prepare(
            "SELECT COUNT(*) as count FROM projects WHERE status = 'active'"
        ).get().count;

        // Total versions
        const totalVersions = db.prepare(
            'SELECT COUNT(*) as count FROM versions'
        ).get().count;

        // Total jobs
        const totalJobs = db.prepare(
            'SELECT COUNT(*) as count FROM jobs'
        ).get().count;

        // Jobs running
        const jobsRunning = db.prepare(
            "SELECT COUNT(*) as count FROM jobs WHERE status IN ('pending', 'running')"
        ).get().count;

        // Success rate
        const successfulJobs = db.prepare(
            "SELECT COUNT(*) as count FROM jobs WHERE status = 'success'"
        ).get().count;

        const failedJobs = db.prepare(
            "SELECT COUNT(*) as count FROM jobs WHERE status = 'failed'"
        ).get().count;

        const completedJobs = successfulJobs + failedJobs;
        const successRate = completedJobs > 0 ? successfulJobs / completedJobs : 0;

        // Last 7 days jobs
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const last7DaysJobs = db.prepare(
            "SELECT COUNT(*) as count FROM jobs WHERE created_at >= ?"
        ).get(sevenDaysAgo.toISOString()).count;

        res.json({
            stats: {
                total_projects: totalProjects,
                total_versions: totalVersions,
                total_jobs: totalJobs,
                jobs_running: jobsRunning,
                jobs_success_rate: successRate,
                last_7_days_jobs: last7DaysJobs,
                total_storage_mb: 0 // TODO: Calculate actual storage
            }
        });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
