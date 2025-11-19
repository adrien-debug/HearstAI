// Projects Routes
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

/**
 * GET /api/projects
 * Get all projects
 */
router.get('/', (req, res) => {
    try {
        const filters = {
            status: req.query.status,
            type: req.query.type
        };

        const projects = Project.getAll(filters);
        
        res.json({ projects });
    } catch (error) {
        console.error('Error getting projects:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/projects
 * Create new project
 */
router.post('/', (req, res) => {
    try {
        const { name, description, type, repo_type, repo_url, repo_branch, local_path } = req.body;

        // Validation
        if (!name || !type || !repo_type) {
            return res.status(400).json({ 
                error: 'Missing required fields: name, type, repo_type' 
            });
        }

        const validTypes = ['html_static', 'spa', 'dashboard', 'nodejs_app', 'other'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ 
                error: `Invalid type. Must be one of: ${validTypes.join(', ')}` 
            });
        }

        const validRepoTypes = ['local', 'github'];
        if (!validRepoTypes.includes(repo_type)) {
            return res.status(400).json({ 
                error: `Invalid repo_type. Must be one of: ${validRepoTypes.join(', ')}` 
            });
        }

        const project = Project.create({
            name,
            description,
            type,
            repo_type,
            repo_url,
            repo_branch,
            local_path
        });

        res.status(201).json({ project });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/projects/:id
 * Get project by ID with details
 */
router.get('/:id', (req, res) => {
    try {
        const project = Project.getWithDetails(req.params.id);
        
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json({ project });
    } catch (error) {
        console.error('Error getting project:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * PUT /api/projects/:id
 * Update project
 */
router.put('/:id', (req, res) => {
    try {
        const project = Project.update(req.params.id, req.body);
        
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json({ project });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/projects/:id
 * Archive project (soft delete)
 */
router.delete('/:id', (req, res) => {
    try {
        const project = Project.delete(req.params.id);
        
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/projects/:id/rollback
 * Rollback to a specific version
 */
router.post('/:id/rollback', (req, res) => {
    try {
        const { version_id } = req.body;

        if (!version_id) {
            return res.status(400).json({ error: 'version_id is required' });
        }

        const project = Project.update(req.params.id, {
            stable_version_id: version_id
        });

        res.json({ 
            project,
            message: 'Project rolled back successfully'
        });
    } catch (error) {
        console.error('Error rolling back project:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
