// Calculator Routes
// Routes API complètes pour la calculatrice de profitabilité

const express = require('express');
const router = express.Router();
const hashpriceLite = require('../services/hashpriceLite');

/**
 * GET /api/calculator/metrics
 * Récupère les métriques Bitcoin temps réel
 */
router.get('/metrics', async (req, res) => {
    try {
        const metrics = await hashpriceLite.fetchBitcoinMetrics();
        res.json({
            success: true,
            data: metrics
        });
    } catch (error) {
        console.error('Error fetching calculator metrics:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * POST /api/calculator/calculate
 * Calcule la profitabilité avec les paramètres fournis
 * Body: { hashrate, power, electricity, equipmentCost? }
 */
router.post('/calculate', async (req, res) => {
    try {
        const { hashrate, power, electricity, equipmentCost } = req.body;
        
        // Validation
        if (!hashrate || !power || !electricity) {
            return res.status(400).json({
                success: false,
                error: 'hashrate, power et electricity sont requis'
            });
        }
        
        // Récupérer les métriques actuelles
        const metrics = await hashpriceLite.fetchBitcoinMetrics();
        
        if (!metrics.hashpriceTH || metrics.hashpriceTH === 0) {
            return res.status(500).json({
                success: false,
                error: 'Hashprice non disponible'
            });
        }
        
        // Calculer la profitabilité
        const profitability = hashpriceLite.calculateProfitability(
            parseFloat(hashrate),
            parseFloat(power),
            parseFloat(electricity),
            metrics.hashpriceTH
        );
        
        // Calculer ROI si equipmentCost fourni
        let roi = null;
        if (equipmentCost && parseFloat(equipmentCost) > 0) {
            roi = hashpriceLite.calculateROI(
                parseFloat(equipmentCost),
                profitability.daily.profit
            );
        }
        
        res.json({
            success: true,
            data: {
                metrics,
                profitability,
                roi
            }
        });
    } catch (error) {
        console.error('Error calculating profitability:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * GET /api/calculator/projection
 * Génère une projection sur N mois
 * Query: months (défaut: 12), hashrate, power, electricity, equipmentCost?
 */
router.get('/projection', async (req, res) => {
    try {
        const months = parseInt(req.query.months) || 12;
        const hashrate = parseFloat(req.query.hashrate);
        const power = parseFloat(req.query.power);
        const electricity = parseFloat(req.query.electricity);
        const equipmentCost = req.query.equipmentCost ? parseFloat(req.query.equipmentCost) : null;
        
        if (!hashrate || !power || !electricity) {
            return res.status(400).json({
                success: false,
                error: 'hashrate, power et electricity sont requis'
            });
        }
        
        // Récupérer les métriques
        const metrics = await hashpriceLite.fetchBitcoinMetrics();
        
        // Calculer la profitabilité
        const profitability = hashpriceLite.calculateProfitability(
            hashrate,
            power,
            electricity,
            metrics.hashpriceTH
        );
        
        // Générer la projection mensuelle
        const projection = [];
        let cumulativeProfit = equipmentCost ? -equipmentCost : 0;
        
        for (let month = 1; month <= months; month++) {
            cumulativeProfit += profitability.monthly.profit;
            projection.push({
                month,
                revenue: profitability.monthly.revenue,
                cost: profitability.monthly.cost,
                profit: profitability.monthly.profit,
                cumulativeProfit: cumulativeProfit,
                roi: equipmentCost ? ((cumulativeProfit / equipmentCost) * 100) : null
            });
        }
        
        res.json({
            success: true,
            data: {
                metrics,
                monthlyProfitability: profitability.monthly,
                projection,
                breakEvenMonth: equipmentCost && profitability.monthly.profit > 0
                    ? Math.ceil(equipmentCost / profitability.monthly.profit)
                    : null
            }
        });
    } catch (error) {
        console.error('Error generating projection:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;

