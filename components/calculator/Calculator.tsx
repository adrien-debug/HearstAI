'use client'

import { useState, useEffect, useMemo, useCallback, memo, Suspense } from 'react'
import dynamic from 'next/dynamic'
import jsPDF from 'jspdf'
import './Calculator.css'

// Lazy load Chart.js only when needed
const ChartComponents = dynamic(
  () => import('./ChartComponents'),
  { ssr: false }
)

// Types
interface CalculatorData {
  project_name: string
  currency: string
  country: string
  total_budget: number
  operationType: 'maas' | 'self' | 'infra' | 'hybrid'
  horizon_mode: 'YEARS' | 'MONTHS'
  horizon_value: number
  selected_machine: string
  machine_hashrate: number
  machine_power: number
  machine_efficiency: number
  machine_price: number
  selected_hoster?: string
  energy_source: 'grid' | 'gas' | 'hydro' | 'solar'
  base_tariff: number
  demand_charge: number
  curtailment: number
  max_power: number
  pue: number
  vat_rate: number
  sizing_mode: 'budget' | 'manual'
  rig_budget_percent: number
  infra_budget_percent: number
  manual_units: number
  phases: Array<{
    units: number
    start_month: number
    ramp_months: number
  }>
  btc_scenario: 'bear' | 'flat' | 'bull' | 'custom'
  custom_btc_start: number
  custom_btc_end: number
  difficulty_growth: number
  opex_staffing: number
  opex_rent: number
  opex_maintenance: number
  opex_software: number
  opex_other: number
  pool_fee: number
  tx_fee: number
  capital_source: 'equity' | 'debt' | 'mixed'
  loan_amount: number
  interest_rate: number
  loan_term: number
  output_detail: 'summary' | 'detailed'
  report_frequency: 'monthly' | 'quarterly' | 'annually'
}

interface MachineFromAPI {
  id: string
  name: string
  hashrate: number
  power: number
  efficiency: number
  price: number
  coolingType?: string
  manufacturer?: string
  model?: string
  badge?: string
}

