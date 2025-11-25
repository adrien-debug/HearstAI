'use client'

import { useState, useEffect } from 'react'
import './Calculator.css'

// Définir les types pour les données du formulaire
interface CalculatorData {
  // Step 0: Context & Scenario
  project_name: string
  currency: string
  country: string
  total_budget: number
  operationType: 'maas' | 'self' | 'infra' | 'hybrid'
  horizon_mode: 'YEARS' | 'MONTHS'
  horizon_value: number
  
  // Step 1: Machine Selection
  selected_machine: string
  machine_hashrate: number
  machine_power: number
  machine_efficiency: number
  machine_price: number
  
  // Step 2: Energy & Site
  energy_source: 'grid' | 'gas' | 'hydro' | 'solar'
  base_tariff: number
  demand_charge: number
  curtailment: number
  max_power: number
  pue: number
  vat_rate: number
  
  // Step 3: Scale & Schedule
  sizing_mode: 'budget' | 'manual'
  rig_budget_percent: number
  infra_budget_percent: number
  manual_units: number
  phases: Array<{
    units: number
    start_month: number
    ramp_months: number
  }>
  
  // Step 4: Revenue
  btc_scenario: 'bear' | 'flat' | 'bull' | 'custom'
  custom_btc_start: number
  custom_btc_end: number
  difficulty_growth: number
  
  // Step 5: OPEX & Fees
  opex_staffing: number
  opex_rent: number
  opex_maintenance: number
  opex_software: number
  opex_other: number
  pool_fee: number
  tx_fee: number
  
  // Step 6: Financing
  capital_source: 'equity' | 'debt' | 'mixed'
  loan_amount: number
  interest_rate: number
  loan_term: number
  
  // Step 7: Outputs
  output_detail: 'summary' | 'detailed'
  report_frequency: 'monthly' | 'quarterly' | 'annually'
}

const DEFAULT_DATA: CalculatorData = {
  project_name: 'Project Alpha',
  currency: 'USD',
  country: 'United States',
  total_budget: 2500000,
  operationType: 'maas',
  horizon_mode: 'YEARS',
  horizon_value: 4,
  selected_machine: 's23hydro',
  machine_hashrate: 605,
  machine_power: 5870,
  machine_efficiency: 9.7,
  machine_price: 8500,
  energy_source: 'grid',
  base_tariff: 0.07,
  demand_charge: 0,
  curtailment: 0,
  max_power: 10,
  pue: 1.1,
  vat_rate: 0,
  sizing_mode: 'budget',
  rig_budget_percent: 70,
  infra_budget_percent: 30,
  manual_units: 200,
  phases: [
    { units: 100, start_month: 0, ramp_months: 1 },
    { units: 106, start_month: 3, ramp_months: 2 },
  ],
  btc_scenario: 'flat',
  custom_btc_start: 95000,
  custom_btc_end: 120000,
  difficulty_growth: 10,
  opex_staffing: 15000,
  opex_rent: 5000,
  opex_maintenance: 2000,
  opex_software: 1000,
  opex_other: 500,
  pool_fee: 2.5,
  tx_fee: 0.000005,
  capital_source: 'equity',
  loan_amount: 0,
  interest_rate: 0,
  loan_term: 0,
  output_detail: 'summary',
  report_frequency: 'monthly',
}

