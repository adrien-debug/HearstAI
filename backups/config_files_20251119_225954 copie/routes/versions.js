// Versions Routes
const express = require('express');
const router = express.Router();
const Version = require('../models/Version');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const upload = multer({
    dest: '/tmp/uploads/',
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max
    }
});

/**
 * GET /api/versions
 * Get all versions for a project
 */
router.get('/', (req, res) => {
    try {
        const { project_id } = req.query;
        
        if (!project_id) {
            return res.status(400).json({ error: 'project_id is required' });
        }

        const versions = Version.getAll(project_id);
        
        res.json({ versions });
    } catch (error) {
        console.error('Error getting versions:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/versions/:id
 * Get version details with files
 */
router.get('/:id', (req, res) => {
    try {
        const version = Version.getById(req.params.id);
        
        if (!version) {
            return res.status(404).json({ error: 'Version not found' });
        }

        const files = Version.getFiles(req.params.id);
        
        res.json({ 
            version: {
                ...version,
                files
            }
        });
    } catch (error) {
        console.error('Error getting version:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/versions
 * Create new version
 */
router.post('/', (req, res) => {
    try {
        const { project_id, label, description, parent_version_id } = req.body;

        if (!project_id) {
            return res.status(400).json({ error: 'project_id is required' });
        }

        // Generate label if not provided
        const versionLabel = label || Version.generateNextLabel(project_id);

        const version = Version.create({
            project_id,
            label: versionLabel,
            description,
            parent_version_id
        });

        res.status(201).json({ version });
    } catch (error) {
        console.error('Error creating version:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/versions/:id/stable
 * Mark version as stable
 */
router.post('/:id/stable', (req, res) => {
    try {
        const version = Version.markAsStable(req.params.id);
        
        res.json({ 
            version,
            message: 'Version marked as stable'
        });
    } catch (error) {
        console.error('Error marking version as stable:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/versions/:id
 * Delete version
 */
router.delete('/:id', (req, res) => {
    try {
        Version.delete(req.params.id);
        
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting version:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
