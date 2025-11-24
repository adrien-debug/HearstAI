// Hashprice Lite Service
// Calcul du hashprice gratuit sans dépendance Luxor API

/**
 * Calcule le hashprice Bitcoin en $/TH/jour
 * @param {number} btcPrice - Prix BTC en USD
 * @param {number} networkHashrate - Hashrate réseau en TH/s
 * @param {number} blockReward - Récompense de bloc en BTC (défaut: 3.125)
 * @param {number} blockTime - Temps de bloc en secondes (défaut: 600 pour Bitcoin)
 * @returns {number} Hashprice en $/TH/jour
 */
function calculateHashprice(btcPrice, networkHashrate, blockReward = 3.125, blockTime = 600) {
    if (!btcPrice || !networkHashrate || networkHashrate === 0) {
        return 0;
    }
    
    // Nombre de blocs par jour
    const blocksPerDay = (24 * 60 * 60) / blockTime; // 144 blocs/jour pour Bitcoin
    
    // Hashprice = Revenus quotidiens du réseau / Hashrate réseau
    // Revenus quotidiens = BTC miné par jour * Prix BTC
    // BTC miné par jour = blocksPerDay * blockReward
    // Hashprice ($/TH/jour) = (blocksPerDay * blockReward * btcPrice) / networkHashrate
    const dailyNetworkBTC = blocksPerDay * blockReward;
    const dailyNetworkRevenue = dailyNetworkBTC * btcPrice;
    const hashprice = dailyNetworkRevenue / networkHashrate;
    
    return hashprice;
}

/**
 * Récupère les métriques Bitcoin depuis une API publique gratuite
 * @returns {Promise<Object>} Métriques BTC (price, hashrate, etc.)
 */
async function fetchBitcoinMetrics() {
    try {
        // Utiliser l'API CoinGecko (gratuite, sans clé API requise)
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
        const data = await response.json();
        
        if (!data.bitcoin) {
            throw new Error('Données Bitcoin non disponibles');
        }
        
        const btcPrice = data.bitcoin.usd;
        
        // Récupérer le hashrate depuis blockchain.info (gratuit)
        let networkHashrate = 0;
        try {
            const hashrateResponse = await fetch('https://blockchain.info/q/hashrate', {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            if (!hashrateResponse.ok) {
                throw new Error(`HTTP ${hashrateResponse.status}`);
            }
            const hashrateText = await hashrateResponse.text();
            const hashrateEH = parseFloat(hashrateText);
            if (isNaN(hashrateEH) || hashrateEH <= 0) {
                throw new Error('Hashrate invalide');
            }
            // Convertir de EH/s en TH/s
            networkHashrate = hashrateEH * 1000000; // 1 EH = 1,000,000 TH
        } catch (error) {
            console.warn('Erreur récupération hashrate, utilisation valeur par défaut:', error.message);
            // Valeur par défaut approximative (environ 600 EH/s = 600,000,000 TH/s)
            // Basé sur le hashrate Bitcoin actuel (novembre 2025)
            networkHashrate = 600000000;
        }
        
        // Calculer le hashprice
        const hashprice = calculateHashprice(btcPrice, networkHashrate);
        
        return {
            btcPrice,
            networkHashrate,
            hashprice,
            hashpriceTH: hashprice, // $/TH/jour
            hashpricePH: hashprice * 1000, // $/PH/jour (1 PH = 1000 TH)
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Erreur récupération métriques Bitcoin:', error);
        // Valeurs par défaut en cas d'erreur
        return {
            btcPrice: 65000,
            networkHashrate: 600000000,
            hashprice: 0,
            hashpriceTH: 0,
            hashpricePH: 0,
            timestamp: new Date().toISOString(),
            error: error.message
        };
    }
}

/**
 * Calcule la profitabilité d'un mineur
 * @param {number} hashrate - Hashrate du mineur en TH/s
 * @param {number} power - Consommation électrique en W
 * @param {number} electricityCost - Coût électricité en $/kWh
 * @param {number} hashprice - Hashprice en $/TH/jour
 * @returns {Object} Résultats de profitabilité
 */
function calculateProfitability(hashrate, power, electricityCost, hashprice) {
    // Revenus quotidiens
    const dailyRevenue = hashrate * hashprice;
    
    // Coûts quotidiens (électricité)
    const powerKW = power / 1000; // Convertir W en kW
    const dailyElectricityCost = powerKW * 24 * electricityCost;
    
    // Profit quotidien
    const dailyProfit = dailyRevenue - dailyElectricityCost;
    
    // Résultats mensuels et annuels
    const monthlyRevenue = dailyRevenue * 30;
    const monthlyCost = dailyElectricityCost * 30;
    const monthlyProfit = dailyProfit * 30;
    
    const yearlyRevenue = dailyRevenue * 365;
    const yearlyCost = dailyElectricityCost * 365;
    const yearlyProfit = dailyProfit * 365;
    
    // ROI et break-even (si coût d'équipement fourni)
    return {
        daily: {
            revenue: dailyRevenue,
            cost: dailyElectricityCost,
            profit: dailyProfit,
            margin: dailyRevenue > 0 ? (dailyProfit / dailyRevenue) * 100 : 0
        },
        monthly: {
            revenue: monthlyRevenue,
            cost: monthlyCost,
            profit: monthlyProfit,
            margin: monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0
        },
        yearly: {
            revenue: yearlyRevenue,
            cost: yearlyCost,
            profit: yearlyProfit,
            margin: yearlyRevenue > 0 ? (yearlyProfit / yearlyRevenue) * 100 : 0
        }
    };
}

/**
 * Calcule le ROI break-even
 * @param {number} equipmentCost - Coût de l'équipement en USD
 * @param {number} dailyProfit - Profit quotidien en USD
 * @returns {Object} Informations ROI
 */
function calculateROI(equipmentCost, dailyProfit) {
    if (!equipmentCost || equipmentCost <= 0) {
        return {
            breakEvenDays: null,
            breakEvenMonths: null,
            roi1Year: null,
            roi2Years: null
        };
    }
    
    if (dailyProfit <= 0) {
        return {
            breakEvenDays: null,
            breakEvenMonths: null,
            roi1Year: (equipmentCost / equipmentCost) * -100, // Perte totale
            roi2Years: null
        };
    }
    
    const breakEvenDays = equipmentCost / dailyProfit;
    const breakEvenMonths = breakEvenDays / 30;
    
    const profit1Year = dailyProfit * 365;
    const roi1Year = ((profit1Year - equipmentCost) / equipmentCost) * 100;
    
    const profit2Years = dailyProfit * 730;
    const roi2Years = ((profit2Years - equipmentCost) / equipmentCost) * 100;
    
    return {
        breakEvenDays: Math.ceil(breakEvenDays),
        breakEvenMonths: breakEvenMonths.toFixed(1),
        roi1Year: roi1Year.toFixed(2),
        roi2Years: roi2Years.toFixed(2)
    };
}

module.exports = {
    calculateHashprice,
    fetchBitcoinMetrics,
    calculateProfitability,
    calculateROI
};