interface HosterFromAPI {
  id: number
  name: string
  country: string
  location: string
  electricityPrice: number
  additionalFees: number
  deposit: number
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

// Debounce hook for performance
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

// Memoized Input Component
const MemoizedInput = memo(({ label, type = 'text', value, onChange, placeholder, step, min, max, className = 'calculator-form-input' }: any) => (
  <div>
    <label className="calculator-form-label">{label}</label>
    <input
      type={type}
      className={className}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      step={step}
      min={min}
      max={max}
    />
  </div>
))

MemoizedInput.displayName = 'MemoizedInput'

// Main Calculator Component
export default function Calculator() {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<CalculatorData>(DEFAULT_DATA)
  const [machines, setMachines] = useState<MachineFromAPI[]>([])
  const [machinesLoading, setMachinesLoading] = useState(true)
  const [hosters, setHosters] = useState<HosterFromAPI[]>([])
  const [hostersLoading, setHostersLoading] = useState(true)
  const [btcMetrics, setBtcMetrics] = useState<{ btcPrice: number; networkHashrate: number } | null>(null)
  const [calculationResult, setCalculationResult] = useState<any>(null)
  const [calculating, setCalculating] = useState(false)

  const steps = useMemo(() => [
    { id: 0, label: 'CONTEXT &\nSCENARIO' },
    { id: 1, label: 'MACHINE\nSELECTION' },
    { id: 2, label: 'ENERGY & SITE' },
    { id: 3, label: 'SCALE &\nSCHEDULE' },
    { id: 4, label: 'REVENUE' },
    { id: 5, label: 'OPEX & FEES' },
    { id: 6, label: 'FINANCING' },
    { id: 7, label: 'OUTPUTS' },
  ], [])

  // Memoized callbacks
  const updateData = useCallback((key: keyof CalculatorData, value: any) => {
    setData(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleNumberChange = useCallback((key: keyof CalculatorData, value: string) => {
    if (value === '' || value === '-') {
      updateData(key, undefined)
    } else {
      const numValue = parseFloat(value)
      if (!isNaN(numValue)) {
        updateData(key, numValue)
      }
    }
  }, [updateData])

  const getNumberValue = useCallback((value: number | undefined): string | number => {
    return value !== undefined && value !== null ? value : ''
  }, [])

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
  }, [steps.length])

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }, [])

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step)
  }, [])

  const progressPercent = useMemo(() => ((currentStep + 1) / steps.length) * 100, [currentStep, steps.length])

  // Summary calculations - memoized
  const summaryCalculations = useMemo(() => {
    const totalUnits = data.sizing_mode === 'budget' 
      ? Math.floor((data.total_budget * (data.rig_budget_percent / 100)) / data.machine_price)
      : data.manual_units || 0

    const totalHashrate = (totalUnits * data.machine_hashrate) / 1000
    const totalPower = (totalUnits * data.machine_power) / 1000000
    const monthlyOpex = (data.opex_staffing || 0) + (data.opex_rent || 0) + (data.opex_maintenance || 0) + (data.opex_software || 0) + (data.opex_other || 0)

    return { totalUnits, totalHashrate, totalPower, monthlyOpex }
  }, [data.sizing_mode, data.total_budget, data.rig_budget_percent, data.machine_price, data.manual_units, data.machine_hashrate, data.machine_power, data.opex_staffing, data.opex_rent, data.opex_maintenance, data.opex_software, data.opex_other])

  // Load machines
  useEffect(() => {
    let cancelled = false
    const loadMachines = async () => {
      try {
        setMachinesLoading(true)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
        const baseUrl = apiUrl && apiUrl.startsWith('http') 
          ? `${apiUrl}/api/datas/miners`
          : '/api/datas/miners'
        
        const response = await fetch(baseUrl)
        if (cancelled) return
        
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) {
            const formattedMachines = result.data.map((m: any) => ({
              id: m.id.toString(),
              name: m.name,
              hashrate: parseFloat(m.hashrate || 0),
              power: parseFloat(m.power || 0),
              efficiency: parseFloat(m.efficiency || 0),
              price: parseFloat(m.price || 0),
              coolingType: m.cooling_type || m.coolingType || '',
              manufacturer: m.manufacturer || '',
              model: m.model || '',
            }))
            
            formattedMachines.push({
              id: 'custom',
              name: 'Custom Model',
              hashrate: 0,
              power: 0,
              efficiency: 0,
              price: 0,
              badge: 'Editable',
            })
            
            if (!cancelled) setMachines(formattedMachines)
          }
        }
      } catch (error) {
        if (!cancelled) console.error('Error loading machines:', error)
      } finally {
        if (!cancelled) setMachinesLoading(false)
      }
    }
    
    loadMachines()
    return () => { cancelled = true }
  }, [])

  // Load hosters
  useEffect(() => {
    let cancelled = false
    const loadHosters = async () => {
      try {
        setHostersLoading(true)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
        const baseUrl = apiUrl && apiUrl.startsWith('http') 
          ? `${apiUrl}/api/datas/hosters`
          : '/api/datas/hosters'
        
        const response = await fetch(baseUrl)
        if (cancelled) return
        
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data && !cancelled) {
            setHosters(result.data.map((h: any) => ({
              id: h.id,
              name: h.name,
              country: h.country,
              location: h.location,
              electricityPrice: parseFloat(h.electricity_price || h.electricityPrice || 0),
              additionalFees: parseFloat(h.additional_fees || h.additionalFees || 0),
              deposit: parseFloat(h.deposit || 0),
            })))
          }
        }
      } catch (error) {
        if (!cancelled) console.error('Error loading hosters:', error)
      } finally {
        if (!cancelled) setHostersLoading(false)
      }
    }
    
    loadHosters()
    return () => { cancelled = true }
  }, [])

  // Load BTC metrics
  useEffect(() => {
    let cancelled = false
    const loadBTCMetrics = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
        const baseUrl = apiUrl && apiUrl.startsWith('http') 
          ? `${apiUrl}/api/calculator/metrics`
          : '/api/calculator/metrics'
        
        const response = await fetch(baseUrl)
        if (cancelled) return
        
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data && !cancelled) {
            setBtcMetrics({
              btcPrice: result.data.btcPrice || 95000,
              networkHashrate: result.data.networkHashrate || 600000000,
            })
            if (data.btc_scenario === 'flat' && !data.custom_btc_start) {
              updateData('custom_btc_start', result.data.btcPrice || 95000)
            }
          }
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Error loading BTC metrics:', error)
          setBtcMetrics({ btcPrice: 95000, networkHashrate: 600000000 })
        }
      }
    }
    
    loadBTCMetrics()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCalculate = useCallback(async () => {
    try {
      setCalculating(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''
      const baseUrl = apiUrl && apiUrl.startsWith('http') 
        ? `${apiUrl}/api/calculator/projection`
        : '/api/calculator/projection'
      
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setCalculationResult(result.data)
          setCurrentStep(7)
        } else {
          alert(`Calculation error: ${result.error || 'Unknown error'}`)
        }
      } else {
        alert('Failed to calculate projection. Please check your inputs.')
      }
    } catch (error) {
      console.error('Error calculating projection:', error)
      alert('Error calculating projection. Please try again.')
    } finally {
      setCalculating(false)
    }
  }, [data])

  const handleExport = useCallback(() => {
    if (!calculationResult) return
    const exportData = {
      project: {
        name: data.project_name,
        currency: data.currency,
        country: data.country,
        total_budget: data.total_budget,
      },
      calculation: calculationResult,
      timestamp: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mining-calculation-${data.project_name || 'project'}-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [calculationResult, data])

  const handleSave = useCallback(() => {
    if (!calculationResult) return
    const savedCalculations = JSON.parse(localStorage.getItem('calculator-history') || '[]')
    const newCalculation = {
      id: Date.now().toString(),
      project_name: data.project_name,
      timestamp: new Date().toISOString(),
      data: data,
      result: calculationResult,
    }
    savedCalculations.unshift(newCalculation)
    if (savedCalculations.length > 50) {
      savedCalculations.pop()
    }
    localStorage.setItem('calculator-history', JSON.stringify(savedCalculations))
    alert('Calculation saved successfully!')
  }, [calculationResult, data])

  const handleGeneratePDF = useCallback(() => {
    if (!calculationResult) return

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    let yPosition = margin
    const lineHeight = 7
    const sectionSpacing = 10

    // Helper function to add a new page if needed
    const checkNewPage = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        doc.addPage()
        yPosition = margin
        return true
      }
      return false
    }

    // Helper function to add text with word wrap
    const addText = (text: string, fontSize: number = 10, isBold: boolean = false, color: number[] = [0, 0, 0]) => {
      doc.setFontSize(fontSize)
      doc.setTextColor(color[0], color[1], color[2])
      if (isBold) {
        doc.setFont('helvetica', 'bold')
      } else {
        doc.setFont('helvetica', 'normal')
      }
      
      const maxWidth = pageWidth - 2 * margin
      const lines = doc.splitTextToSize(text, maxWidth)
      
      checkNewPage(lines.length * lineHeight)
      
      lines.forEach((line: string) => {
        doc.text(line, margin, yPosition)
        yPosition += lineHeight
      })
    }

    // Title
    addText('Mining Profitability Calculator Report', 18, true, [0, 0, 0])
    yPosition += 5
    addText(`Project: ${data.project_name}`, 12, true)
    addText(`Generated: ${new Date().toLocaleString()}`, 10, false, [100, 100, 100])
    yPosition += sectionSpacing

    // Project Information Section
    checkNewPage(30)
    addText('PROJECT INFORMATION', 14, true, [0, 0, 0])
    yPosition += 3
    addText(`Project Name: ${data.project_name}`, 10)
    addText(`Currency: ${data.currency}`, 10)
    addText(`Country/Location: ${data.country}`, 10)
    addText(`Total Budget: ${data.currency} ${data.total_budget.toLocaleString('en-US')}`, 10)
    addText(`Operation Type: ${data.operationType.toUpperCase()}`, 10)
    addText(`Projection Horizon: ${data.horizon_value} ${data.horizon_mode}`, 10)
    yPosition += sectionSpacing

    // Machine Specifications
    checkNewPage(30)
    addText('MACHINE SPECIFICATIONS', 14, true, [0, 0, 0])
    yPosition += 3
    addText(`Selected Machine: ${data.selected_machine}`, 10)
    addText(`Hashrate: ${data.machine_hashrate} TH/s`, 10)
    addText(`Power Draw: ${data.machine_power} W`, 10)
    addText(`Efficiency: ${data.machine_efficiency} J/TH`, 10)
    addText(`Unit Price: ${data.currency} ${data.machine_price.toLocaleString('en-US')}`, 10)
    yPosition += sectionSpacing

    // Energy & Site Configuration
    checkNewPage(40)
    addText('ENERGY & SITE CONFIGURATION', 14, true, [0, 0, 0])
    yPosition += 3
    addText(`Energy Source: ${data.energy_source.toUpperCase()}`, 10)
    addText(`Base Tariff: ${data.currency} ${data.base_tariff}/kWh`, 10)
    addText(`Demand Charge: ${data.currency} ${data.demand_charge}/kW/month`, 10)
    addText(`Curtailment: ${data.curtailment}%`, 10)
    addText(`Max Available Power: ${data.max_power} MW`, 10)
    addText(`PUE / Cooling Factor: ${data.pue}`, 10)
    addText(`VAT Rate: ${data.vat_rate}%`, 10)
    yPosition += sectionSpacing

    // Deployment Configuration
    checkNewPage(30)
    addText('DEPLOYMENT CONFIGURATION', 14, true, [0, 0, 0])
    yPosition += 3
    addText(`Sizing Mode: ${data.sizing_mode === 'budget' ? 'Budget-based' : 'Manual'}`, 10)
    if (data.sizing_mode === 'budget') {
      addText(`Rig Budget: ${data.rig_budget_percent}%`, 10)
      addText(`Infrastructure Budget: ${data.infra_budget_percent}%`, 10)
    } else {
      addText(`Manual Units: ${data.manual_units}`, 10)
    }
    addText(`Total Units: ${calculationResult.summary.total_units}`, 10, true)
    addText(`Total Hashrate: ${calculationResult.summary.total_hashrate_ph.toFixed(2)} PH/s`, 10, true)
    yPosition += sectionSpacing

    // Revenue Configuration
    checkNewPage(30)
    addText('REVENUE CONFIGURATION', 14, true, [0, 0, 0])
    yPosition += 3
    addText(`BTC Scenario: ${data.btc_scenario.toUpperCase()}`, 10)
    if (data.btc_scenario === 'custom') {
      addText(`Custom BTC Start Price: ${data.currency} ${data.custom_btc_start.toLocaleString('en-US')}`, 10)
      addText(`Custom BTC End Price: ${data.currency} ${data.custom_btc_end.toLocaleString('en-US')}`, 10)
    }
    addText(`Difficulty Growth: ${data.difficulty_growth}% annually`, 10)
    yPosition += sectionSpacing

    // OPEX Configuration
    checkNewPage(30)
    addText('OPERATIONAL EXPENSES', 14, true, [0, 0, 0])
    yPosition += 3
    addText(`Staffing: ${data.currency} ${data.opex_staffing.toLocaleString('en-US')}/month`, 10)
    addText(`Rent/Site: ${data.currency} ${data.opex_rent.toLocaleString('en-US')}/month`, 10)
    addText(`Maintenance: ${data.currency} ${data.opex_maintenance.toLocaleString('en-US')}/month`, 10)
    addText(`Software: ${data.currency} ${data.opex_software.toLocaleString('en-US')}/month`, 10)
    addText(`Other: ${data.currency} ${data.opex_other.toLocaleString('en-US')}/month`, 10)
    addText(`Pool Fee: ${data.pool_fee}%`, 10)
    addText(`Transaction Fee: ${data.tx_fee} BTC/block`, 10)
    yPosition += sectionSpacing

    // Financing Configuration
    checkNewPage(30)
    addText('FINANCING', 14, true, [0, 0, 0])
    yPosition += 3
    addText(`Capital Source: ${data.capital_source.toUpperCase()}`, 10)
    if (data.capital_source !== 'equity') {
      addText(`Loan Amount: ${data.currency} ${data.loan_amount.toLocaleString('en-US')}`, 10)
      addText(`Interest Rate: ${data.interest_rate}%`, 10)
      addText(`Loan Term: ${data.loan_term} months`, 10)
    }
    yPosition += sectionSpacing

    // Summary Results
    checkNewPage(50)
    addText('SUMMARY RESULTS', 16, true, [0, 0, 0])
    yPosition += 5
    addText(`Total Units: ${calculationResult.summary.total_units}`, 12, true)
    addText(`Total Hashrate: ${calculationResult.summary.total_hashrate_ph.toFixed(2)} PH/s`, 12, true)
    addText(`Total CAPEX: ${data.currency} ${calculationResult.summary.total_capex.toLocaleString('en-US')}`, 12, true)
    addText(`Total BTC Mined: ${calculationResult.btc_production.total_btc.toFixed(4)} BTC`, 12, true)
    yPosition += sectionSpacing

    // ROI Analysis
    checkNewPage(40)
    addText('ROI ANALYSIS', 14, true, [0, 0, 0])
    yPosition += 3
    if (calculationResult.roi.roi_1_year !== null && calculationResult.roi.roi_1_year !== undefined) {
      addText(`1 Year ROI: ${calculationResult.roi.roi_1_year.toFixed(1)}%`, 10, true)
    }
    if (calculationResult.roi.roi_2_years !== null && calculationResult.roi.roi_2_years !== undefined) {
      addText(`2 Year ROI: ${calculationResult.roi.roi_2_years.toFixed(1)}%`, 10, true)
    }
    if (calculationResult.roi.roi_lifespan !== null && calculationResult.roi.roi_lifespan !== undefined) {
      addText(`Lifespan ROI: ${calculationResult.roi.roi_lifespan.toFixed(1)}%`, 10, true)
    }
    if (calculationResult.roi.break_even_months !== null && calculationResult.roi.break_even_months !== undefined) {
      addText(`Break-Even Period: ${calculationResult.roi.break_even_months} months`, 10, true)
    }
    yPosition += sectionSpacing

    // Net Profit
    checkNewPage(30)
    addText('PROFITABILITY', 14, true, [0, 0, 0])
    yPosition += 3
    const netProfitColor = calculationResult.net_profit.total_net >= 0 ? [0, 150, 0] : [200, 0, 0]
    addText(`Total Net Profit: ${data.currency} ${calculationResult.net_profit.total_net.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, 12, true, netProfitColor)
    addText(`Profit Margin: ${calculationResult.net_profit.margin_percent.toFixed(1)}%`, 10, true)
    yPosition += sectionSpacing

    // Monthly Projections Table (first 12 months)
    if (calculationResult.monthly_projections && calculationResult.monthly_projections.length > 0) {
      checkNewPage(60)
      addText('MONTHLY PROJECTIONS (First 12 Months)', 14, true, [0, 0, 0])
      yPosition += 5

      // Table header
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      const tableStartY = yPosition
      const colWidths = [15, 25, 30, 30, 30, 30]
      const headers = ['Month', 'BTC', 'Revenue', 'OPEX', 'Net', 'Cumulative']
      let xPos = margin

      headers.forEach((header, idx) => {
        doc.text(header, xPos, yPosition)
        xPos += colWidths[idx]
      })
      yPosition += lineHeight

      // Table rows
      doc.setFont('helvetica', 'normal')
      const monthsToShow = Math.min(12, calculationResult.monthly_projections.length)
      
      for (let i = 0; i < monthsToShow; i++) {
        checkNewPage(10)
        const month = calculationResult.monthly_projections[i]
        xPos = margin
        doc.text(`${i + 1}`, xPos, yPosition)
        xPos += colWidths[0]
        doc.text(month.btc_mined?.toFixed(4) || '0', xPos, yPosition)
        xPos += colWidths[1]
        doc.text(`${data.currency} ${(month.revenue || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`, xPos, yPosition)
        xPos += colWidths[2]
        doc.text(`${data.currency} ${(month.total_opex || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`, xPos, yPosition)
        xPos += colWidths[3]
        doc.text(`${data.currency} ${(month.net_profit || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`, xPos, yPosition)
        xPos += colWidths[4]
        doc.text(`${data.currency} ${(month.cumulative_net || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`, xPos, yPosition)
        yPosition += lineHeight
      }
    }

    // Footer
    const totalPages = doc.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(
        `Page ${i} of ${totalPages} - HearstAI Mining Calculator`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      )
    }

    // Save the PDF
    const fileName = `mining-calculation-${data.project_name || 'project'}-${Date.now()}.pdf`
    doc.save(fileName)
  }, [calculationResult, data])

  // Render step content - only active step renders
  const renderStepContent = useCallback(() => {
    switch (currentStep) {
      case 0:
        return (
          <div className="calculator-step-content active">
            <div className="calculator-param-card">
              <div className="calculator-param-card-title">
                PROJECT INFORMATION
                <span className="calculator-badge calculator-badge-green">ALL EDITABLE</span>
              </div>
              <div className="calculator-form-grid-2">
                <MemoizedInput
                  label="Project Name"
                  value={data.project_name}
                  onChange={(e: any) => updateData('project_name', e.target.value)}
                  placeholder="My Mining Project"
                />
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
                <MemoizedInput
                  label="Country / Location"
                  value={data.country}
                  onChange={(e: any) => updateData('country', e.target.value)}
                  placeholder="United States"
                />
                <MemoizedInput
                  label="Total Budget (Optional)"
                  type="number"
                  value={getNumberValue(data.total_budget)}
                  onChange={(e: any) => handleNumberChange('total_budget', e.target.value)}
                  placeholder="2500000"
                />
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
                <MemoizedInput
                  label="Duration"
                  type="number"
                  value={getNumberValue(data.horizon_value)}
                  onChange={(e: any) => {
                    if (e.target.value === '' || e.target.value === '-') {
                      updateData('horizon_value', undefined)
                    } else {
                      const intValue = parseInt(e.target.value)
                      if (!isNaN(intValue)) {
                        updateData('horizon_value', intValue)
                      }
                    }
                  }}
                  min={1}
                />
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
        )

      case 1:
        return (
          <div className="calculator-step-content active">
            <div className="calculator-param-card">
              <div className="calculator-param-card-title">
                Select ASIC Model
                <span className="calculator-badge calculator-badge-default">Market Snapshot: Nov 9, 2025</span>
              </div>
              <div className="calculator-param-card-subtitle">
                Choose your mining hardware. Specs are pre-filled from market data but fully editable.
              </div>
              <div className="calculator-machine-grid">
                {machinesLoading ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-secondary)' }}>
                    Loading machines...
                  </div>
                ) : machines.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-secondary)' }}>
                    No machines available. Please add machines in the Data section.
                  </div>
                ) : (
                  machines.map((machine) => (
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
                  ))
                )}
              </div>
            </div>

            <div className="calculator-param-card">
              <div className="calculator-param-card-title">Machine Specifications (Editable)</div>
              <div className="calculator-form-grid-4">
                <MemoizedInput
                  label="Hashrate (TH/s)"
                  type="number"
                  value={getNumberValue(data.machine_hashrate)}
                  onChange={(e: any) => handleNumberChange('machine_hashrate', e.target.value)}
                />
                <MemoizedInput
                  label="Power Draw (W)"
                  type="number"
                  value={getNumberValue(data.machine_power)}
                  onChange={(e: any) => handleNumberChange('machine_power', e.target.value)}
                />
                <MemoizedInput
                  label="Efficiency (J/TH)"
                  type="number"
                  value={getNumberValue(data.machine_efficiency)}
                  onChange={(e: any) => handleNumberChange('machine_efficiency', e.target.value)}
                  step="0.1"
                />
                <MemoizedInput
                  label="Unit Price ($)"
                  type="number"
                  value={getNumberValue(data.machine_price)}
                  onChange={(e: any) => handleNumberChange('machine_price', e.target.value)}
                />
              </div>
            </div>

            <div className="calculator-btn-group">
              <button className="calculator-btn-secondary" onClick={prevStep}>← Back</button>
              <button className="calculator-btn" onClick={nextStep}>Next: Energy & Site →</button>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="calculator-step-content active">
            <div className="calculator-param-card">
              <div className="calculator-param-card-title">
                Select Hoster (Optional)
                <span className="calculator-badge calculator-badge-default">Pre-configured rates</span>
              </div>
              <div className="calculator-param-card-subtitle">
                Choose a hoster to auto-fill electricity rates, or enter custom rates below.
              </div>
              {hostersLoading ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-4)', color: 'var(--text-secondary)' }}>
                  Loading hosters...
                </div>
              ) : hosters.length > 0 ? (
                <div className="calculator-machine-grid">
                  {hosters.map((hoster) => (
                    <div
                      key={hoster.id}
                      className={`calculator-machine-card ${data.selected_hoster === hoster.id.toString() ? 'selected' : ''}`}
                      onClick={() => {
                        updateData('selected_hoster', hoster.id.toString())
                        updateData('base_tariff', hoster.electricityPrice)
                      }}
                    >
                      <div className="calculator-machine-card-header">
                        <div className="calculator-machine-name">{hoster.name}</div>
                      </div>
                      <div className="calculator-machine-specs">
                        <div className="calculator-machine-spec">
                          <span className="calculator-machine-spec-label">Location</span>
                          <span className="calculator-machine-spec-value">{hoster.location}, {hoster.country}</span>
                        </div>
                        <div className="calculator-machine-spec">
                          <span className="calculator-machine-spec-label">Electricity</span>
                          <span className="calculator-machine-spec-value">${hoster.electricityPrice.toFixed(4)}/kWh</span>
                        </div>
                        <div className="calculator-machine-spec">
                          <span className="calculator-machine-spec-label">Additional Fees</span>
                          <span className="calculator-machine-spec-value">${hoster.additionalFees}/mo</span>
                        </div>
                      </div>
                      <div className="calculator-machine-price">
                        Deposit: <span className="calculator-machine-price-value">${hoster.deposit.toLocaleString('en-US')}</span>
                      </div>
                    </div>
                  ))}
                  <div
                    className={`calculator-machine-card ${!data.selected_hoster ? 'selected' : ''}`}
                    onClick={() => updateData('selected_hoster', '')}
                  >
                    <div className="calculator-machine-card-header">
                      <div className="calculator-machine-name">Custom Rates</div>
                    </div>
                    <div className="calculator-machine-specs">
                      <div className="calculator-machine-spec">
                        <span className="calculator-machine-spec-label">Enter your own rates</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: 'var(--space-4)', color: 'var(--text-secondary)' }}>
                  No hosters available. Please enter custom rates below.
                </div>
              )}
            </div>

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
                <MemoizedInput
                  label="Base Tariff ($/kWh)"
                  type="number"
                  value={getNumberValue(data.base_tariff)}
                  onChange={(e: any) => handleNumberChange('base_tariff', e.target.value)}
                  step="0.001"
                />
                <MemoizedInput
                  label="Demand Charge ($/kW/mo)"
                  type="number"
                  value={getNumberValue(data.demand_charge)}
                  onChange={(e: any) => handleNumberChange('demand_charge', e.target.value)}
                  step="0.1"
                />
                <MemoizedInput
                  label="Curtailment (% hours)"
                  type="number"
                  value={getNumberValue(data.curtailment)}
                  onChange={(e: any) => handleNumberChange('curtailment', e.target.value)}
                  min={0}
                  max={100}
                />
              </div>
            </div>

            <div className="calculator-param-card">
              <div className="calculator-param-card-title">Site Constraints</div>
              <div className="calculator-form-grid-3">
                <MemoizedInput
                  label="Max Available Power (MW)"
                  type="number"
                  value={getNumberValue(data.max_power)}
                  onChange={(e: any) => handleNumberChange('max_power', e.target.value)}
                  step="0.1"
                />
                <MemoizedInput
                  label="PUE / Cooling Factor"
                  type="number"
                  value={getNumberValue(data.pue)}
                  onChange={(e: any) => handleNumberChange('pue', e.target.value)}
                  step="0.01"
                />
                <MemoizedInput
                  label="VAT on CAPEX (%)"
                  type="number"
                  value={getNumberValue(data.vat_rate)}
                  onChange={(e: any) => handleNumberChange('vat_rate', e.target.value)}
                  step="0.1"
                />
              </div>
            </div>

            <div className="calculator-btn-group">
              <button className="calculator-btn-secondary" onClick={prevStep}>← Back</button>
              <button className="calculator-btn" onClick={nextStep}>Next: Scale & Schedule →</button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="calculator-step-content active">
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
                  <MemoizedInput
                    label="Number of Units"
                    type="number"
                    value={getNumberValue(data.manual_units)}
                    onChange={(e: any) => {
                      if (e.target.value === '' || e.target.value === '-') {
                        updateData('manual_units', undefined)
                      } else {
                        const intValue = parseInt(e.target.value)
                        if (!isNaN(intValue)) {
                          updateData('manual_units', intValue)
                        }
                      }
                    }}
                    min={1}
                  />
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
                    {data.phases.map((phase: any, idx: number) => (
                      <tr key={idx}>
                        <td>Phase {idx + 1}</td>
                        <td>
                          <input
                            type="number"
                            value={phase.units !== undefined ? phase.units : ''}
                            onChange={(e) => {
                              const newPhases = [...data.phases]
                              const unitsValue = e.target.value === '' ? 0 : parseInt(e.target.value)
                              newPhases[idx].units = !isNaN(unitsValue) ? unitsValue : 0
                              updateData('phases', newPhases)
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={phase.start_month !== undefined ? phase.start_month : ''}
                            onChange={(e) => {
                              const newPhases = [...data.phases]
                              const monthValue = e.target.value === '' ? 0 : parseInt(e.target.value)
                              newPhases[idx].start_month = !isNaN(monthValue) ? monthValue : 0
                              updateData('phases', newPhases)
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={phase.ramp_months !== undefined ? phase.ramp_months : ''}
                            onChange={(e) => {
                              const newPhases = [...data.phases]
                              const rampValue = e.target.value === '' ? 1 : parseInt(e.target.value)
                              newPhases[idx].ramp_months = !isNaN(rampValue) ? rampValue : 1
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
        )

      case 4:
        return (
          <div className="calculator-step-content active">
            <div className="calculator-param-card">
              <div className="calculator-param-card-title">
                BTC Price Scenario
                <span className="calculator-badge calculator-badge-default">Market Snapshot: Nov 9, 2025</span>
              </div>
              <div className="calculator-radio-cards">
                {([
                  { value: 'bear', label: 'Bear', desc: '$60,000 → $50,000' },
                  { value: 'flat', label: 'Flat', desc: `$${btcMetrics?.btcPrice?.toLocaleString() || '95,000'} (current)` },
                  { value: 'bull', label: 'Bull', desc: `$${btcMetrics?.btcPrice?.toLocaleString() || '95,000'} → $150,000` },
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
                <MemoizedInput
                  label="Start Price ($)"
                  type="number"
                  value={getNumberValue(data.custom_btc_start)}
                  onChange={(e: any) => handleNumberChange('custom_btc_start', e.target.value)}
                />
                <MemoizedInput
                  label="End Price ($)"
                  type="number"
                  value={getNumberValue(data.custom_btc_end)}
                  onChange={(e: any) => handleNumberChange('custom_btc_end', e.target.value)}
                />
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
                <MemoizedInput
                  label="Annual Growth (%)"
                  type="number"
                  value={getNumberValue(data.difficulty_growth)}
                  onChange={(e: any) => handleNumberChange('difficulty_growth', e.target.value)}
                  min={0}
                  max={100}
                />
              </div>
            </div>

            <div className="calculator-btn-group">
              <button className="calculator-btn-secondary" onClick={prevStep}>← Back</button>
              <button className="calculator-btn" onClick={nextStep}>Next: OPEX & Fees →</button>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="calculator-step-content active">
            <div className="calculator-param-card">
              <div className="calculator-param-card-title">Operational Expenses (Monthly)</div>
              <div className="calculator-form-grid-2">
                <MemoizedInput
                  label="Staffing ($)"
                  type="number"
                  value={getNumberValue(data.opex_staffing)}
                  onChange={(e: any) => handleNumberChange('opex_staffing', e.target.value)}
                />
                <MemoizedInput
                  label="Rent / Site ($)"
                  type="number"
                  value={getNumberValue(data.opex_rent)}
                  onChange={(e: any) => handleNumberChange('opex_rent', e.target.value)}
                />
                <MemoizedInput
                  label="Maintenance ($)"
                  type="number"
                  value={getNumberValue(data.opex_maintenance)}
                  onChange={(e: any) => handleNumberChange('opex_maintenance', e.target.value)}
                />
                <MemoizedInput
                  label="Software ($)"
                  type="number"
                  value={getNumberValue(data.opex_software)}
                  onChange={(e: any) => handleNumberChange('opex_software', e.target.value)}
                />
                <MemoizedInput
                  label="Other ($)"
                  type="number"
                  value={getNumberValue(data.opex_other)}
                  onChange={(e: any) => handleNumberChange('opex_other', e.target.value)}
                />
              </div>
            </div>

            <div className="calculator-param-card">
              <div className="calculator-param-card-title">Pool & Transaction Fees</div>
              <div className="calculator-form-grid-2">
                <MemoizedInput
                  label="Mining Pool Fee (%)"
                  type="number"
                  value={getNumberValue(data.pool_fee)}
                  onChange={(e: any) => handleNumberChange('pool_fee', e.target.value)}
                  step="0.1"
                  min={0}
                  max={100}
                />
                <MemoizedInput
                  label="Transaction Fee (BTC/block)"
                  type="number"
                  value={getNumberValue(data.tx_fee)}
                  onChange={(e: any) => handleNumberChange('tx_fee', e.target.value)}
                  step="0.000001"
                />
              </div>
            </div>

            <div className="calculator-btn-group">
              <button className="calculator-btn-secondary" onClick={prevStep}>← Back</button>
              <button className="calculator-btn" onClick={nextStep}>Next: Financing →</button>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="calculator-step-content active">
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
                <MemoizedInput
                  label="Loan Amount ($)"
                  type="number"
                  value={getNumberValue(data.loan_amount)}
                  onChange={(e: any) => handleNumberChange('loan_amount', e.target.value)}
                />
                <MemoizedInput
                  label="Interest Rate (%)"
                  type="number"
                  value={getNumberValue(data.interest_rate)}
                  onChange={(e: any) => handleNumberChange('interest_rate', e.target.value)}
                  step="0.1"
                  min={0}
                  max={100}
                />
                <MemoizedInput
                  label="Loan Term (Months)"
                  type="number"
                  value={getNumberValue(data.loan_term)}
                  onChange={(e: any) => {
                    if (e.target.value === '' || e.target.value === '-') {
                      updateData('loan_term', undefined)
                    } else {
                      const intValue = parseInt(e.target.value)
                      if (!isNaN(intValue)) {
                        updateData('loan_term', intValue)
                      }
                    }
                  }}
                  min={0}
                />
              </div>
            </div>

            <div className="calculator-btn-group">
              <button className="calculator-btn-secondary" onClick={prevStep}>← Back</button>
              <button className="calculator-btn" onClick={nextStep}>Next: Outputs →</button>
            </div>
          </div>
        )

      case 7:
        return (
          <div className="calculator-step-content active">
            {calculationResult ? (
              <>
                <div className="calculator-param-card">
                  <div className="calculator-param-card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Calculation Results</span>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button
                        onClick={handleGeneratePDF}
                        className="calculator-btn"
                        style={{ padding: 'var(--space-2) var(--space-4)', fontSize: 'var(--text-sm)' }}
                      >
                        Generate PDF
                      </button>
                      <button
                        onClick={handleExport}
                        className="calculator-btn-secondary"
                        style={{ padding: 'var(--space-2) var(--space-4)', fontSize: 'var(--text-sm)' }}
                      >
                        Export JSON
                      </button>
                      <button
                        onClick={handleSave}
                        className="calculator-btn-secondary"
                        style={{ padding: 'var(--space-2) var(--space-4)', fontSize: 'var(--text-sm)' }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                  
                  {/* Summary Metrics */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                    <div style={{ padding: 'var(--space-4)', background: 'rgba(197, 255, 167, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(197, 255, 167, 0.2)' }}>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Total Units</div>
                      <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#C5FFA7' }}>{calculationResult.summary.total_units}</div>
                    </div>
                    <div style={{ padding: 'var(--space-4)', background: 'rgba(197, 255, 167, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(197, 255, 167, 0.2)' }}>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Total Hashrate</div>
                      <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#C5FFA7' }}>{calculationResult.summary.total_hashrate_ph.toFixed(2)} PH/s</div>
                    </div>
                    <div style={{ padding: 'var(--space-4)', background: 'rgba(197, 255, 167, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(197, 255, 167, 0.2)' }}>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Total CAPEX</div>
                      <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#C5FFA7' }}>${calculationResult.summary.total_capex.toLocaleString('en-US')}</div>
                    </div>
                    <div style={{ padding: 'var(--space-4)', background: 'rgba(197, 255, 167, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(197, 255, 167, 0.2)' }}>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Break-Even</div>
                      <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#C5FFA7' }}>
                        {calculationResult.roi.break_even_months ? `${calculationResult.roi.break_even_months} months` : 'N/A'}
                      </div>
                    </div>
                    <div style={{ padding: 'var(--space-4)', background: 'rgba(197, 255, 167, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(197, 255, 167, 0.2)' }}>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Total BTC Mined</div>
                      <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#C5FFA7' }}>{calculationResult.btc_production.total_btc.toFixed(4)} BTC</div>
                    </div>
                    <div style={{ padding: 'var(--space-4)', background: 'rgba(197, 255, 167, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(197, 255, 167, 0.2)' }}>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>Net Profit</div>
                      <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: calculationResult.net_profit.total_net >= 0 ? '#C5FFA7' : '#FF4D4D' }}>
                        ${calculationResult.net_profit.total_net.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                  </div>

                  {/* ROI Metrics */}
                  <div style={{ marginBottom: 'var(--space-6)' }}>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: '#ffffff', marginBottom: 'var(--space-4)' }}>ROI Analysis</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-3)' }}>
                      <div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>1 Year ROI</div>
                        <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: calculationResult.roi.roi_1_year && calculationResult.roi.roi_1_year >= 0 ? '#C5FFA7' : '#FF4D4D' }}>
                          {calculationResult.roi.roi_1_year ? `${calculationResult.roi.roi_1_year.toFixed(1)}%` : 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>2 Year ROI</div>
                        <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: calculationResult.roi.roi_2_years && calculationResult.roi.roi_2_years >= 0 ? '#C5FFA7' : '#FF4D4D' }}>
                          {calculationResult.roi.roi_2_years ? `${calculationResult.roi.roi_2_years.toFixed(1)}%` : 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Lifespan ROI</div>
                        <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: calculationResult.roi.roi_lifespan && calculationResult.roi.roi_lifespan >= 0 ? '#C5FFA7' : '#FF4D4D' }}>
                          {calculationResult.roi.roi_lifespan ? `${calculationResult.roi.roi_lifespan.toFixed(1)}%` : 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Profit Margin</div>
                        <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: calculationResult.net_profit.margin_percent >= 0 ? '#C5FFA7' : '#FF4D4D' }}>
                          {calculationResult.net_profit.margin_percent.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Charts - Only render when needed */}
                  {calculationResult.monthly_projections && calculationResult.monthly_projections.length > 0 && (
                    <Suspense fallback={<div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Loading charts...</div>}>
                      <ChartComponents calculationResult={calculationResult} />
                    </Suspense>
                  )}

                  <div className="calculator-btn-group">
                    <button className="calculator-btn-secondary" onClick={() => setCalculationResult(null)}>Recalculate</button>
                    <button className="calculator-btn-secondary" onClick={prevStep}>← Back</button>
                  </div>
                </div>
              </>
            ) : (
              <>
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
                  <button 
                    className="calculator-btn" 
                    onClick={handleCalculate}
                    disabled={calculating}
                  >
                    {calculating ? 'Calculating...' : 'Calculate Projection'}
                  </button>
                </div>
              </>
            )}
          </div>
        )

      default:
        return null
    }
  }, [currentStep, data, updateData, getNumberValue, handleNumberChange, nextStep, prevStep, machines, machinesLoading, hosters, hostersLoading, btcMetrics, calculationResult, calculating, handleCalculate, handleExport, handleSave, handleGeneratePDF])

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: '#ffffff', position: 'relative', zIndex: 10 }}>Mining Profitability Calculator</h1>
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

        {/* Content Grid - Only active step renders */}
        <div className="calculator-content-grid">
          <div className="calculator-steps-container">
            {renderStepContent()}
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
              <span className="calculator-summary-value">{data.selected_machine}</span>
            </div>
            <div className="calculator-summary-item">
              <span className="calculator-summary-label">Units</span>
              <span className="calculator-summary-value">{summaryCalculations.totalUnits}</span>
            </div>
            <div className="calculator-summary-item">
              <span className="calculator-summary-label">Total Hashrate</span>
              <span className="calculator-summary-value">{summaryCalculations.totalHashrate.toFixed(1)} PH/s</span>
            </div>
            <div className="calculator-summary-item">
              <span className="calculator-summary-label">Total Power</span>
              <span className="calculator-summary-value">{summaryCalculations.totalPower.toFixed(2)} MW</span>
            </div>
            <div className="calculator-summary-item" style={{ paddingTop: 'var(--space-3)', marginTop: 'var(--space-3)', borderTop: '1px solid rgba(197, 255, 167, 0.3)' }}>
              <span className="calculator-summary-label">Total Budget</span>
              <span className="calculator-summary-value highlight">${data.total_budget.toLocaleString('en-US')}</span>
            </div>
            <div className="calculator-summary-item">
              <span className="calculator-summary-label">Monthly OPEX</span>
              <span className="calculator-summary-value">${summaryCalculations.monthlyOpex.toLocaleString('en-US')}</span>
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

