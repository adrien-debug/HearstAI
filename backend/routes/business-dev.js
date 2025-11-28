// Business Development Contacts Routes
const express = require('express');
const router = express.Router();
const dbManager = require('../database/db');

/**
 * GET /api/business-dev/contacts
 * Get all contacts with filters
 */
router.get('/contacts', (req, res) => {
    try {
        const db = dbManager.getDb();
        if (!db) {
            return res.status(500).json({ 
                error: 'Database not initialized',
                contacts: []
            });
        }

        const status = req.query.status;
        const search = req.query.search;
        const limit = parseInt(req.query.limit) || 100;
        const offset = parseInt(req.query.offset) || 0;

        let query = 'SELECT * FROM business_dev_contacts WHERE 1=1';
        const params = [];

        if (status && ['active', 'pending', 'inactive'].includes(status)) {
            query += ' AND status = ?';
            params.push(status);
        }

        if (search) {
            query += ' AND (name LIKE ? OR company LIKE ? OR email LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const contacts = db.prepare(query).all(...params);

        // Count total
        let countQuery = 'SELECT COUNT(*) as total FROM business_dev_contacts WHERE 1=1';
        const countParams = [];
        
        if (status && ['active', 'pending', 'inactive'].includes(status)) {
            countQuery += ' AND status = ?';
            countParams.push(status);
        }

        if (search) {
            countQuery += ' AND (name LIKE ? OR company LIKE ? OR email LIKE ?)';
            const searchTerm = `%${search}%`;
            countParams.push(searchTerm, searchTerm, searchTerm);
        }

        const totalResult = db.prepare(countQuery).get(...countParams);
        const total = totalResult?.total || 0;

        res.json({
            contacts: contacts || [],
            count: contacts?.length || 0,
            total: total,
            limit,
            offset
        });
    } catch (error) {
        console.error('[Business Dev] Error getting contacts:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la récupération des contacts',
            details: error.message,
            contacts: []
        });
    }
});

/**
 * GET /api/business-dev/contacts/:id
 * Get contact by ID
 */
router.get('/contacts/:id', (req, res) => {
    try {
        const db = dbManager.getDb();
        if (!db) {
            return res.status(500).json({ 
                error: 'Database not initialized'
            });
        }

        const contact = db.prepare('SELECT * FROM business_dev_contacts WHERE id = ?').get(req.params.id);

        if (!contact) {
            return res.status(404).json({ error: 'Contact non trouvé' });
        }

        res.json({ contact });
    } catch (error) {
        console.error('[Business Dev] Error getting contact:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la récupération du contact',
            details: error.message
        });
    }
});

/**
 * POST /api/business-dev/contacts
 * Create new contact
 */
router.post('/contacts', (req, res) => {
    try {
        const db = dbManager.getDb();
        if (!db) {
            return res.status(500).json({ 
                error: 'Database not initialized'
            });
        }

        const { name, company, email, phone, status, estimatedValue, notes } = req.body;

        // Validation
        if (!name || !company || !email) {
            return res.status(400).json({
                error: 'Le nom, l\'entreprise et l\'email sont requis'
            });
        }

        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Format d\'email invalide'
            });
        }

        // Validation statut
        if (status && !['active', 'pending', 'inactive'].includes(status)) {
            return res.status(400).json({
                error: 'Statut invalide (doit être: active, pending ou inactive)'
            });
        }

        // Vérifier si l'email existe déjà
        const existing = db.prepare('SELECT * FROM business_dev_contacts WHERE email = ?').get(email.toLowerCase());
        if (existing) {
            return res.status(409).json({
                error: 'Un contact avec cet email existe déjà'
            });
        }

        // Créer le contact
        const id = `bd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const now = new Date().toISOString();

        db.prepare(`
            INSERT INTO business_dev_contacts 
            (id, name, company, email, phone, status, estimated_value, last_contact, notes, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            id,
            name.trim(),
            company.trim(),
            email.toLowerCase().trim(),
            phone?.trim() || null,
            status || 'pending',
            estimatedValue?.trim() || null,
            now,
            notes?.trim() || null,
            now,
            now
        );

        const contact = db.prepare('SELECT * FROM business_dev_contacts WHERE id = ?').get(id);

        res.status(201).json({ contact });
    } catch (error) {
        console.error('[Business Dev] Error creating contact:', error);
        res.status(500).json({
            error: 'Erreur lors de la création du contact',
            details: error.message
        });
    }
});

