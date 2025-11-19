// Prompts Routes - PLACEHOLDER
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // TODO: Implement prompts listing
    res.json({ prompts: [] });
});

router.post('/', (req, res) => {
    // TODO: Implement prompt creation
    res.status(201).json({ message: 'Coming soon' });
});

module.exports = router;
