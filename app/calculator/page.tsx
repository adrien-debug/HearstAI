'use client'

import { useState, useEffect } from 'react'
import './CalculatorPage.css'

interface MinerType {
  id: string
  name: string
  hashrate: number // TH/s
  power: number // W
  efficiency: number // J/TH
  price: number // USD
}

interface Location {
  id: string
  name: string
  country: string
  electricityRate: number // $/kWh
  hostingFee?: number // $/month per miner
}

interface DealType {
  id: string
  name: string
  description: string
  electricityRate: number // $/kWh
  hostingFee: number // $/month per miner
}

const MINER_TYPES: MinerType[] = [
  { id: 's23hydro', name: 'Antminer S23 Hydro', hashrate: 605, power: 5870, efficiency: 9.7, price: 8500 },
  { id: 's21pro', name: 'Antminer S21 Pro', hashrate: 234, power: 3510, efficiency: 15.0, price: 4008 },
  { id: 's21', name: 'Antminer S21', hashrate: 200, power: 3550, efficiency: 17.75, price: 3500 },
  { id: 'm60s', name: 'Whatsminer M60S++', hashrate: 372, power: 7200, efficiency: 19.4, price: 5800 },
  { id: 'm53s', name: 'Whatsminer M53S++', hashrate: 320, power: 5040, efficiency: 15.75, price: 4200 },
  { id: 'custom', name: 'Custom Model', hashrate: 0, power: 0, efficiency: 0, price: 0 },
]

const LOCATIONS: Location[] = [
  { id: 'usa-texas', name: 'Texas, USA', country: 'USA', electricityRate: 0.072, hostingFee: 25 },
  { id: 'usa-nevada', name: 'Nevada, USA', country: 'USA', electricityRate: 0.065, hostingFee: 28 },
  { id: 'canada-quebec', name: 'Québec, Canada', country: 'Canada', electricityRate: 0.045, hostingFee: 30 },
  { id: 'iceland', name: 'Reykjavik, Iceland', country: 'Iceland', electricityRate: 0.035, hostingFee: 35 },
  { id: 'norway', name: 'Oslo, Norway', country: 'Norway', electricityRate: 0.055, hostingFee: 32 },
  { id: 'kazakhstan', name: 'Kazakhstan', country: 'Kazakhstan', electricityRate: 0.040, hostingFee: 20 },
  { id: 'russia', name: 'Siberia, Russia', country: 'Russia', electricityRate: 0.030, hostingFee: 18 },
  { id: 'paraguay', name: 'Paraguay', country: 'Paraguay', electricityRate: 0.050, hostingFee: 22 },
]

const DEAL_TYPES: DealType[] = [
  { id: 'self-hosted', name: 'Self-Hosted', description: 'Opération propre', electricityRate: 0.07, hostingFee: 0 },
  { id: 'colocation', name: 'Colocation', description: 'Hébergement chez un tiers', electricityRate: 0.08, hostingFee: 30 },
  { id: 'maas', name: 'MaaS', description: 'Mining as a Service', electricityRate: 0.09, hostingFee: 40 },
  { id: 'custom', name: 'Custom Deal', description: 'Tarifs personnalisés', electricityRate: 0.07, hostingFee: 25 },
]

interface CalculationResult {
  dailyRevenue: number
  dailyCost: number
  dailyProfit: number
  monthlyRevenue: number
  monthlyCost: number
  monthlyProfit: number
  breakEvenDays: number | null
  breakEvenMonths: number | null
  roi1Year: number | null
  roi2Years: number | null
  profitMargin: number
  status: 'profitable' | 'marginal' | 'unprofitable'
}

// Helper function to format numbers consistently (fixes hydration error)
const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US')
}