export default function Calculator() {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<CalculatorData>(DEFAULT_DATA)

  const steps = [
    { id: 0, label: 'CONTEXT &\nSCENARIO' },
    { id: 1, label: 'MACHINE\nSELECTION' },
    { id: 2, label: 'ENERGY & SITE' },
    { id: 3, label: 'SCALE &\nSCHEDULE' },
    { id: 4, label: 'REVENUE' },
    { id: 5, label: 'OPEX & FEES' },
    { id: 6, label: 'FINANCING' },
    { id: 7, label: 'OUTPUTS' },
  ]

  const updateData = (key: keyof CalculatorData, value: any) => {
    setData(prev => ({ ...prev, [key]: value }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (step: number) => {
    setCurrentStep(step)
  }

  // Calculer le progress du stepper
  const progressPercent = ((currentStep + 1) / steps.length) * 100

  // Calculs pour le summary
  const totalUnits = data.sizing_mode === 'budget' 
    ? Math.floor((data.total_budget * (data.rig_budget_percent / 100)) / data.machine_price)
    : data.manual_units

  const totalHashrate = (totalUnits * data.machine_hashrate) / 1000 // en PH/s
  const totalPower = (totalUnits * data.machine_power) / 1000000 // en MW
  const monthlyOpex = data.opex_staffing + data.opex_rent + data.opex_maintenance + data.opex_software + data.opex_other

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#ffffff', position: 'relative', zIndex: 10 }}>Projection</h1>
        </div>

        {/* Stepper Navigation */}
        <div className="calculator-stepper-container">
          <div className="calculator-stepper">
            <div className="calculator-stepper-progress-line-container">
              <div className="calculator-stepper-progress-line-bg"></div>
              <div 
                className="calculator-stepper-progress" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            {steps.map((step) => (
              <div
                key={step.id}
                className={`calculator-step ${currentStep === step.id ? 'active' : currentStep > step.id ? 'completed' : ''}`}
                onClick={() => goToStep(step.id)}
              >
                <div className="calculator-step-circle">{step.id + 1}</div>
                <div className="calculator-step-label">
                  {step.label.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < step.label.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="calculator-content-grid">
          {/* Steps Content */}
          <div className="calculator-steps-container">
            {/* Step 0: Context & Scenario */}
            <div className={`calculator-step-content ${currentStep === 0 ? 'active' : ''}`}>
              <div className="calculator-param-card">
                <div className="calculator-param-card-title">
                  PROJECT INFORMATION
                  <span className="calculator-badge calculator-badge-green">ALL EDITABLE</span>
                </div>
                <div className="calculator-form-grid-2">
                  <div>
                    <label className="calculator-form-label">Project Name</label>
                    <input
                      type="text"
                      className="calculator-form-input"
                      value={data.project_name}
                      onChange={(e) => updateData('project_name', e.target.value)}
                      placeholder="My Mining Project"
                    />
                  </div>
                  <div>
                    <label className="calculator-form-label">Currency</label>
                    <select
                      className="calculator-form-select"
                      value={data.currency}
                      onChange={(e) => updateData('currency', e.target.value)}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="AED">AED (د.إ)</option>
                    </select>
                  </div>
                  <div>
                    <label className="calculator-form-label">Country / Location</label>
                    <input
                      type="text"
                      className="calculator-form-input"
                      value={data.country}
                      onChange={(e) => updateData('country', e.target.value)}
                      placeholder="United States"
                    />
                  </div>
                  <div>
                    <label className="calculator-form-label">Total Budget (Optional)</label>
                    <input
                      type="number"
                      className="calculator-form-input"
                      value={data.total_budget}
                      onChange={(e) => updateData('total_budget', parseFloat(e.target.value) || 0)}
                      placeholder="2500000"
                    />
                    <small style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                      Will help compute max units after machine selection
                    </small>
                  </div>
                </div>
              </div>

              <div className="calculator-param-card">
                <div className="calculator-param-card-title">OPERATION TYPE</div>
                <div className="calculator-radio-cards">
                  {(['maas', 'self', 'infra', 'hybrid'] as const).map((type) => (
                    <label key={type} className="calculator-radio-card">
                      <input
                        type="radio"
                        name="operationType"
                        value={type}
                        checked={data.operationType === type}
                        onChange={() => updateData('operationType', type)}
                      />
                      <div className="calculator-radio-card-content">
                        <div className="calculator-radio-card-label">
                          {type === 'maas' && 'Mining as a Service'}
                          {type === 'self' && 'Self-Mining'}
                          {type === 'infra' && 'Infrastructure Only'}
                          {type === 'hybrid' && 'Infra + Mining'}
                        </div>
                        <div className="calculator-radio-card-desc">
                          {type === 'maas' && 'Hosted by provider'}
                          {type === 'self' && 'Own operation'}
                          {type === 'infra' && 'Sell capacity'}
                          {type === 'hybrid' && 'Mixed model'}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="calculator-param-card">
                <div className="calculator-param-card-title">PROJECTION HORIZON</div>
                <div className="calculator-form-grid-2" style={{ marginBottom: 'var(--space-4)' }}>
                  <div>
                    <label className="calculator-form-label">Mode</label>
                    <select
                      className="calculator-form-select"
                      value={data.horizon_mode}
                      onChange={(e) => updateData('horizon_mode', e.target.value as 'YEARS' | 'MONTHS')}
                    >
                      <option value="YEARS">Years</option>
                      <option value="MONTHS">Months</option>
                    </select>
                  </div>
                  <div>
                    <label className="calculator-form-label">Duration</label>
                    <input
                      type="number"
                      className="calculator-form-input"
                      value={data.horizon_value}
                      onChange={(e) => updateData('horizon_value', parseInt(e.target.value) || 1)}
                      min="1"
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                  <button className="calculator-btn-secondary" onClick={() => { updateData('horizon_mode', 'YEARS'); updateData('horizon_value', 3) }}>3 Years</button>
                  <button className="calculator-btn-secondary" onClick={() => { updateData('horizon_mode', 'YEARS'); updateData('horizon_value', 4) }}>4 Years</button>
                  <button className="calculator-btn-secondary" onClick={() => { updateData('horizon_mode', 'YEARS'); updateData('horizon_value', 5) }}>5 Years</button>
                  <button className="calculator-btn-secondary" onClick={() => { updateData('horizon_mode', 'MONTHS'); updateData('horizon_value', 12) }}>12 Months</button>
                  <button className="calculator-btn-secondary" onClick={() => { updateData('horizon_mode', 'MONTHS'); updateData('horizon_value', 24) }}>24 Months</button>
                </div>
              </div>

              <div className="calculator-btn-group">
                <button className="calculator-btn" onClick={nextStep}>Next: Machine Selection →</button>
              </div>
            </div>

            {/* Step 1: Machine Selection */}
            <div className={`calculator-step-content ${currentStep === 1 ? 'active' : ''}`}>
              <div className="calculator-param-card">
                <div className="calculator-param-card-title">
                  Select ASIC Model
                  <span className="calculator-badge calculator-badge-default">Market Snapshot: Nov 9, 2025</span>
                </div>
                <div className="calculator-param-card-subtitle">
                  Choose your mining hardware. Specs are pre-filled from market data but fully editable.
                </div>
                <div className="calculator-machine-grid">
                  {[
                    { id: 's23hydro', name: 'Antminer S23 Hydro', hashrate: 605, power: 5870, efficiency: 9.7, price: 8500, badge: 'Popular' },
                    { id: 's21pro', name: 'Antminer S21 Pro', hashrate: 234, power: 3510, efficiency: 15.0, price: 4008, badge: 'New' },
                    { id: 'm60s', name: 'Whatsminer M60S++', hashrate: 372, power: 7200, efficiency: 19.4, price: 5800 },
                    { id: 'custom', name: 'Custom Model', hashrate: 0, power: 0, efficiency: 0, price: 0, badge: 'Editable' },
                  ].map((machine) => (
                    <div
                      key={machine.id}
                      className={`calculator-machine-card ${data.selected_machine === machine.id ? 'selected' : ''}`}
                      onClick={() => {
                        updateData('selected_machine', machine.id)
                        updateData('machine_hashrate', machine.hashrate)
                        updateData('machine_power', machine.power)
                        updateData('machine_efficiency', machine.efficiency)
                        updateData('machine_price', machine.price)
                      }}
                    >
                      <div className="calculator-machine-card-header">
                        <div className="calculator-machine-name">{machine.name}</div>
                        {machine.badge && <div className="calculator-machine-badge">{machine.badge}</div>}
                      </div>
                      <div className="calculator-machine-specs">
                        <div className="calculator-machine-spec">
                          <span className="calculator-machine-spec-label">Hashrate</span>
                          <span className="calculator-machine-spec-value">{machine.hashrate || '?'} TH/s</span>
                        </div>
                        <div className="calculator-machine-spec">
                          <span className="calculator-machine-spec-label">Power</span>
                          <span className="calculator-machine-spec-value">{machine.power || '?'} W</span>
                        </div>
                        <div className="calculator-machine-spec">
                          <span className="calculator-machine-spec-label">Efficiency</span>
                          <span className="calculator-machine-spec-value">{machine.efficiency || '?'} J/TH</span>
                        </div>
                      </div>
                      <div className="calculator-machine-price">
                        Unit Price: <span className="calculator-machine-price-value">${machine.price.toLocaleString('en-US')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="calculator-param-card">
                <div className="calculator-param-card-title">Machine Specifications (Editable)</div>
                <div className="calculator-form-grid-4">
                  <div>
                    <label className="calculator-form-label">Hashrate (TH/s)</label>
                    <input
                      type="number"
                      className="calculator-form-input"
                      value={data.machine_hashrate}
                      onChange={(e) => updateData('machine_hashrate', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="calculator-form-label">Power Draw (W)</label>
                    <input
                      type="number"
                      className="calculator-form-input"
                      value={data.machine_power}
                      onChange={(e) => updateData('machine_power', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="calculator-form-label">Efficiency (J/TH)</label>
                    <input
                      type="number"
                      className="calculator-form-input"
                      value={data.machine_efficiency}
                      onChange={(e) => updateData('machine_efficiency', parseFloat(e.target.value) || 0)}
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="calculator-form-label">Unit Price ($)</label>
                    <input
                      type="number"
                      className="calculator-form-input"
                      value={data.machine_price}
                      onChange={(e) => updateData('machine_price', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              <div className="calculator-btn-group">
                <button className="calculator-btn-secondary" onClick={prevStep}>← Back</button>
                <button className="calculator-btn" onClick={nextStep}>Next: Energy & Site →</button>
              </div>
            </div>

            {/* Step 2: Energy & Site */}
            <div className={`calculator-step-content ${currentStep === 2 ? 'active' : ''}`}>
              <div className="calculator-param-card">
                <div className="calculator-param-card-title">Energy Source</div>
                <div className="calculator-radio-cards">
                  {([
                    { value: 'grid', label: 'Grid', desc: 'Standard utility' },
                    { value: 'gas', label: 'Natural Gas', desc: 'On-site generation' },
                    { value: 'hydro', label: 'Hydro', desc: 'Renewable' },
                    { value: 'solar', label: 'Solar + Grid', desc: 'Hybrid' },
                  ] as const).map((source) => (
                    <label key={source.value} className="calculator-radio-card">
                      <input
                        type="radio"
                        name="energySource"
                        value={source.value}
                        checked={data.energy_source === source.value}
                        onChange={() => updateData('energy_source', source.value)}
                      />
                      <div className="calculator-radio-card-content">
                        <div className="calculator-radio-card-label">{source.label}</div>
                        <div className="calculator-radio-card-desc">{source.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="calculator-param-card">
                <div className="calculator-param-card-title">Electricity Tariff (User-Provided)</div>
                <div className="calculator-form-grid-3">
                  <div>
                    <label className="calculator-form-label">Base Tariff ($/kWh)</label>
                    <input
                      type="number"
                      className="calculator-form-input"
                      value={data.base_tariff}
                      onChange={(e) => updateData('base_tariff', parseFloat(e.target.value) || 0)}
                      step="0.001"
                    />
                  </div>
                  <div>
                    <label className="calculator-form-label">Demand Charge ($/kW/mo)</label>
                    <input
                      type="number"
                      className="calculator-form-input"
                      value={data.demand_charge}
                      onChange={(e) => updateData('demand_charge', parseFloat(e.target.value) || 0)}
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="calculator-form-label">Curtailment (% hours)</label>
                    <input
                      type="number"
                      className="calculator-form-input"
                      value={data.curtailment}
                      onChange={(e) => updateData('curtailment', parseFloat(e.target.value) || 0)}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>

              <div className="calculator-param-card">
                <div className="calculator-param-card-title">Site Constraints</div>
                <div className="calculator-form-grid-3">
                  <div>
                    <label className="calculator-form-label">Max Available Power (MW)</label>
                    <input
                      type="number"
                      className="calculator-form-input"
                      value={data.max_power}
                      onChange={(e) => updateData('max_power', parseFloat(e.target.value) || 0)}
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="calculator-form-label">PUE / Cooling Factor</label>
                    <input
                      type="number"
                      className="calculator-form-input"
                      value={data.pue}
                      onChange={(e) => updateData('pue', parseFloat(e.target.value) || 0)}
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="calculator-form-label">VAT on CAPEX (%)</label>
                    <input
                      type="number"
                      className="calculator-form-input"
                      value={data.vat_rate}
                      onChange={(e) => updateData('vat_rate', parseFloat(e.target.value) || 0)}
                      step="0.1"
                    />
                  </div>
                </div>
              </div>

              <div className="calculator-btn-group">
                <button className="calculator-btn-secondary" onClick={prevStep}>← Back</button>
                <button className="calculator-btn" onClick={nextStep}>Next: Scale & Schedule →</button>
              </div>
            </div>

            {/* Step 3: Scale & Schedule */}
            <div className={`calculator-step-content ${currentStep === 3 ? 'active' : ''}`}>
              <div className="calculator-param-card">
                <div className="calculator-param-card-title">Sizing Mode</div>
                <div className="calculator-radio-cards" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  {([
                    { value: 'budget', label: 'Derive from Budget', desc: 'Auto-calculate unit count' },
                    { value: 'manual', label: 'Manual Unit Count', desc: 'Specify exact number' },
                  ] as const).map((mode) => (
                    <label key={mode.value} className="calculator-radio-card">
                      <input
                        type="radio"
                        name="sizingMode"
                        value={mode.value}
                        checked={data.sizing_mode === mode.value}
                        onChange={() => updateData('sizing_mode', mode.value)}
                      />
                      <div className="calculator-radio-card-content">
                        <div className="calculator-radio-card-label">{mode.label}</div>
                        <div className="calculator-radio-card-desc">{mode.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {data.sizing_mode === 'budget' && (
                <div className="calculator-param-card">
                  <div className="calculator-param-card-title">Budget Allocation</div>
                  <div className="calculator-param-card-subtitle">
                    Total Budget: ${data.total_budget.toLocaleString('en-US')} | Machine Price: ${data.machine_price.toLocaleString('en-US')}/unit
                  </div>
                  <div className="calculator-form-grid-2">
                    <div>
                      <label className="calculator-form-label">Budget for Rigs (%)</label>
                      <input
                        type="range"
                        className="calculator-range-input"
                        min="0"
                        max="100"
                        value={data.rig_budget_percent}
                        onChange={(e) => {
                          const rigPercent = parseFloat(e.target.value)
                          updateData('rig_budget_percent', rigPercent)
                          updateData('infra_budget_percent', 100 - rigPercent)
                        }}
                      />
                      <div style={{ textAlign: 'center', marginTop: 'var(--space-2)', fontSize: 'var(--text-lg)', fontWeight: 700, color: '#C5FFA7' }}>
                        {data.rig_budget_percent}% = ${((data.total_budget * data.rig_budget_percent) / 100).toLocaleString('en-US')}
                      </div>
                      <div style={{ textAlign: 'center', marginTop: 'var(--space-1)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                        ≈ {Math.floor((data.total_budget * (data.rig_budget_percent / 100)) / data.machine_price)} units
                      </div>
                    </div>
                    <div>
                      <label className="calculator-form-label">Budget for Infrastructure (%)</label>
                      <input
                        type="range"
                        className="calculator-range-input"
                        min="0"
                        max="100"
                        value={data.infra_budget_percent}
                        onChange={(e) => {
                          const infraPercent = parseFloat(e.target.value)
                          updateData('infra_budget_percent', infraPercent)
                          updateData('rig_budget_percent', 100 - infraPercent)
                        }}
                      />
                      <div style={{ textAlign: 'center', marginTop: 'var(--space-2)', fontSize: 'var(--text-lg)', fontWeight: 700, color: '#C5FFA7' }}>
                        {data.infra_budget_percent}% = ${((data.total_budget * data.infra_budget_percent) / 100).toLocaleString('en-US')}
                      </div>
                      <div style={{ textAlign: 'center', marginTop: 'var(--space-1)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                        Site, power, cooling
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {data.sizing_mode === 'manual' && (
                <div className="calculator-param-card">
                  <div className="calculator-param-card-title">Manual Configuration</div>
                  <div className="calculator-form-grid-2">
                    <div>
                      <label className="calculator-form-label">Number of Units</label>
                      <input
                        type="number"
                        className="calculator-form-input"
                        value={data.manual_units}
                        onChange={(e) => updateData('manual_units', parseInt(e.target.value) || 0)}
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="calculator-form-label">Total Power (MW)</label>
                      <input
                        type="text"
                        className="calculator-form-input"
                        value={((data.manual_units * data.machine_power) / 1000000).toFixed(2)}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="calculator-param-card">
                <div className="calculator-param-card-title">Deployment Phases</div>
                <div className="calculator-param-card-subtitle">
                  Define when and how many units come online
                </div>
                <div className="calculator-table-container">
                  <table className="calculator-table">
                    <thead>
                      <tr>
                        <th>Phase</th>
                        <th>Units</th>
                        <th>Start Month</th>
                        <th>Ramp (months)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.phases.map((phase, idx) => (
                        <tr key={idx}>
                          <td>Phase {idx + 1}</td>
                          <td>
                            <input
                              type="number"
                              value={phase.units}
                              onChange={(e) => {
                                const newPhases = [...data.phases]
                                newPhases[idx].units = parseInt(e.target.value) || 0
                                updateData('phases', newPhases)
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={phase.start_month}
                              onChange={(e) => {
                                const newPhases = [...data.phases]
                                newPhases[idx].start_month = parseInt(e.target.value) || 0
                                updateData('phases', newPhases)
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={phase.ramp_months}
                              onChange={(e) => {
                                const newPhases = [...data.phases]
                                newPhases[idx].ramp_months = parseInt(e.target.value) || 1
                                updateData('phases', newPhases)
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button 
                  className="calculator-btn-secondary" 
                  style={{ marginTop: 'var(--space-3)' }}
                  onClick={() => {
                    updateData('phases', [...data.phases, { units: 0, start_month: 0, ramp_months: 1 }])
                  }}
                >
                  + Add Phase
                </button>
              </div>

              <div className="calculator-btn-group">
                <button className="calculator-btn-secondary" onClick={prevStep}>← Back</button>
                <button className="calculator-btn" onClick={nextStep}>Next: Revenue →</button>
              </div>
            </div>

            {/* Step 4: Revenue */}
            <div className={`calculator-step-content ${currentStep === 4 ? 'active' : ''}`}>
              <div className="calculator-param-card">
                <div className="calculator-param-card-title">
                  BTC Price Scenario
                  <span className="calculator-badge calculator-badge-default">Market Snapshot: Nov 9, 2025</span>
                </div>
                <div className="calculator-radio-cards">
                  {([
                    { value: 'bear', label: 'Bear', desc: '$60,000 → $50,000' },
                    { value: 'flat', label: 'Flat', desc: '$95,000 (current)' },
                    { value: 'bull', label: 'Bull', desc: '$95,000 → $150,000' },
                    { value: 'custom', label: 'Custom', desc: 'Define your own' },
                  ] as const).map((scenario) => (
                    <label key={scenario.value} className="calculator-radio-card">
                      <input
                        type="radio"
                        name="btcScenario"
                        value={scenario.value}
                        checked={data.btc_scenario === scenario.value}
                        onChange={() => updateData('btc_scenario', scenario.value)}
                      />
                      <div className="calculator-radio-card-content">
                        <div className="calculator-radio-card-label">{scenario.label}</div>
                        <div className="calculator-radio-card-desc">{scenario.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="calculator-param-card">
                <div className="calculator-param-card-title">Custom BTC Price (Optional)</div>
                <div className="calculator-param-card-subtitle">
                  Define a custom BTC price trajectory over the projection horizon.
                </div>
                <div className="calculator-form-grid-2">
                  <div>
                    <label className="calculator-form-label">Start Price ($)</label>
                    <input
                      type="number"
                      className="calculator-form-input"
                      value={data.custom_btc_start}
                      onChange={(e) => updateData('custom_btc_start', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="calculator-form-label">End Price ($)</label>
                    <input
                      type="number"
                      className="calculator-form-input"
                      value={data.custom_btc_end}
                      onChange={(e) => updateData('custom_btc_end', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              <div className="calculator-param-card">
                <div className="calculator-param-card-title">Difficulty Adjustment</div>
                <div className="calculator-form-grid-2">
                  <div>
                    <label className="calculator-form-label">Initial Difficulty</label>
                    <input
                      type="text"
                      className="calculator-form-input"
                      value="120 T"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="calculator-form-label">Annual Growth (%)</label>
                    <input
                      type="number"
                      className="calculator-form-input"
                      value={data.difficulty_growth}
                      onChange={(e) => updateData('difficulty_growth', parseFloat(e.target.value) || 0)}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>

              <div className="calculator-btn-group">
                <button className="calculator-btn-secondary" onClick={prevStep}>← Back</button>
                <button className="calculator-btn" onClick={nextStep}>Next: OPEX & Fees →</button>
              </div>
            </div>

            {/* Step 5: OPEX & Fees */}
            <div className={`calculator-step-content ${currentStep === 5 ? 'active' : ''}`}>
              <div className="calculator-param-card">
                <div className="calculator-param-card-title">Operational Expenses (Monthly)</div>
                <div className="calculator-form-grid-2">
                  <div>
                    <label className="calculator-form-label">Staffing ($)</label>
                    <input
                      type="number"
                      className="calculator-form-input"
                      value={data.opex_staffing}
                      onChange={(e) => updateData('opex_staffing', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="calculator-form-label">Rent / Site ($)</label>
                    <input
                      type="number"
                      className="calculator-form-input"
                      value={data.opex_rent}
                      onChange={(e) => updateData('opex_rent', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="calculator-form-label">Maintenance ($)</label>
                    <input
                      type="number"
                      className="calculator-form-input"
                      value={data.opex_maintenance}
                      onChange={(e) => updateData('opex_maintenance', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="calculator-form-label">Software ($)</label>
                    <input
                      type="number"
                      className="calculator-form-input"
                      value={data.opex_software}
                      onChange={(e) => updateData('opex_software', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="calculator-form-label">Other ($)</label>
                    <input
                      type="number"
                      className="calculator-form-input"
                      value={data.opex_other}
                      onChange={(e) => updateData('opex_other', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              <div className="calculator-param-card">
                <div className="calculator-param-card-title">Pool & Transaction Fees</div>
                <div className="calculator-form-grid-2">
                  <div>
                    <label className="calculator-form-label">Mining Pool Fee (%)</label>
                    <input
                      type="number"
                      className="calculator-form-input"
                      value={data.pool_fee}
                      onChange={(e) => updateData('pool_fee', parseFloat(e.target.value) || 0)}
                      step="0.1"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="calculator-form-label">Transaction Fee (BTC/block)</label>
                    <input
                      type="number"
                      className="calculator-form-input"
                      value={data.tx_fee}
                      onChange={(e) => updateData('tx_fee', parseFloat(e.target.value) || 0)}
                      step="0.000001"
                    />
                  </div>
                </div>
              </div>

              <div className="calculator-btn-group">
                <button className="calculator-btn-secondary" onClick={prevStep}>← Back</button>
                <button className="calculator-btn" onClick={nextStep}>Next: Financing →</button>
              </div>
            </div>

            {/* Step 6: Financing */}
            <div className={`calculator-step-content ${currentStep === 6 ? 'active' : ''}`}>
              <div className="calculator-param-card">
                <div className="calculator-param-card-title">Initial Capital</div>
                <div className="calculator-radio-cards">
                  {([
                    { value: 'equity', label: 'Equity', desc: 'Self-funded / Investors' },
                    { value: 'debt', label: 'Debt', desc: 'Loan / Credit' },
                    { value: 'mixed', label: 'Mixed', desc: 'Equity + Debt' },
                  ] as const).map((source) => (
                    <label key={source.value} className="calculator-radio-card">
                      <input
                        type="radio"
                        name="capitalSource"
                        value={source.value}
                        checked={data.capital_source === source.value}
                        onChange={() => updateData('capital_source', source.value)}
                      />
                      <div className="calculator-radio-card-content">
                        <div className="calculator-radio-card-label">{source.label}</div>
                        <div className="calculator-radio-card-desc">{source.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="calculator-param-card">
                <div className="calculator-param-card-title">Debt Details (If Applicable)</div>
                <div className="calculator-form-grid-3">
                  <div>
                    <label className="calculator-form-label">Loan Amount ($)</label>
                    <input
                      type="number"
                      className="calculator-form-input"
                      value={data.loan_amount}
                      onChange={(e) => updateData('loan_amount', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="calculator-form-label">Interest Rate (%)</label>
                    <input
                      type="number"
                      className="calculator-form-input"
                      value={data.interest_rate}
                      onChange={(e) => updateData('interest_rate', parseFloat(e.target.value) || 0)}
                      step="0.1"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="calculator-form-label">Loan Term (Months)</label>
                    <input
                      type="number"
                      className="calculator-form-input"
                      value={data.loan_term}
                      onChange={(e) => updateData('loan_term', parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="calculator-btn-group">
                <button className="calculator-btn-secondary" onClick={prevStep}>← Back</button>
                <button className="calculator-btn" onClick={nextStep}>Next: Outputs →</button>
              </div>
            </div>

            {/* Step 7: Outputs */}
            <div className={`calculator-step-content ${currentStep === 7 ? 'active' : ''}`}>
              <div className="calculator-param-card">
                <div className="calculator-param-card-title">Output Preferences</div>
                <div className="calculator-radio-cards" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  {([
                    { value: 'summary', label: 'Summary', desc: 'Key metrics only' },
                    { value: 'detailed', label: 'Detailed', desc: 'Full financial breakdown' },
                  ] as const).map((output) => (
                    <label key={output.value} className="calculator-radio-card">
                      <input
                        type="radio"
                        name="outputDetail"
                        value={output.value}
                        checked={data.output_detail === output.value}
                        onChange={() => updateData('output_detail', output.value)}
                      />
                      <div className="calculator-radio-card-content">
                        <div className="calculator-radio-card-label">{output.label}</div>
                        <div className="calculator-radio-card-desc">{output.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="calculator-param-card">
                <div className="calculator-param-card-title">Reporting Frequency</div>
                <div className="calculator-radio-cards">
                  {([
                    { value: 'monthly', label: 'Monthly', desc: 'Granular data' },
                    { value: 'quarterly', label: 'Quarterly', desc: 'Standard business cycles' },
                    { value: 'annually', label: 'Annually', desc: 'High-level overview' },
                  ] as const).map((freq) => (
                    <label key={freq.value} className="calculator-radio-card">
                      <input
                        type="radio"
                        name="reportFrequency"
                        value={freq.value}
                        checked={data.report_frequency === freq.value}
                        onChange={() => updateData('report_frequency', freq.value)}
                      />
                      <div className="calculator-radio-card-content">
                        <div className="calculator-radio-card-label">{freq.label}</div>
                        <div className="calculator-radio-card-desc">{freq.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="calculator-btn-group">
                <button className="calculator-btn-secondary" onClick={prevStep}>← Back</button>
                <button className="calculator-btn" onClick={() => {
                  // Calculate projection logic here
                  console.log('Calculate projection with data:', data)
                  alert('Projection calculation would happen here!')
                }}>
                  Calculate Projection
                </button>
              </div>
            </div>
          </div>

          {/* Summary Panel */}
          <div className="calculator-summary-panel">
            <div className="calculator-summary-title">Projection Summary</div>
            
            <div className="calculator-summary-item">
              <span className="calculator-summary-label">Project</span>
              <span className="calculator-summary-value">{data.project_name}</span>
            </div>
            
            <div className="calculator-summary-item">
              <span className="calculator-summary-label">Machine</span>
              <span className="calculator-summary-value">
                {data.selected_machine === 's23hydro' && 'S23 Hydro'}
                {data.selected_machine === 's21pro' && 'S21 Pro'}
                {data.selected_machine === 'm60s' && 'M60S++'}
                {data.selected_machine === 'custom' && 'Custom'}
              </span>
            </div>
            
            <div className="calculator-summary-item">
              <span className="calculator-summary-label">Units</span>
              <span className="calculator-summary-value">{totalUnits}</span>
            </div>
            
            <div className="calculator-summary-item">
              <span className="calculator-summary-label">Total Hashrate</span>
              <span className="calculator-summary-value">{totalHashrate.toFixed(1)} PH/s</span>
            </div>
            
            <div className="calculator-summary-item">
              <span className="calculator-summary-label">Total Power</span>
              <span className="calculator-summary-value">{totalPower.toFixed(2)} MW</span>
            </div>
            
            <div className="calculator-summary-item" style={{ paddingTop: 'var(--space-3)', marginTop: 'var(--space-3)', borderTop: '1px solid rgba(197, 255, 167, 0.3)' }}>
              <span className="calculator-summary-label">Total Budget</span>
              <span className="calculator-summary-value highlight">${data.total_budget.toLocaleString('en-US')}</span>
            </div>
            
            <div className="calculator-summary-item">
              <span className="calculator-summary-label">Monthly OPEX</span>
              <span className="calculator-summary-value">${monthlyOpex.toLocaleString('en-US')}</span>
            </div>
            
            <div className="calculator-summary-item" style={{ paddingTop: 'var(--space-3)', marginTop: 'var(--space-3)', borderTop: '1px solid rgba(197, 255, 167, 0.3)' }}>
              <span className="calculator-summary-label">Projection Horizon</span>
              <span className="calculator-summary-value highlight">
                {data.horizon_value} {data.horizon_mode === 'YEARS' ? 'Years' : 'Months'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

