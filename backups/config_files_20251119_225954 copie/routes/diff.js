// Diff Routes
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ diff: null });
});

module.exports = router;