export default function CalculatorPage() {
  const [selectedMiner, setSelectedMiner] = useState<MinerType>(MINER_TYPES[0])
  const [selectedLocation, setSelectedLocation] = useState<Location>(LOCATIONS[0])
  const [selectedDeal, setSelectedDeal] = useState<DealType>(DEAL_TYPES[0])
  const [units, setUnits] = useState<number>(1)
  const [customHashrate, setCustomHashrate] = useState<number>(0)
  const [customPower, setCustomPower] = useState<number>(0)
  const [customPrice, setCustomPrice] = useState<number>(0)
  const [customElectricity, setCustomElectricity] = useState<number>(0)
  const [customHostingFee, setCustomHostingFee] = useState<number>(0)
  const [hashprice, setHashprice] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [mounted, setMounted] = useState<boolean>(false)

  // Set mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch current hashprice
  useEffect(() => {
    if (!mounted) return
    
    const fetchHashprice = async () => {
      try {
        const response = await fetch('/api/hashprice/current')
        const data = await response.json()
        if (data.current) {
          setHashprice(data.current)
        } else {
          // Fallback to default
          setHashprice(0.05)
        }
      } catch (error) {
        console.error('Error fetching hashprice:', error)
        setHashprice(0.05) // Default fallback
      } finally {
        setLoading(false)
      }
    }

    fetchHashprice()
  }, [mounted])

  // Calculate results when inputs change
  useEffect(() => {
    if (loading) return

    const miner = selectedMiner.id === 'custom' 
      ? { hashrate: customHashrate, power: customPower, price: customPrice }
      : selectedMiner

    if (miner.hashrate <= 0 || miner.power <= 0) {
      setResult(null)
      return
    }

    const electricityRate = selectedDeal.id === 'custom' 
      ? customElectricity 
      : selectedDeal.electricityRate

    const hostingFee = selectedDeal.id === 'custom'
      ? customHostingFee
      : selectedDeal.hostingFee

    // Calculate daily metrics
    const totalHashrate = (miner.hashrate * units) / 1000 // Convert to PH/s
    const totalPower = (miner.power * units) / 1000 // Convert to kW
    const totalInvestment = miner.price * units

    // Daily revenue (hashprice is in $/PH/day)
    const dailyRevenue = hashprice * totalHashrate

    // Daily electricity cost
    const dailyElectricityCost = totalPower * 24 * electricityRate

    // Daily hosting cost
    const dailyHostingCost = (hostingFee * units) / 30

    // Total daily cost
    const dailyCost = dailyElectricityCost + dailyHostingCost

    // Daily profit
    const dailyProfit = dailyRevenue - dailyCost

    // Monthly metrics
    const monthlyRevenue = dailyRevenue * 30
    const monthlyCost = dailyCost * 30
    const monthlyProfit = dailyProfit * 30

    // ROI calculations
    let breakEvenDays: number | null = null
    let breakEvenMonths: number | null = null
    let roi1Year: number | null = null
    let roi2Years: number | null = null

    if (totalInvestment > 0 && dailyProfit > 0) {
      breakEvenDays = Math.ceil(totalInvestment / dailyProfit)
      breakEvenMonths = breakEvenDays / 30

      const profit1Year = dailyProfit * 365
      roi1Year = ((profit1Year - totalInvestment) / totalInvestment) * 100

      const profit2Years = dailyProfit * 730
      roi2Years = ((profit2Years - totalInvestment) / totalInvestment) * 100
    } else if (totalInvestment > 0 && dailyProfit <= 0) {
      // Unprofitable
      roi1Year = -100
      roi2Years = -100
    }

    // Profit margin
    const profitMargin = dailyRevenue > 0 ? (dailyProfit / dailyRevenue) * 100 : 0

    // Status
    let status: 'profitable' | 'marginal' | 'unprofitable'
    if (dailyProfit < 0) {
      status = 'unprofitable'
    } else if (profitMargin < 10) {
      status = 'marginal'
    } else {
      status = 'profitable'
    }

    setResult({
      dailyRevenue,
      dailyCost,
      dailyProfit,
      monthlyRevenue,
      monthlyCost,
      monthlyProfit,
      breakEvenDays,
      breakEvenMonths,
      roi1Year,
      roi2Years,
      profitMargin,
      status,
    })
  }, [
    selectedMiner,
    selectedLocation,
    selectedDeal,
    units,
    customHashrate,
    customPower,
    customPrice,
    customElectricity,
    customHostingFee,
    hashprice,
    loading,
  ])

  const handleMinerChange = (miner: MinerType) => {
    setSelectedMiner(miner)
    if (miner.id !== 'custom') {
      setCustomHashrate(0)
      setCustomPower(0)
      setCustomPrice(0)
    }
  }

  const handleDealChange = (deal: DealType) => {
    setSelectedDeal(deal)
    if (deal.id !== 'custom') {
      setCustomElectricity(0)
      setCustomHostingFee(0)
    }
  }

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#ffffff', position: 'relative', zIndex: 10 }}>Mining Calculator</h1>
          <p style={{ 
            fontSize: 'var(--text-sm)', 
            color: 'var(--text-secondary)', 
            marginTop: 'var(--space-2)',
            fontWeight: 400
          }}>
            Calculez rapidement vos projections de mining : ROI, Break-even et rentabilité
          </p>
        </div>

        <div className="calculator-page-grid">
          {/* Left Panel - Inputs */}
          <div className="calculator-inputs-panel">
            {/* Miner Selection */}
            <div className="calculator-section-card">
              <div className="calculator-section-title">
                <span>Type de Mineur</span>
                {loading && <span className="calculator-loading-badge">Chargement...</span>}
              </div>
              <div className="calculator-miner-grid">
                {MINER_TYPES.map((miner) => (
                  <div
                    key={miner.id}
                    className={`calculator-miner-card ${selectedMiner.id === miner.id ? 'selected' : ''}`}
                    onClick={() => handleMinerChange(miner)}
                  >
                    <div className="calculator-miner-name">{miner.name}</div>
                    {miner.id !== 'custom' && (
                      <div className="calculator-miner-specs">
                        <div className="calculator-miner-spec">
                          <span className="spec-label">Hashrate:</span>
                          <span className="spec-value">{miner.hashrate} TH/s</span>
                        </div>
                        <div className="calculator-miner-spec">
                          <span className="spec-label">Power:</span>
                          <span className="spec-value">{miner.power} W</span>
                        </div>
                        <div className="calculator-miner-spec">
                          <span className="spec-label">Efficiency:</span>
                          <span className="spec-value">{miner.efficiency} J/TH</span>
                        </div>
                        <div className="calculator-miner-spec">
                          <span className="spec-label">Price:</span>
                          <span className="spec-value">${formatNumber(miner.price)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {selectedMiner.id === 'custom' && (
                <div className="calculator-custom-fields">
                  <div className="calculator-form-row">
                    <label>Hashrate (TH/s)</label>
                    <input
                      type="number"
                      value={customHashrate || ''}
                      onChange={(e) => setCustomHashrate(parseFloat(e.target.value) || 0)}
                      placeholder="Ex: 200"
                    />
                  </div>
                  <div className="calculator-form-row">
                    <label>Power (W)</label>
                    <input
                      type="number"
                      value={customPower || ''}
                      onChange={(e) => setCustomPower(parseFloat(e.target.value) || 0)}
                      placeholder="Ex: 3500"
                    />
                  </div>
                  <div className="calculator-form-row">
                    <label>Price ($)</label>
                    <input
                      type="number"
                      value={customPrice || ''}
                      onChange={(e) => setCustomPrice(parseFloat(e.target.value) || 0)}
                      placeholder="Ex: 4000"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Location Selection */}
            <div className="calculator-section-card">
              <div className="calculator-section-title">Localisation</div>
              <div className="calculator-location-grid">
                {LOCATIONS.map((location) => (
                  <div
                    key={location.id}
                    className={`calculator-location-card ${selectedLocation.id === location.id ? 'selected' : ''}`}
                    onClick={() => setSelectedLocation(location)}
                  >
                    <div className="calculator-location-name">{location.name}</div>
                    <div className="calculator-location-country">{location.country}</div>
                    <div className="calculator-location-rate">
                      ${location.electricityRate.toFixed(3)}/kWh
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deal Type Selection */}
            <div className="calculator-section-card">
              <div className="calculator-section-title">Type de Deal</div>
              <div className="calculator-deal-grid">
                {DEAL_TYPES.map((deal) => (
                  <div
                    key={deal.id}
                    className={`calculator-deal-card ${selectedDeal.id === deal.id ? 'selected' : ''}`}
                    onClick={() => handleDealChange(deal)}
                  >
                    <div className="calculator-deal-name">{deal.name}</div>
                    <div className="calculator-deal-desc">{deal.description}</div>
                    <div className="calculator-deal-rates">
                      <span>${deal.electricityRate.toFixed(3)}/kWh</span>
                      {deal.hostingFee > 0 && <span>${deal.hostingFee}/mo</span>}
                    </div>
                  </div>
                ))}
              </div>

              {selectedDeal.id === 'custom' && (
                <div className="calculator-custom-fields">
                  <div className="calculator-form-row">
                    <label>Electricity Rate ($/kWh)</label>
                    <input
                      type="number"
                      step="0.001"
                      value={customElectricity || ''}
                      onChange={(e) => setCustomElectricity(parseFloat(e.target.value) || 0)}
                      placeholder="Ex: 0.07"
                    />
                  </div>
                  <div className="calculator-form-row">
                    <label>Hosting Fee ($/month)</label>
                    <input
                      type="number"
                      value={customHostingFee || ''}
                      onChange={(e) => setCustomHostingFee(parseFloat(e.target.value) || 0)}
                      placeholder="Ex: 25"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Units */}
            <div className="calculator-section-card">
              <div className="calculator-section-title">Nombre d'Unités</div>
              <div className="calculator-units-control">
                <button
                  className="calculator-units-btn"
                  onClick={() => setUnits(Math.max(1, units - 1))}
                >
                  −
                </button>
                <input
                  type="number"
                  className="calculator-units-input"
                  value={units}
                  onChange={(e) => setUnits(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                />
                <button
                  className="calculator-units-btn"
                  onClick={() => setUnits(units + 1)}
                >
                  +
                </button>
              </div>
              <div className="calculator-units-info">
                <div className="calculator-units-info-item">
                  <span>Hashrate Total:</span>
                  <span className="highlight">
                    {((selectedMiner.id === 'custom' ? customHashrate : selectedMiner.hashrate) * units / 1000).toFixed(2)} PH/s
                  </span>
                </div>
                <div className="calculator-units-info-item">
                  <span>Power Total:</span>
                  <span className="highlight">
                    {((selectedMiner.id === 'custom' ? customPower : selectedMiner.power) * units / 1000).toFixed(2)} kW
                  </span>
                </div>
                <div className="calculator-units-info-item">
                  <span>Investment Total:</span>
                  <span className="highlight">
                    ${mounted ? formatNumber((selectedMiner.id === 'custom' ? customPrice : selectedMiner.price) * units) : '0'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="calculator-results-panel">
            {!result ? (
              <div className="calculator-results-empty">
                <div className="calculator-empty-icon">📊</div>
                <div className="calculator-empty-text">
                  Configurez les paramètres pour voir les résultats
                </div>
              </div>
            ) : (
              <>
                {/* Status Badge */}
                <div className={`calculator-status-badge ${result.status}`}>
                  <span className="status-icon">
                    {result.status === 'profitable' && '✅'}
                    {result.status === 'marginal' && '⚠️'}
                    {result.status === 'unprofitable' && '❌'}
                  </span>
                  <span className="status-text">
                    {result.status === 'profitable' && 'Rentable'}
                    {result.status === 'marginal' && 'Marginal'}
                    {result.status === 'unprofitable' && 'Non Rentable'}
                  </span>
                </div>

                {/* Daily Metrics */}
                <div className="calculator-results-section">
                  <div className="calculator-results-title">Métriques Quotidiennes</div>
                  <div className="calculator-metrics-grid">
                    <div className="calculator-metric-card">
                      <div className="metric-label">Revenus</div>
                      <div className="metric-value positive">${result.dailyRevenue.toFixed(2)}</div>
                    </div>
                    <div className="calculator-metric-card">
                      <div className="metric-label">Coûts</div>
                      <div className="metric-value negative">${result.dailyCost.toFixed(2)}</div>
                    </div>
                    <div className="calculator-metric-card highlight">
                      <div className="metric-label">Profit</div>
                      <div className={`metric-value ${result.dailyProfit >= 0 ? 'positive' : 'negative'}`}>
                        ${result.dailyProfit.toFixed(2)}
                      </div>
                    </div>
                    <div className="calculator-metric-card">
                      <div className="metric-label">Marge</div>
                      <div className={`metric-value ${result.profitMargin >= 0 ? 'positive' : 'negative'}`}>
                        {result.profitMargin.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monthly Metrics */}
                <div className="calculator-results-section">
                  <div className="calculator-results-title">Métriques Mensuelles</div>
                  <div className="calculator-metrics-grid">
                    <div className="calculator-metric-card">
                      <div className="metric-label">Revenus</div>
                      <div className="metric-value positive">${result.monthlyRevenue.toFixed(2)}</div>
                    </div>
                    <div className="calculator-metric-card">
                      <div className="metric-label">Coûts</div>
                      <div className="metric-value negative">${result.monthlyCost.toFixed(2)}</div>
                    </div>
                    <div className="calculator-metric-card highlight">
                      <div className="metric-label">Profit</div>
                      <div className={`metric-value ${result.monthlyProfit >= 0 ? 'positive' : 'negative'}`}>
                        ${result.monthlyProfit.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ROI & Break-even */}
                <div className="calculator-results-section">
                  <div className="calculator-results-title">ROI & Break-even</div>
                  <div className="calculator-roi-grid">
                    {result.breakEvenDays !== null && (
                      <div className="calculator-roi-card">
                        <div className="roi-label">Break-even</div>
                        <div className="roi-value">
                          {result.breakEvenDays} jours
                        </div>
                        <div className="roi-subvalue">
                          ({result.breakEvenMonths?.toFixed(1)} mois)
                        </div>
                      </div>
                    )}
                    {result.roi1Year !== null && (
                      <div className="calculator-roi-card">
                        <div className="roi-label">ROI 1 an</div>
                        <div className={`roi-value ${result.roi1Year >= 0 ? 'positive' : 'negative'}`}>
                          {result.roi1Year >= 0 ? '+' : ''}{result.roi1Year.toFixed(1)}%
                        </div>
                      </div>
                    )}
                    {result.roi2Years !== null && (
                      <div className="calculator-roi-card">
                        <div className="roi-label">ROI 2 ans</div>
                        <div className={`roi-value ${result.roi2Years >= 0 ? 'positive' : 'negative'}`}>
                          {result.roi2Years >= 0 ? '+' : ''}{result.roi2Years.toFixed(1)}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hashprice Info */}
                <div className="calculator-hashprice-info">
                  <div className="hashprice-label">Hashprice actuel:</div>
                  <div className="hashprice-value">${hashprice.toFixed(4)}/PH/jour</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

