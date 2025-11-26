'use client'

import { useState, useEffect } from 'react'
import Icon from '@/components/Icon'
import '@/components/home/Home.css'
import './CalculatorPage.css'

// ====================================
// TYPES
// ====================================
interface Machine {
  id: string
  name: string
  hashrate: number // TH/s
  power: number // W
  efficiency: number // J/TH
  price: number // USD (CAPEX)
}

interface Hoster {
  id: string
  name: string
  location: string
  electricityRate: number // $/kWh
  additionalFees?: number // $/month
  deposit?: number // nombre de mois de dépôt
}

interface CalculationResult {
  // ROI
  roiDays: number | null
  roiMonths: number | null
  breakEven: number | null // jours
  
  // BTC produits
  btcPerDay: number
  btcPerMonth: number
  btcPerLifespan: number
  
  // Revenus
  revenuePerDay: number
  revenuePerMonth: number
  revenuePerLifespan: number
  
  // OPEX
  opexPerDay: number
  opexPerMonth: number
  opexPerLifespan: number
  
  // Revenu net
  netRevenuePerDay: number
  netRevenuePerMonth: number
  netRevenuePerLifespan: number
}

// ====================================
// DONNÉES MOCKÉES (À remplacer par chargement Excel)
// ====================================
const MACHINES: Machine[] = [
  { id: 's23-hydro', name: 'Antminer S23 Hydro', hashrate: 605, power: 5870, efficiency: 9.7, price: 8500 },
  { id: 's21-pro', name: 'Antminer S21 Pro', hashrate: 234, power: 3510, efficiency: 15.0, price: 4008 },
  { id: 's21', name: 'Antminer S21', hashrate: 200, power: 3550, efficiency: 17.75, price: 3500 },
  { id: 'm60s', name: 'Whatsminer M60S++', hashrate: 372, power: 7200, efficiency: 19.4, price: 5800 },
  { id: 'm53s', name: 'Whatsminer M53S++', hashrate: 320, power: 5040, efficiency: 15.75, price: 4200 },
]

const HOSTERS: Hoster[] = [
  { id: 'hoster-1', name: 'DataCenter USA', location: 'Texas, USA', electricityRate: 0.072, additionalFees: 25, deposit: 3 },
  { id: 'hoster-2', name: 'Nordic Mining', location: 'Iceland', electricityRate: 0.035, additionalFees: 35, deposit: 2 },
  { id: 'hoster-3', name: 'Canada Hosting', location: 'Québec, Canada', electricityRate: 0.045, additionalFees: 30, deposit: 2 },
  { id: 'hoster-4', name: 'Kazakhstan Mining', location: 'Kazakhstan', electricityRate: 0.040, additionalFees: 20, deposit: 1 },
]

