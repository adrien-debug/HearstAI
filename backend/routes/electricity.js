// Electricity Route - Mining Dashboard
const express = require('express');
const router = express.Router();

/**
 * GET /api/electricity
 * Get electricity/mining data
 */
router.get('/', (req, res) => {
    try {
        // Demo data - à remplacer par tes vraies données
        const electricityData = {
            current_power: 2450, // Watts
            daily_consumption: 58.8, // kWh
            monthly_consumption: 1764, // kWh
            cost_per_kwh: 0.12,
            daily_cost: 7.06,
            monthly_cost: 211.68,
            miners: [
                {
                    id: 1,
                    name: 'Miner #1',
                    status: 'active',
                    hashrate: '95 TH/s',
                    power: 3250,
                    temp: 65
                },
                {
                    id: 2,
                    name: 'Miner #2',
                    status: 'active',
                    hashrate: '92 TH/s',
                    power: 3180,
                    temp: 68
                }
            ],
            timestamp: new Date().toISOString()
        };

        res.json(electricityData);
    } catch (error) {
        console.error('Error getting electricity data:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