/**
 * PUT /api/business-dev/contacts/:id
 * Update contact
 */
router.put('/contacts/:id', (req, res) => {
    try {
        const db = dbManager.getDb();
        if (!db) {
            return res.status(500).json({ 
                error: 'Database not initialized'
            });
        }

        const { id } = req.params;
        const { name, company, email, phone, status, estimatedValue, notes, lastContact } = req.body;

        // Vérifier que le contact existe
        const existing = db.prepare('SELECT * FROM business_dev_contacts WHERE id = ?').get(id);
        if (!existing) {
            return res.status(404).json({ error: 'Contact non trouvé' });
        }

        // Validation email si fourni
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    error: 'Format d\'email invalide'
                });
            }

            // Vérifier si l'email est déjà utilisé par un autre contact
            const emailExists = db.prepare('SELECT * FROM business_dev_contacts WHERE email = ? AND id != ?').get(email.toLowerCase(), id);
            if (emailExists) {
                return res.status(409).json({
                    error: 'Cet email est déjà utilisé par un autre contact'
                });
            }
        }

        // Validation statut si fourni
        if (status && !['active', 'pending', 'inactive'].includes(status)) {
            return res.status(400).json({
                error: 'Statut invalide'
            });
        }

        // Construire la requête de mise à jour
        const updates = [];
        const values = [];

        if (name !== undefined) {
            updates.push('name = ?');
            values.push(name.trim());
        }
        if (company !== undefined) {
            updates.push('company = ?');
            values.push(company.trim());
        }
        if (email !== undefined) {
            updates.push('email = ?');
            values.push(email.toLowerCase().trim());
        }
        if (phone !== undefined) {
            updates.push('phone = ?');
            values.push(phone?.trim() || null);
        }
        if (status !== undefined) {
            updates.push('status = ?');
            values.push(status);
        }
        if (estimatedValue !== undefined) {
            updates.push('estimated_value = ?');
            values.push(estimatedValue?.trim() || null);
        }
        if (notes !== undefined) {
            updates.push('notes = ?');
            values.push(notes?.trim() || null);
        }
        if (lastContact !== undefined) {
            updates.push('last_contact = ?');
            values.push(new Date(lastContact).toISOString());
        }

        updates.push('updated_at = ?');
        values.push(new Date().toISOString());
        values.push(id);

        const query = `UPDATE business_dev_contacts SET ${updates.join(', ')} WHERE id = ?`;
        db.prepare(query).run(...values);

        const contact = db.prepare('SELECT * FROM business_dev_contacts WHERE id = ?').get(id);

        res.json({ contact });
    } catch (error) {
        console.error('[Business Dev] Error updating contact:', error);
        res.status(500).json({
            error: 'Erreur lors de la mise à jour du contact',
            details: error.message
        });
    }
});

/**
 * DELETE /api/business-dev/contacts/:id
 * Delete contact
 */
router.delete('/contacts/:id', (req, res) => {
    try {
        const db = dbManager.getDb();
        if (!db) {
            return res.status(500).json({ 
                error: 'Database not initialized'
            });
        }

        const { id } = req.params;

        // Vérifier que le contact existe
        const existing = db.prepare('SELECT * FROM business_dev_contacts WHERE id = ?').get(id);
        if (!existing) {
            return res.status(404).json({ error: 'Contact non trouvé' });
        }

        // Supprimer le contact
        db.prepare('DELETE FROM business_dev_contacts WHERE id = ?').run(id);

        res.json({
            message: 'Contact supprimé avec succès',
            id
        });
    } catch (error) {
        console.error('[Business Dev] Error deleting contact:', error);
        res.status(500).json({
            error: 'Erreur lors de la suppression du contact',
            details: error.message
        });
    }
});

module.exports = router;

