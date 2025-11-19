// Logs Routes
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ logs: [] });
});

module.exports = router;