// ====================================
// FONCTIONS UTILITAIRES
// ====================================
const formatNumber = (num: number, decimals: number = 2): string => {
  return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

const formatBTC = (num: number): string => {
  return num.toFixed(8)
}

// ====================================
// COMPOSANT PRINCIPAL
// ====================================
export default function CalculatorPage() {
  // États
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(MACHINES[0])
  const [selectedHoster, setSelectedHoster] = useState<Hoster | null>(HOSTERS[0])
  const [lifespan, setLifespan] = useState<number>(3) // années
  const [capex, setCapex] = useState<number>(MACHINES[0]?.price || 0)
  const [electricityRate, setElectricityRate] = useState<number>(HOSTERS[0]?.electricityRate || 0.07)
  const [btcPrice, setBtcPrice] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [mounted, setMounted] = useState<boolean>(false)
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [machineDropdownOpen, setMachineDropdownOpen] = useState<boolean>(false)
  const [hosterDropdownOpen, setHosterDropdownOpen] = useState<boolean>(false)

  // Initialisation
  useEffect(() => {
    setMounted(true)
  }, [])

  // Récupération du prix BTC
  useEffect(() => {
    if (!mounted) return

    const fetchBtcPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
        const data = await response.json()
        if (data.bitcoin?.usd) {
          setBtcPrice(data.bitcoin.usd)
        } else {
          setBtcPrice(95000)
        }
      } catch (error) {
        console.error('Error fetching BTC price:', error)
        setBtcPrice(95000)
      } finally {
        setLoading(false)
      }
    }

    fetchBtcPrice()
  }, [mounted])

  // Mise à jour du CAPEX quand la machine change
  useEffect(() => {
    if (selectedMachine) {
      setCapex(selectedMachine.price)
    }
  }, [selectedMachine])

  // Mise à jour du prix électricité quand l'hoster change
  useEffect(() => {
    if (selectedHoster) {
      setElectricityRate(selectedHoster.electricityRate)
    }
  }, [selectedHoster])

  // Calcul des résultats
  useEffect(() => {
    if (loading || !selectedMachine || !selectedHoster || !btcPrice || btcPrice === 0) {
      setResult(null)
      return
    }

    // Inputs
    const hashrateTH = selectedMachine.hashrate
    const powerW = selectedMachine.power
    const capexValue = capex
    const electricityRateValue = electricityRate
    const lifespanDays = lifespan * 365
    
    // OPEX/jour
    const powerKW = powerW / 1000
    const opexPerDay = (powerKW * 24) * electricityRateValue
    const additionalFeesPerDay = (selectedHoster.additionalFees || 0) / 30
    const totalOpexPerDay = opexPerDay + additionalFeesPerDay
    
    // Production BTC/jour
    const networkHashrateTH = 600000000
    const blocksPerDay = 144
    const btcPerBlock = 3.125
    const btcPerDay = (hashrateTH / networkHashrateTH) * blocksPerDay * btcPerBlock
    
    // Revenu brut/jour
    const revenuePerDay = btcPerDay * btcPrice
    
    // Revenu net/jour
    const netRevenuePerDay = revenuePerDay - totalOpexPerDay
    
    // ROI
    const roiDays = netRevenuePerDay > 0 ? capexValue / netRevenuePerDay : null
    const roiMonths = roiDays ? roiDays / 30 : null
    const breakEven = roiDays
    
    // Calculs mensuels et sur lifespan
    const btcPerMonth = btcPerDay * 30
    const btcPerLifespan = btcPerDay * lifespanDays
    const revenuePerMonth = revenuePerDay * 30
    const revenuePerLifespan = revenuePerDay * lifespanDays
    const opexPerMonth = totalOpexPerDay * 30
    const opexPerLifespan = totalOpexPerDay * lifespanDays
    const netRevenuePerMonth = netRevenuePerDay * 30
    const netRevenuePerLifespan = netRevenuePerDay * lifespanDays
    
    setResult({
      roiDays,
      roiMonths,
      breakEven,
      btcPerDay,
      btcPerMonth,
      btcPerLifespan,
      revenuePerDay,
      revenuePerMonth,
      revenuePerLifespan,
      opexPerDay: totalOpexPerDay,
      opexPerMonth,
      opexPerLifespan,
      netRevenuePerDay,
      netRevenuePerMonth,
      netRevenuePerLifespan,
    })
  }, [selectedMachine, selectedHoster, lifespan, capex, electricityRate, btcPrice, loading])

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        {/* Page Title */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ 
            fontSize: 'var(--text-2xl)', 
            fontWeight: 700,
            color: '#ffffff',
            margin: 0,
            marginBottom: 'var(--space-4)'
          }}>
            Calculateur ROI Crypto
          </h1>
          <p style={{ 
            fontSize: 'var(--text-sm)', 
            color: 'var(--text-secondary)', 
            marginTop: 'var(--space-2)',
            fontWeight: 400
          }}>
            Calculez votre ROI, break-even et revenus nets en un clic
          </p>
        </div>

        {/* SECTION RÉSULTATS - PREMIUM STATS GRID (EXACTEMENT COMME HOMEPAGE) - 4 BOXES UNIQUEMENT */}
        {result && (
          <div className="premium-stats-section">
            <div className="premium-stats-grid">
              {/* ROI */}
              <div className="premium-stat-box">
                <div className="premium-stat-box-header">
                  <div className="premium-stat-icon">
                    <Icon name="projects" />
                  </div>
                  <div className="premium-stat-label">ROI</div>
                </div>
                <div className="premium-stat-value">
                  {result.roiDays !== null ? `${formatNumber(result.roiDays, 0)} jours` : 'N/A'}
                </div>
                <div className="premium-stat-footer">
                  <span className="premium-stat-description">
                    {result.roiMonths ? `≈ ${formatNumber(result.roiMonths, 1)} mois` : 'Non rentable'}
                  </span>
                </div>
              </div>

              {/* Break-even */}
              <div className="premium-stat-box">
                <div className="premium-stat-box-header">
                  <div className="premium-stat-icon">
                    <Icon name="versions" />
                  </div>
                  <div className="premium-stat-label">Break-even</div>
                </div>
                <div className="premium-stat-value">
                  {result.breakEven !== null ? `${formatNumber(result.breakEven, 0)} jours` : 'N/A'}
                </div>
                <div className="premium-stat-footer">
                  <span className="premium-stat-description">
                    {result.breakEven ? `≈ ${formatNumber((result.breakEven || 0) / 30, 1)} mois` : 'Non rentable'}
                  </span>
                </div>
              </div>

              {/* BTC / Jour */}
              <div className="premium-stat-box">
                <div className="premium-stat-box-header">
                  <div className="premium-stat-icon">
                    <Icon name="jobs" />
                  </div>
                  <div className="premium-stat-label">BTC / Jour</div>
                </div>
                <div className="premium-stat-value">
                  {formatBTC(result.btcPerDay)}
                </div>
                <div className="premium-stat-footer">
                  <span className="premium-stat-description">
                    ≈ ${formatNumber(result.revenuePerDay)} / jour
                  </span>
                </div>
              </div>

              {/* Revenu Net / Jour - Highlight */}
              <div className="premium-stat-box premium-stat-box-highlight">
                <div className="premium-stat-box-header">
                  <div className="premium-stat-icon">
                    <Icon name="running" />
                  </div>
                  <div className="premium-stat-label">Revenu Net / Jour</div>
                </div>
                <div className={`premium-stat-value ${result.netRevenuePerDay >= 0 ? 'premium-stat-value-green' : ''}`}>
                  ${formatNumber(result.netRevenuePerDay)}
                </div>
                <div className="premium-stat-footer">
                  <span className="premium-stat-description">
                    ${formatNumber(result.netRevenuePerMonth)} / mois
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION INPUTS */}
        <div className="calculator-inputs-section">
          <div className="calculator-inputs-grid">
            {/* Sélection Machine - Menu Déroulant Premium */}
            <div className="calculator-section-card calculator-section-card-large">
              <div className="calculator-section-title">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <div className="premium-stat-icon">
                    <Icon name="projects" />
                  </div>
                  <span>Sélection de la Machine</span>
                </div>
                {loading && <span className="calculator-loading-badge">Chargement...</span>}
              </div>
              
              {/* Dropdown Premium */}
              <div className="calculator-premium-dropdown">
                <button
                  type="button"
                  className="calculator-dropdown-trigger"
                  onClick={() => setMachineDropdownOpen(!machineDropdownOpen)}
                  onBlur={() => setTimeout(() => setMachineDropdownOpen(false), 200)}
                >
                  <div className="calculator-dropdown-trigger-content">
                    <div className="calculator-dropdown-selected">
                      {selectedMachine ? (
                        <>
                          <span className="calculator-dropdown-selected-name">{selectedMachine.name}</span>
                          <span className="calculator-dropdown-selected-specs">
                            {selectedMachine.hashrate} TH/s • {selectedMachine.power}W • ${formatNumber(selectedMachine.price, 0)}
                          </span>
                        </>
                      ) : (
                        <span className="calculator-dropdown-placeholder">Sélectionner une machine</span>
                      )}
                    </div>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`calculator-dropdown-arrow ${machineDropdownOpen ? 'open' : ''}`}
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>

                {machineDropdownOpen && (
                  <div className="calculator-dropdown-menu">
                    {MACHINES.map((machine) => (
                      <div
                        key={machine.id}
                        className={`calculator-dropdown-item ${selectedMachine?.id === machine.id ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedMachine(machine)
                          setMachineDropdownOpen(false)
                        }}
                      >
                        <div className="calculator-dropdown-item-content">
                          <div className="calculator-dropdown-item-name">{machine.name}</div>
                          <div className="calculator-dropdown-item-specs">
                            <span>{machine.hashrate} TH/s</span>
                            <span>•</span>
                            <span>{machine.power} W</span>
                            <span>•</span>
                            <span>{machine.efficiency} J/TH</span>
                            <span>•</span>
                            <span className="calculator-dropdown-item-price">${formatNumber(machine.price, 0)}</span>
                          </div>
                        </div>
                        {selectedMachine?.id === machine.id && (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="calculator-dropdown-check"
                          >
                            <path
                              d="M20 6L9 17L4 12"
                              stroke="#C5FFA7"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Détails de la machine sélectionnée */}
              {selectedMachine && (
                <div className="calculator-machine-details">
                  <div className="calculator-machine-details-grid">
                    <div className="calculator-machine-detail-item">
                      <div className="calculator-machine-detail-label">Hashrate</div>
                      <div className="calculator-machine-detail-value">{selectedMachine.hashrate} TH/s</div>
                    </div>
                    <div className="calculator-machine-detail-item">
                      <div className="calculator-machine-detail-label">Consommation</div>
                      <div className="calculator-machine-detail-value">{selectedMachine.power} W</div>
                    </div>
                    <div className="calculator-machine-detail-item">
                      <div className="calculator-machine-detail-label">Efficacité</div>
                      <div className="calculator-machine-detail-value">{selectedMachine.efficiency} J/TH</div>
                    </div>
                    <div className="calculator-machine-detail-item calculator-machine-detail-item-highlight">
                      <div className="calculator-machine-detail-label">Prix (CAPEX)</div>
                      <div className="calculator-machine-detail-value calculator-machine-detail-value-green">
                        ${formatNumber(selectedMachine.price, 0)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sélection Hoster - Menu Déroulant Premium */}
            <div className="calculator-section-card calculator-section-card-large">
              <div className="calculator-section-title">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <div className="premium-stat-icon">
                    <Icon name="versions" />
                  </div>
                  <span>Sélection de l'Hoster</span>
                </div>
              </div>
              
              {/* Dropdown Premium */}
              <div className="calculator-premium-dropdown">
                <button
                  type="button"
                  className="calculator-dropdown-trigger"
                  onClick={() => setHosterDropdownOpen(!hosterDropdownOpen)}
                  onBlur={() => setTimeout(() => setHosterDropdownOpen(false), 200)}
                >
                  <div className="calculator-dropdown-trigger-content">
                    <div className="calculator-dropdown-selected">
                      {selectedHoster ? (
                        <>
                          <span className="calculator-dropdown-selected-name">{selectedHoster.name}</span>
                          <span className="calculator-dropdown-selected-specs">
                            {selectedHoster.location} • ${selectedHoster.electricityRate.toFixed(3)}/kWh
                            {selectedHoster.additionalFees && ` • +$${selectedHoster.additionalFees}/mo`}
                          </span>
                        </>
                      ) : (
                        <span className="calculator-dropdown-placeholder">Sélectionner un hoster</span>
                      )}
                    </div>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`calculator-dropdown-arrow ${hosterDropdownOpen ? 'open' : ''}`}
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>

                {hosterDropdownOpen && (
                  <div className="calculator-dropdown-menu">
                    {HOSTERS.map((hoster) => (
                      <div
                        key={hoster.id}
                        className={`calculator-dropdown-item ${selectedHoster?.id === hoster.id ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedHoster(hoster)
                          setHosterDropdownOpen(false)
                        }}
                      >
                        <div className="calculator-dropdown-item-content">
                          <div className="calculator-dropdown-item-name">{hoster.name}</div>
                          <div className="calculator-dropdown-item-specs">
                            <span>{hoster.location}</span>
                            <span>•</span>
                            <span className="calculator-dropdown-item-price">${hoster.electricityRate.toFixed(3)}/kWh</span>
                            {hoster.additionalFees && (
                              <>
                                <span>•</span>
                                <span>+${hoster.additionalFees}/mo</span>
                              </>
                            )}
                          </div>
                        </div>
                        {selectedHoster?.id === hoster.id && (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="calculator-dropdown-check"
                          >
                            <path
                              d="M20 6L9 17L4 12"
                              stroke="#C5FFA7"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Détails de l'hoster sélectionné */}
              {selectedHoster && (
                <div className="calculator-machine-details">
                  <div className="calculator-machine-details-grid">
                    <div className="calculator-machine-detail-item">
                      <div className="calculator-machine-detail-label">Localisation</div>
                      <div className="calculator-machine-detail-value">{selectedHoster.location}</div>
                    </div>
                    {selectedHoster.additionalFees && (
                      <div className="calculator-machine-detail-item">
                        <div className="calculator-machine-detail-label">Frais Additionnels</div>
                        <div className="calculator-machine-detail-value">${selectedHoster.additionalFees}/mo</div>
                      </div>
                    )}
                    <div className="calculator-machine-detail-item">
                      <div className="calculator-machine-detail-label">Deposit</div>
                      <div className="calculator-machine-detail-value">
                        {selectedHoster.deposit || 0} {selectedHoster.deposit === 1 ? 'mois' : 'mois'}
                      </div>
                    </div>
                    <div className="calculator-machine-detail-item calculator-machine-detail-item-highlight calculator-machine-detail-item-right">
                      <div className="calculator-machine-detail-label">Prix Électricité</div>
                      <div className="calculator-machine-detail-value calculator-machine-detail-value-green">
                        ${selectedHoster.electricityRate.toFixed(3)}/kWh
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

            {/* Paramètres & Prix BTC */}
          <div className="calculator-params-section">
            <div className="calculator-section-card calculator-section-card-large" style={{ paddingBottom: 'calc(var(--space-3) + 20px)' }}>
              <div className="calculator-section-title">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <div className="premium-stat-icon">
                    <Icon name="jobs" />
                  </div>
                  <span>Paramètres</span>
                </div>
              </div>
              
              {/* Paramètres en ligne */}
              <div className="calculator-params-row">
                {/* Lifespan */}
                <div className="calculator-form-row-inline">
                  <label>Lifespan (années)</label>
                  <div 
                    className="calculator-lifespan-control"
                    style={{ 
                      '--range-progress': `${((lifespan - 1) / (10 - 1)) * 100}%`
                    } as React.CSSProperties}
                  >
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.5"
                      value={lifespan}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value)
                        setLifespan(val)
                      }}
                      className="calculator-lifespan-slider"
                      style={{ 
                        position: 'relative',
                        zIndex: 2
                      }}
                    />
                    <input
                      type="number"
                      min="1"
                      max="10"
                      step="0.5"
                      value={lifespan}
                      onChange={(e) => setLifespan(Math.max(1, Math.min(10, parseFloat(e.target.value) || 1)))}
                      className="calculator-lifespan-input"
                    />
                  </div>
                </div>

                {/* CAPEX */}
                <div className="calculator-form-row-inline">
                  <label>CAPEX - Prix Machine ($)</label>
                  <input
                    type="number"
                    value={capex}
                    onChange={(e) => setCapex(Math.max(0, parseFloat(e.target.value) || 0))}
                    placeholder="Prix de la machine"
                    className="calculator-param-input"
                  />
                </div>

                {/* Prix Électricité */}
                <div className="calculator-form-row-inline">
                  <label>Prix Électricité ($/kWh)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={electricityRate}
                    onChange={(e) => setElectricityRate(Math.max(0, parseFloat(e.target.value) || 0))}
                    placeholder="Prix électricité"
                    className="calculator-param-input"
                  />
                </div>
              </div>
            </div>

            {/* Prix BTC */}
            <div className="calculator-section-card calculator-btc-price-card">
              <div className="calculator-section-title">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <div className="premium-stat-icon">
                    <Icon name="running" />
                  </div>
                  <span>Bitcoin Index</span>
                </div>
              </div>
              <div className="calculator-btc-info-row">
                <div className="calculator-btc-info-item">
                  <div className="calculator-btc-info-label">Prix du jour</div>
                  <div className="calculator-btc-info-value">
                    {loading ? '...' : `$${formatNumber(btcPrice, 0)}`}
                  </div>
                  <div className="calculator-btc-info-source">CoinGecko</div>
                </div>
                <div className="calculator-btc-info-item">
                  <div className="calculator-btc-info-label">Total BTC Hashrate</div>
                  <div className="calculator-btc-info-value">
                    {loading ? '...' : `${formatNumber(600000000 / 1000000, 0)} EH/s`}
                  </div>
                  <div className="calculator-btc-info-source">Réseau Bitcoin</div>
                </div>
                <div className="calculator-btc-info-item">
                  <div className="calculator-btc-info-label">Revenue Th/$</div>
                  <div className="calculator-btc-info-value">
                    {loading || !btcPrice ? '...' : `$${formatNumber((144 * 3.125 * btcPrice) / 600000000, 4)}`}
                  </div>
                  <div className="calculator-btc-info-source">par TH/jour</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tableau Récapitulatif Premium */}
        {result && selectedMachine && selectedHoster && (
          <div className="premium-transaction-section">
            <div className="premium-section-header">
              <h3 className="premium-section-title">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <div className="premium-stat-icon">
                    <Icon name="projects" />
                  </div>
                  <span>Récapitulatif Complet</span>
                </div>
              </h3>
            </div>
            <div className="premium-transaction-table-container">
              <table className="premium-transaction-table">
                <thead>
                  <tr>
                    <th>Catégorie</th>
                    <th>Détails</th>
                    <th>Valeur</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Machine */}
                  <tr>
                    <td><strong>Machine</strong></td>
                    <td>{selectedMachine.name}</td>
                    <td className="premium-transaction-amount">${formatNumber(selectedMachine.price, 0)}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Hashrate</td>
                    <td>{selectedMachine.hashrate} TH/s</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Consommation</td>
                    <td>{selectedMachine.power} W</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Efficacité</td>
                    <td>{selectedMachine.efficiency} J/TH</td>
                  </tr>
                  
                  {/* Hoster */}
                  <tr>
                    <td><strong>Hoster</strong></td>
                    <td>{selectedHoster.name}</td>
                    <td>{selectedHoster.location}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Prix Électricité</td>
                    <td className="premium-transaction-amount">${selectedHoster.electricityRate.toFixed(3)}/kWh</td>
                  </tr>
                  {selectedHoster.additionalFees && (
                    <tr>
                      <td></td>
                      <td>Frais Additionnels</td>
                      <td>${selectedHoster.additionalFees}/mo</td>
                    </tr>
                  )}
                  {selectedHoster.deposit && (
                    <tr>
                      <td></td>
                      <td>Deposit</td>
                      <td>{selectedHoster.deposit} mois</td>
                    </tr>
                  )}
                  
                  {/* Paramètres */}
                  <tr>
                    <td><strong>Paramètres</strong></td>
                    <td>Lifespan</td>
                    <td>{lifespan} an{lifespan > 1 ? 's' : ''}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>CAPEX</td>
                    <td className="premium-transaction-amount">${formatNumber(capex, 0)}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Prix Électricité</td>
                    <td>${electricityRate.toFixed(3)}/kWh</td>
                  </tr>
                  
                  {/* Bitcoin Index */}
                  <tr>
                    <td><strong>Bitcoin Index</strong></td>
                    <td>Prix du jour</td>
                    <td className="premium-transaction-amount">${formatNumber(btcPrice, 0)}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Total BTC Hashrate</td>
                    <td>600 EH/s</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Revenue Th/$</td>
                    <td className="premium-transaction-amount">${formatNumber((144 * 3.125 * btcPrice) / 600000000, 4)}</td>
                  </tr>
                  
                  {/* Résultats - ROI */}
                  <tr>
                    <td><strong>ROI & Break-even</strong></td>
                    <td>ROI (jours)</td>
                    <td className="premium-transaction-amount">
                      {result.roiDays !== null ? `${formatNumber(result.roiDays, 0)} jours` : 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>ROI (mois)</td>
                    <td>
                      {result.roiMonths ? `≈ ${formatNumber(result.roiMonths, 1)} mois` : 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Break-even</td>
                    <td>
                      {result.breakEven !== null ? `${formatNumber(result.breakEven, 0)} jours` : 'N/A'}
                    </td>
                  </tr>
                  
                  {/* Résultats - BTC Produits */}
                  <tr>
                    <td><strong>BTC Produits</strong></td>
                    <td>Par jour</td>
                    <td className="premium-transaction-amount">{formatBTC(result.btcPerDay)} BTC</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Par mois</td>
                    <td className="premium-transaction-amount">{formatBTC(result.btcPerMonth)} BTC</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Sur lifespan</td>
                    <td className="premium-transaction-amount">{formatBTC(result.btcPerLifespan)} BTC</td>
                  </tr>
                  
                  {/* Résultats - Revenus */}
                  <tr>
                    <td><strong>Revenus Bruts</strong></td>
                    <td>Par jour</td>
                    <td className="premium-transaction-amount">${formatNumber(result.revenuePerDay)}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Par mois</td>
                    <td className="premium-transaction-amount">${formatNumber(result.revenuePerMonth)}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Sur lifespan</td>
                    <td className="premium-transaction-amount">${formatNumber(result.revenuePerLifespan)}</td>
                  </tr>
                  
                  {/* Résultats - OPEX */}
                  <tr>
                    <td><strong>OPEX Totaux</strong></td>
                    <td>Par jour</td>
                    <td>${formatNumber(result.opexPerDay)}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Par mois</td>
                    <td>${formatNumber(result.opexPerMonth)}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Sur lifespan</td>
                    <td>${formatNumber(result.opexPerLifespan)}</td>
                  </tr>
                  
                  {/* Résultats - Revenu Net */}
                  <tr>
                    <td><strong>Revenu Net</strong></td>
                    <td>Par jour</td>
                    <td className={`premium-transaction-amount ${result.netRevenuePerDay >= 0 ? '' : 'negative'}`}>
                      ${formatNumber(result.netRevenuePerDay)}
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Par mois</td>
                    <td className={`premium-transaction-amount ${result.netRevenuePerMonth >= 0 ? '' : 'negative'}`}>
                      ${formatNumber(result.netRevenuePerMonth)}
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Sur lifespan</td>
                    <td className={`premium-transaction-amount ${result.netRevenuePerLifespan >= 0 ? '' : 'negative'}`}>
                      ${formatNumber(result.netRevenuePerLifespan)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Message si pas de résultats */}
        {!result && !loading && (
          <div className="calculator-results-empty">
            <div className="calculator-empty-icon">
              <Icon name="projects" />
            </div>
            <div className="calculator-empty-text">
              Configurez les paramètres ci-dessus pour voir les résultats
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
