// Jobs Routes
const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const jobExecutor = require('../services/JobExecutorService');

/**
 * GET /api/jobs
 * Get all jobs with filters
 */
router.get('/', (req, res) => {
    try {
        const filters = {
            project_id: req.query.project_id,
            status: req.query.status,
            type: req.query.type,
            limit: parseInt(req.query.limit) || 50,
            offset: parseInt(req.query.offset) || 0
        };

        const jobs = Job.getAll(filters);
        
        // Format jobs for frontend
        const formattedJobs = jobs.map(job => ({
            ...job,
            project: {
                id: job.project_id,
                name: job.project_name
            },
            context_data: JSON.parse(job.context_data || '{}'),
            metadata: JSON.parse(job.metadata || '{}')
        }));

        res.json({ 
            jobs: formattedJobs,
            total: formattedJobs.length
        });
    } catch (error) {
        console.error('Error getting jobs:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/jobs
 * Create and execute new job
 */
router.post('/', async (req, res) => {
    try {
        const { project_id, type, prompt_profile_id, context_data, input_prompt } = req.body;

        // Validation
        if (!project_id || !type || !input_prompt) {
            return res.status(400).json({ 
                error: 'Missing required fields: project_id, type, input_prompt' 
            });
        }

        const validTypes = ['debug', 'patch', 'refactor', 'generate', 'review'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ 
                error: `Invalid type. Must be one of: ${validTypes.join(', ')}` 
            });
        }

        const job = Job.create({
            project_id,
            type,
            prompt_profile_id,
            context_data,
            input_prompt
        });

        // Execute job in background
        console.log(`🚀 Executing job ${job.id} in background...`);
        jobExecutor.executeJobAsync(job.id);
        
        res.status(202).json({ 
            job: {
                ...job,
                context_data: JSON.parse(job.context_data),
                metadata: JSON.parse(job.metadata)
            },
            message: 'Job created and queued for execution'
        });
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/jobs/:id
 * Get job details with logs
 */
router.get('/:id', (req, res) => {
    try {
        const job = Job.getWithLogs(req.params.id);
        
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        res.json({ 
            job: {
                ...job,
                context_data: JSON.parse(job.context_data || '{}'),
                metadata: JSON.parse(job.metadata || '{}'),
                logs: job.logs.map(log => ({
                    ...log,
                    metadata: JSON.parse(log.metadata || '{}')
                }))
            }
        });
    } catch (error) {
        console.error('Error getting job:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/jobs/:id
 * Cancel job
 */
router.delete('/:id', (req, res) => {
    try {
        const job = Job.cancel(req.params.id);
        
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        res.json({ 
            job,
            message: 'Job cancelled successfully'
        });
    } catch (error) {
        console.error('Error cancelling job:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
