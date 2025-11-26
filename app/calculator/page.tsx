'use client'

import React, { useState, useEffect, useRef } from 'react'
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
// DONNÉES PAR DÉFAUT (si localStorage vide)
// ====================================
const DEFAULT_MACHINES: Machine[] = [
  { id: 's23-hydro', name: 'Antminer S23 Hydro', hashrate: 605, power: 5870, efficiency: 9.7, price: 8500 },
  { id: 's21-pro', name: 'Antminer S21 Pro', hashrate: 234, power: 3510, efficiency: 15.0, price: 4008 },
  { id: 's21', name: 'Antminer S21', hashrate: 200, power: 3550, efficiency: 17.75, price: 3500 },
  { id: 'm60s', name: 'Whatsminer M60S++', hashrate: 372, power: 7200, efficiency: 19.4, price: 5800 },
  { id: 'm53s', name: 'Whatsminer M53S++', hashrate: 320, power: 5040, efficiency: 15.75, price: 4200 },
]

const DEFAULT_HOSTERS: Hoster[] = [
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
  const [machines, setMachines] = useState<Machine[]>([])
  const [hosters, setHosters] = useState<Hoster[]>([])
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null)
  const [selectedHoster, setSelectedHoster] = useState<Hoster | null>(null)
  const [lifespan, setLifespan] = useState<number>(3) // années
  const [capex, setCapex] = useState<number>(0)
  const [electricityRate, setElectricityRate] = useState<number>(0.07)
  const [btcPrice, setBtcPrice] = useState<number>(95000)
  const [btcHashrate, setBtcHashrate] = useState<number>(600000000) // TH/s (toujours en TH/s en interne)
  const [revenuePerTH, setRevenuePerTH] = useState<number>(0) // $/TH/s/jour
  // Note: btcHashrate est en TH/s en interne, on convertit pour l'affichage en EH/s
  const [loading, setLoading] = useState<boolean>(false)
  const [mounted, setMounted] = useState<boolean>(false)
  // Flags pour garantir l'ordre d'initialisation et éviter les race conditions
  const [dataLoaded, setDataLoaded] = useState<boolean>(false) // Machines et hosters chargés
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [machineDropdownOpen, setMachineDropdownOpen] = useState<boolean>(false)
  const [hosterDropdownOpen, setHosterDropdownOpen] = useState<boolean>(false)
  const [calculationTriggered, setCalculationTriggered] = useState<boolean>(false)
  const [formulasModalOpen, setFormulasModalOpen] = useState<boolean>(false)
  
  // Paramètres de formules éditables
  const [formulaParams, setFormulaParams] = useState({
    blocksPerDay: 144,
    btcPerBlock: 3.125,
    customFormula: false,
  })
  
  // État pour les tests
  const [testResults, setTestResults] = useState<Array<{
    name: string
    inputs: any
    results: CalculationResult | null
  }>>([])

  // Charger les paramètres de formules depuis localStorage
  useEffect(() => {
    const savedParams = localStorage.getItem('calculator-formula-params')
    if (savedParams) {
      try {
        setFormulaParams(JSON.parse(savedParams))
      } catch (error) {
        console.error('Error loading formula params:', error)
      }
    }

    // Charger les paramètres Bitcoin Index
    const savedBtcIndex = localStorage.getItem('calculator-btc-index')
    if (savedBtcIndex) {
      try {
        const btcIndex = JSON.parse(savedBtcIndex)
        setBtcPrice(btcIndex.price || 95000)
        setBtcHashrate((btcIndex.hashrate || 600) * 1000000) // Convertir EH/s en TH/s
      } catch (error) {
        console.error('Error loading BTC index params:', error)
        setBtcPrice(95000)
        setBtcHashrate(600 * 1000000)
      }
    }
  }, [])

  // Sauvegarder les paramètres de formules
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('calculator-formula-params', JSON.stringify(formulaParams))
    }
  }, [formulaParams, mounted])

  // Sauvegarder les paramètres Bitcoin Index
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('calculator-btc-index', JSON.stringify({
        price: btcPrice,
        hashrate: btcHashrate / 1000000, // Convertir TH/s en EH/s pour sauvegarde
      }))
    }
  }, [btcPrice, btcHashrate, mounted])

  // Fonction pour charger les machines depuis localStorage
  const loadMachines = () => {
    const savedMiners = localStorage.getItem('miners-data')
    if (savedMiners) {
      try {
        const minersData = JSON.parse(savedMiners)
        // Valider que les données sont valides
        if (!Array.isArray(minersData) || minersData.length === 0) {
          throw new Error('Invalid miners data format')
        }
        const machinesData: Machine[] = minersData.map((m: any) => ({
          id: m.id,
          name: m.name,
          hashrate: m.hashrate,
          power: m.power,
          efficiency: m.efficiency || (m.power / m.hashrate),
          price: m.price,
        }))
        setMachines(machinesData)
        // Si aucune machine n'est sélectionnée, sélectionner la première
        if (machinesData.length > 0 && !selectedMachine) {
          setSelectedMachine(machinesData[0])
          setCapex(machinesData[0].price)
        }
        return true
      } catch (error) {
        console.error('Error loading miners:', error)
        // Nettoyer le localStorage corrompu
        localStorage.removeItem('miners-data')
        // Utiliser les données par défaut
        setMachines(DEFAULT_MACHINES)
        if (!selectedMachine) {
          setSelectedMachine(DEFAULT_MACHINES[0])
          setCapex(DEFAULT_MACHINES[0].price)
        }
        return false
      }
    } else {
      // Initialiser avec des données de démonstration
      const demoMiners = [
        { id: 'miner-1', name: 'Antminer S23 Hydro', hashrate: 605, power: 5870, efficiency: 9.7, price: 8500, coolingType: 'hydro', manufacturer: 'Bitmain', model: 'S23 Hydro' },
        { id: 'miner-2', name: 'Antminer S21 Pro', hashrate: 234, power: 3510, efficiency: 15.0, price: 4008, coolingType: 'air', manufacturer: 'Bitmain', model: 'S21 Pro' },
        { id: 'miner-3', name: 'Whatsminer M60S++', hashrate: 372, power: 7200, efficiency: 19.4, price: 5800, coolingType: 'air', manufacturer: 'MicroBT', model: 'M60S++' },
      ]
      localStorage.setItem('miners-data', JSON.stringify(demoMiners))
      const machinesData: Machine[] = demoMiners.map(m => ({
        id: m.id,
        name: m.name,
        hashrate: m.hashrate,
        power: m.power,
        efficiency: m.efficiency,
        price: m.price,
      }))
      setMachines(machinesData)
      if (!selectedMachine) {
        setSelectedMachine(machinesData[0])
        setCapex(machinesData[0].price)
      }
      return true
    }
  }

  // Fonction pour charger les hosters depuis localStorage
  const loadHosters = () => {
    const savedHosters = localStorage.getItem('hosters-data')
    if (savedHosters) {
      try {
        const hostersData = JSON.parse(savedHosters)
        // Valider que les données sont valides
        if (!Array.isArray(hostersData) || hostersData.length === 0) {
          throw new Error('Invalid hosters data format')
        }
        const hostersList: Hoster[] = hostersData.map((h: any) => ({
          id: h.id,
          name: h.name,
          location: h.location,
          electricityRate: h.electricityPrice,
          additionalFees: h.additionalFees || 0,
          deposit: h.deposit || 0,
        }))
        setHosters(hostersList)
        // Si aucun hoster n'est sélectionné, sélectionner le premier
        if (hostersList.length > 0 && !selectedHoster) {
          setSelectedHoster(hostersList[0])
          setElectricityRate(hostersList[0].electricityRate)
        }
        return true
      } catch (error) {
        console.error('Error loading hosters:', error)
        // Nettoyer le localStorage corrompu
        localStorage.removeItem('hosters-data')
        // Utiliser les données par défaut
        setHosters(DEFAULT_HOSTERS)
        if (!selectedHoster) {
          setSelectedHoster(DEFAULT_HOSTERS[0])
          setElectricityRate(DEFAULT_HOSTERS[0].electricityRate)
        }
        return false
      }
    } else {
      // Initialiser avec des données de démonstration
      const demoHosters = [
        { id: 'hoster-1', name: 'DataCenter USA', country: 'États-Unis', location: 'Texas, USA', electricityPrice: 0.072, additionalFees: 25, deposit: 3 },
        { id: 'hoster-2', name: 'Nordic Mining', country: 'Islande', location: 'Iceland', electricityPrice: 0.035, additionalFees: 35, deposit: 2 },
        { id: 'hoster-3', name: 'Canada Hosting', country: 'Canada', location: 'Québec, Canada', electricityPrice: 0.045, additionalFees: 30, deposit: 2 },
        { id: 'hoster-4', name: 'Kazakhstan Mining', country: 'Kazakhstan', location: 'Kazakhstan', electricityPrice: 0.040, additionalFees: 20, deposit: 1 },
      ]
      localStorage.setItem('hosters-data', JSON.stringify(demoHosters))
      const hostersList: Hoster[] = demoHosters.map(h => ({
        id: h.id,
        name: h.name,
        location: h.location,
        electricityRate: h.electricityPrice,
        additionalFees: h.additionalFees,
        deposit: h.deposit,
      }))
      setHosters(hostersList)
      if (!selectedHoster) {
        setSelectedHoster(hostersList[0])
        setElectricityRate(hostersList[0].electricityRate)
      }
      return true
    }
  }

  // Charger les données depuis localStorage (garantir l'ordre d'initialisation)
  useEffect(() => {
    setMounted(true)
    let machinesLoaded = false
    let hostersLoaded = false
    
    // Charger les machines
    machinesLoaded = loadMachines()
    
    // Charger les hosters
    hostersLoaded = loadHosters()
    
    // Marquer les données comme chargées une fois que machines et hosters sont prêts
    if (machinesLoaded && hostersLoaded) {
      setDataLoaded(true)
    }
  }, [])

  // Écouter les changements dans localStorage pour recharger automatiquement les données
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'miners-data') {
        loadMachines()
      } else if (e.key === 'hosters-data') {
        loadHosters()
      }
    }

    // Écouter les événements de changement de localStorage (depuis d'autres onglets)
    window.addEventListener('storage', handleStorageChange)

    // Écouter les changements dans le même onglet via un intervalle (pour détecter les changements depuis les pages de gestion)
    const interval = setInterval(() => {
      const currentMiners = localStorage.getItem('miners-data')
      const currentHosters = localStorage.getItem('hosters-data')
      
      // Vérifier si les données ont changé
      if (currentMiners) {
        try {
          const minersData = JSON.parse(currentMiners)
          const currentIds = minersData.map((m: any) => m.id).join(',')
          const existingIds = machines.map(m => m.id).join(',')
          if (currentIds !== existingIds) {
            loadMachines()
          }
        } catch (error) {
          // Ignorer les erreurs de parsing
        }
      }
      
      if (currentHosters) {
        try {
          const hostersData = JSON.parse(currentHosters)
          const currentIds = hostersData.map((h: any) => h.id).join(',')
          const existingIds = hosters.map(h => h.id).join(',')
          if (currentIds !== existingIds) {
            loadHosters()
          }
        } catch (error) {
          // Ignorer les erreurs de parsing
        }
      }
    }, 1000) // Vérifier toutes les secondes

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [machines, hosters, selectedMachine, selectedHoster])

  // Initialisation du chargement des données
  useEffect(() => {
    if (mounted && dataLoaded) {
      setLoading(false)
    }
  }, [mounted, dataLoaded])

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

  // Calcul du revenue TH/s/jour
  useEffect(() => {
    if (btcPrice > 0 && btcHashrate > 0) {
      const blocksPerDay = formulaParams.blocksPerDay || 144
      const btcPerBlock = formulaParams.btcPerBlock || 3.125
      const totalBtcPerDay = blocksPerDay * btcPerBlock
      const revenuePerTHPerDay = (totalBtcPerDay / btcHashrate) * btcPrice
      setRevenuePerTH(revenuePerTHPerDay)
    }
  }, [btcPrice, btcHashrate, formulaParams])

  // Fonction de calcul
  const calculateResults = () => {
    if (!selectedMachine || !selectedHoster || !btcPrice || btcPrice === 0) {
      alert('Veuillez sélectionner une machine, un hoster et définir le prix BTC')
      return
    }
    setCalculationTriggered(true)
  }

  // Fonction de test avec 4 scénarios
  const runTests = () => {
    if (!btcPrice || btcPrice === 0) {
      alert('Veuillez définir le prix BTC')
      return
    }

    // Utiliser les machines et hosters disponibles, avec fallback sur les valeurs par défaut
    const availableMachines = machines.length > 0 ? machines : DEFAULT_MACHINES
    const availableHosters = hosters.length > 0 ? hosters : DEFAULT_HOSTERS

    if (availableMachines.length === 0 || availableHosters.length === 0) {
      alert('Aucune machine ou hoster disponible')
      return
    }

    // Trouver les meilleures options
    const cheapHoster = availableHosters.reduce((best, current) => 
      current.electricityRate < best.electricityRate ? current : best
    , availableHosters[0])
    
    const expensiveHoster = availableHosters.reduce((best, current) => 
      current.electricityRate > best.electricityRate ? current : best
    , availableHosters[0])
    
    const standardHoster = availableHosters.find(h => h.electricityRate > 0.05 && h.electricityRate <= 0.07) || availableHosters[0]
    
    const bestMachine = availableMachines.reduce((best, current) => {
      const bestEfficiency = best.price / best.hashrate
      const currentEfficiency = current.price / current.hashrate
      return currentEfficiency < bestEfficiency ? current : best
    }, availableMachines[0])

    const testScenarios = [
      {
        name: 'Scénario 1: Machine High-End + Électricité Bon Marché',
        machine: availableMachines[0],
        hoster: cheapHoster,
        lifespan: 3,
        capex: availableMachines[0].price,
      },
      {
        name: 'Scénario 2: Machine Milieu de Gamme + Électricité Standard',
        machine: availableMachines[Math.min(Math.floor(availableMachines.length / 2), availableMachines.length - 1)],
        hoster: standardHoster,
        lifespan: 5,
        capex: availableMachines[Math.min(Math.floor(availableMachines.length / 2), availableMachines.length - 1)].price,
      },
      {
        name: 'Scénario 3: Machine Économique + Électricité Chère',
        machine: availableMachines[availableMachines.length - 1],
        hoster: expensiveHoster,
        lifespan: 2,
        capex: availableMachines[availableMachines.length - 1].price,
      },
      {
        name: 'Scénario 4: Configuration Optimale (Meilleur ROI)',
        machine: bestMachine,
        hoster: cheapHoster,
        lifespan: 3,
        capex: bestMachine.price,
      },
    ]

    const results: Array<{ name: string; inputs: any; results: CalculationResult | null }> = []

    testScenarios.forEach((scenario) => {
      // Calculs pour chaque scénario
      const hashrateTH = scenario.machine.hashrate
      const powerW = scenario.machine.power
      const capexValue = scenario.capex
      const electricityRateValue = scenario.hoster.electricityRate
      const lifespanDays = scenario.lifespan * 365
      
      // OPEX/jour
      const powerKW = powerW / 1000
      const opexPerDay = (powerKW * 24) * electricityRateValue
      const additionalFeesPerDay = (scenario.hoster.additionalFees || 0) / 30
      const totalOpexPerDay = opexPerDay + additionalFeesPerDay
      
      // Production BTC/jour
      const networkHashrateTH = btcHashrate || 600000000
      const blocksPerDay = formulaParams.blocksPerDay || 144
      const btcPerBlock = formulaParams.btcPerBlock || 3.125
      const totalBtcPerDay = blocksPerDay * btcPerBlock
      const btcPerDay = (hashrateTH / networkHashrateTH) * totalBtcPerDay
      
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
      
      results.push({
        name: scenario.name,
        inputs: {
          machine: scenario.machine.name,
          hoster: scenario.hoster.name,
          lifespan: scenario.lifespan,
          capex: capexValue,
          electricityRate: electricityRateValue,
        },
        results: {
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
        },
      })
    })

    setTestResults(results)
    alert(`✅ Tests terminés ! ${results.length} scénarios testés. Voir les résultats dans la console ou ci-dessous.`)
    console.table(results.map(r => ({
      Scénario: r.name,
      'Machine': r.inputs.machine,
      'ROI (jours)': r.results?.roiDays?.toFixed(0) || 'N/A',
      'Revenu Net/jour': `$${r.results?.netRevenuePerDay.toFixed(2) || 'N/A'}`,
      'BTC/jour': r.results?.btcPerDay.toFixed(8) || 'N/A',
    })))
  }

  // Calcul des résultats (se déclenche uniquement après clic sur le bouton)
  useEffect(() => {
    if (!calculationTriggered) {
      setResult(null)
      return
    }
    
    if (!selectedMachine || !selectedHoster || !btcPrice || btcPrice === 0) {
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
    // Formule: (Hashrate Machine / Hashrate Réseau Total) * BTC produits par jour
    const networkHashrateTH = btcHashrate || 600000000
    const blocksPerDay = formulaParams.blocksPerDay || 144
    const btcPerBlock = formulaParams.btcPerBlock || 3.125
    const totalBtcPerDay = blocksPerDay * btcPerBlock
    const btcPerDay = (hashrateTH / networkHashrateTH) * totalBtcPerDay
    
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
  }, [calculationTriggered, selectedMachine, selectedHoster, lifespan, capex, electricityRate, btcPrice, btcHashrate, formulaParams])

  // Réinitialiser le calcul si les paramètres changent (seulement si un résultat existe)
  // Utiliser useRef pour éviter les dépendances circulaires
  const prevParamsRef = useRef({ selectedMachine, selectedHoster, lifespan, capex, electricityRate })
  
  useEffect(() => {
    const prevParams = prevParamsRef.current
    const paramsChanged = 
      prevParams.selectedMachine?.id !== selectedMachine?.id ||
      prevParams.selectedHoster?.id !== selectedHoster?.id ||
      prevParams.lifespan !== lifespan ||
      prevParams.capex !== capex ||
      prevParams.electricityRate !== electricityRate
    
    // Réinitialiser seulement si les paramètres changent ET qu'un résultat existe
    if (paramsChanged && result) {
      setCalculationTriggered(false)
      setResult(null)
    }
    
    // Mettre à jour les paramètres précédents
    prevParamsRef.current = { selectedMachine, selectedHoster, lifespan, capex, electricityRate }
  }, [selectedMachine, selectedHoster, lifespan, capex, electricityRate, result])

  // Fermer les menus déroulants quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.calculator-premium-dropdown')) {
        setMachineDropdownOpen(false)
        setHosterDropdownOpen(false)
      }
    }

    if (machineDropdownOpen || hosterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [machineDropdownOpen, hosterDropdownOpen])

  return (
    <div className="dashboard-view">
      <div className="dashboard-content">
        {/* Header avec Bouton Formules en haut à droite */}
        <div style={{ 
          marginBottom: 'var(--space-6)', 
          position: 'relative',
          width: '100%'
        }}>
          {/* Bouton Formules - Positionné en haut à droite */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 10
          }}>
            <button
              onClick={() => setFormulasModalOpen(true)}
              className="calculator-formulas-btn"
              title="Éditer les formules de calcul"
            >
              <Icon name="jobs" />
              <span>Éditer Formules</span>
            </button>
          </div>
          
          {/* Titre et description */}
          <div style={{ paddingRight: '180px' }}>
            <h1 style={{ 
              fontSize: 'var(--text-2xl)', 
              fontWeight: 700,
              color: '#ffffff',
              margin: 0,
              marginBottom: 'var(--space-2)'
            }}>
              Calculateur ROI Crypto
            </h1>
            <p style={{ 
              fontSize: 'var(--text-sm)', 
              color: 'var(--text-secondary)', 
              marginTop: 'var(--space-2)',
              fontWeight: 400,
              margin: 0
            }}>
              Calculez votre ROI, break-even et revenus nets en un clic
            </p>
          </div>
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
            <div className={`calculator-section-card calculator-section-card-large ${machineDropdownOpen ? 'dropdown-open' : ''}`}>
              <div className="calculator-section-title">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <div className="premium-stat-icon">
                    <Icon name="projects" />
                  </div>
                  <span>Sélection de la Machine</span>
                  {machines.length > 0 && (
                    <span style={{ 
                      fontSize: 'var(--text-xs)', 
                      color: 'var(--text-secondary)',
                      marginLeft: 'var(--space-2)'
                    }}>
                      ({machines.length} disponible{machines.length > 1 ? 's' : ''})
                    </span>
                  )}
                </div>
              </div>
              
              {/* Dropdown Premium */}
              <div className="calculator-premium-dropdown">
                <button
                  type="button"
                  className="calculator-dropdown-trigger"
                  onClick={() => {
                    setMachineDropdownOpen(!machineDropdownOpen)
                    setHosterDropdownOpen(false)
                  }}
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
                    {machines.length === 0 ? (
                      <div className="calculator-dropdown-item" style={{ cursor: 'default', opacity: 0.6 }}>
                        <div className="calculator-dropdown-item-content">
                          <div className="calculator-dropdown-item-name">Aucune machine disponible</div>
                          <div className="calculator-dropdown-item-specs">Ajoutez des machines dans la page Données Machines</div>
                        </div>
                      </div>
                    ) : (
                      machines.map((machine) => (
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
                      ))
                    )}
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
            <div className={`calculator-section-card calculator-section-card-large ${hosterDropdownOpen ? 'dropdown-open' : ''}`}>
              <div className="calculator-section-title">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <div className="premium-stat-icon">
                    <Icon name="versions" />
                  </div>
                  <span>Sélection de l'Hoster</span>
                  {hosters.length > 0 && (
                    <span style={{ 
                      fontSize: 'var(--text-xs)', 
                      color: 'var(--text-secondary)',
                      marginLeft: 'var(--space-2)'
                    }}>
                      ({hosters.length} disponible{hosters.length > 1 ? 's' : ''})
                    </span>
                  )}
                </div>
              </div>
              
              {/* Dropdown Premium */}
              <div className="calculator-premium-dropdown">
                <button
                  type="button"
                  className="calculator-dropdown-trigger"
                  onClick={() => {
                    setHosterDropdownOpen(!hosterDropdownOpen)
                    setMachineDropdownOpen(false)
                  }}
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
                    {hosters.length === 0 ? (
                      <div className="calculator-dropdown-item" style={{ cursor: 'default', opacity: 0.6 }}>
                        <div className="calculator-dropdown-item-content">
                          <div className="calculator-dropdown-item-name">Aucun hoster disponible</div>
                          <div className="calculator-dropdown-item-specs">Ajoutez des hosters dans la page Données Hosters</div>
                        </div>
                      </div>
                    ) : (
                      hosters.map((hoster) => (
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
                      ))
                    )}
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

            {/* Paramètres & Bitcoin Index - Version Simplifiée */}
          <div className="calculator-params-section">
            {/* Section Paramètres */}
            <div className="calculator-section-card calculator-section-card-large">
              <div className="calculator-section-title">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <div className="premium-stat-icon">
                    <Icon name="jobs" />
                  </div>
                  <span>Paramètres</span>
                </div>
              </div>
              
              <div className="calculator-params-row" style={{ marginTop: 'var(--space-4)' }}>
                <div className="calculator-form-row-inline">
                  <label>Lifespan (années)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    value={lifespan}
                    onChange={(e) => setLifespan(Math.max(1, Math.min(10, parseFloat(e.target.value) || 1)))}
                    className="calculator-param-input"
                  />
                </div>

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

            {/* Section Bitcoin Index */}
            <div className="calculator-section-card calculator-btc-price-card">
              <div className="calculator-section-title">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <div className="premium-stat-icon">
                    <Icon name="running" />
                  </div>
                  <span>Bitcoin Index</span>
                </div>
              </div>
              
              <div className="calculator-btc-content-wrapper">
                <div className="calculator-params-row" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
                  <div className="calculator-form-row-inline">
                    <label>Prix BTC ($)</label>
                    <input
                      type="number"
                      value={btcPrice}
                      onChange={(e) => setBtcPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                      placeholder="Prix BTC"
                      className="calculator-param-input"
                    />
                  </div>
                  <div className="calculator-form-row-inline">
                    <label>Hashrate Réseau (EH/s)</label>
                    <input
                      type="number"
                      step="1"
                      value={btcHashrate / 1000000}
                      onChange={(e) => {
                        const val = Math.max(0, parseFloat(e.target.value) || 600)
                        setBtcHashrate(val * 1000000) // Convertir EH/s en TH/s
                      }}
                      placeholder="Hashrate en EH/s"
                      className="calculator-param-input"
                    />
                  </div>
                </div>

                {revenuePerTH > 0 && (
                  <div style={{ 
                    marginTop: 'var(--space-4)', 
                    padding: 'var(--space-4)', 
                    background: 'rgba(197, 255, 167, 0.05)',
                    border: '1px solid rgba(197, 255, 167, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      fontSize: 'var(--text-xs)', 
                      color: 'var(--text-secondary)', 
                      marginBottom: 'var(--space-1)'
                    }}>
                      Revenue par TH/s par jour
                    </div>
                    <div style={{ 
                      fontSize: 'var(--text-xl)', 
                      fontWeight: 700, 
                      color: '#C5FFA7',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      ${formatNumber(revenuePerTH, 4)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Boutons Calculer et Tests */}
          <div style={{ marginTop: 'var(--space-6)', marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <button
              onClick={calculateResults}
              className="calculator-calculate-btn"
              disabled={!selectedMachine || !selectedHoster || !btcPrice || btcPrice === 0}
            >
              <Icon name="running" />
              <span>Lancer le Calcul</span>
            </button>
            <button
              onClick={runTests}
              className="calculator-formulas-btn"
              disabled={!btcPrice || btcPrice === 0}
              style={{ padding: 'var(--space-4) var(--space-8)', fontSize: 'var(--text-base)' }}
              title="Tester 4 scénarios différents pour valider les formules"
            >
              <Icon name="projects" />
              <span>Tests (4 Scénarios)</span>
            </button>
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
                    <td>{formatNumber(btcHashrate / 1000000, 0)} EH/s</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Revenue Th/$</td>
                    <td className="premium-transaction-amount">
                      {revenuePerTH ? `$${formatNumber(revenuePerTH, 4)}` : '...'}
                    </td>
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
        {!result && testResults.length === 0 && (
          <div className="calculator-results-empty">
            <div className="calculator-empty-icon">
              <Icon name="projects" />
            </div>
            <div className="calculator-empty-text">
              Configurez les paramètres ci-dessus pour voir les résultats
            </div>
          </div>
        )}

        {/* Affichage des résultats de test sur la page principale */}
        {testResults.length > 0 && (
          <div className="premium-transaction-section" style={{ marginTop: 'var(--space-8)' }}>
            <div className="premium-section-header">
              <h3 className="premium-section-title">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <div className="premium-stat-icon">
                    <Icon name="projects" />
                  </div>
                  <span>Résultats des Tests de Validation (4 Scénarios)</span>
                </div>
              </h3>
            </div>
            <div className="premium-transaction-table-container">
              <table className="premium-transaction-table">
                <thead>
                  <tr>
                    <th>Scénario</th>
                    <th>Machine</th>
                    <th>Hoster</th>
                    <th>ROI (jours)</th>
                    <th>Revenu Net/jour</th>
                    <th>BTC/jour</th>
                    <th>Break-even</th>
                  </tr>
                </thead>
                <tbody>
                  {testResults.map((test, index) => (
                    <tr key={index}>
                      <td><strong>{test.name}</strong></td>
                      <td>{test.inputs.machine}</td>
                      <td>{test.inputs.hoster}</td>
                      <td className="premium-transaction-amount">
                        {test.results?.roiDays ? `${formatNumber(test.results.roiDays, 0)} jours` : 'N/A'}
                      </td>
                      <td className={`premium-transaction-amount ${test.results && test.results.netRevenuePerDay < 0 ? 'negative' : ''}`}>
                        {test.results ? `$${formatNumber(test.results.netRevenuePerDay)}` : 'N/A'}
                      </td>
                      <td>{test.results ? formatBTC(test.results.btcPerDay) : 'N/A'}</td>
                      <td>
                        {test.results?.breakEven ? `${formatNumber(test.results.breakEven, 0)} jours` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Formules de Calcul - TOUJOURS EN MODE ÉDITION */}
        {formulasModalOpen && (
          <div className="calculator-modal-overlay" onClick={() => { setFormulasModalOpen(false); }}>
            <div className="calculator-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="calculator-modal-header">
                <h2 className="calculator-modal-title">
                  <Icon name="jobs" />
                  <span>Éditer les Formules de Calcul</span>
                </h2>
                <button
                  className="calculator-modal-close"
                  onClick={() => setFormulasModalOpen(false)}
                  aria-label="Fermer"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              <div className="calculator-modal-body">
                <div style={{
                  background: 'rgba(197, 255, 167, 0.1)',
                  border: '1px solid rgba(197, 255, 167, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-4)',
                  marginBottom: 'var(--space-6)',
                  fontSize: 'var(--text-sm)',
                  color: '#C5FFA7'
                }}>
                  <strong>💡 Mode Édition Actif :</strong> Tous les paramètres ci-dessous sont directement éditables. Les modifications sont sauvegardées automatiquement et utilisées dans tous les calculs.
                </div>
                
                <div className="calculator-formula-section">
                  <h3 className="calculator-formula-section-title">1. Production BTC par jour</h3>
                  <div className="calculator-formula-box">
                    <div className="calculator-formula-formula">
                      BTC/jour = (Hashrate Machine / Hashrate Réseau Total) × (
                        <input
                          type="number"
                          value={formulaParams.blocksPerDay}
                          onChange={(e) => setFormulaParams({...formulaParams, blocksPerDay: parseFloat(e.target.value) || 144})}
                          style={{
                            width: '70px',
                            background: 'rgba(197, 255, 167, 0.15)',
                            border: '1px solid rgba(197, 255, 167, 0.4)',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            color: '#C5FFA7',
                            fontFamily: 'monospace',
                            fontSize: '14px',
                            margin: '0 4px'
                          }}
                        />
                        {' blocs/jour × '}
                        <input
                          type="number"
                          step="0.001"
                          value={formulaParams.btcPerBlock}
                          onChange={(e) => setFormulaParams({...formulaParams, btcPerBlock: parseFloat(e.target.value) || 3.125})}
                          style={{
                            width: '80px',
                            background: 'rgba(197, 255, 167, 0.15)',
                            border: '1px solid rgba(197, 255, 167, 0.4)',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            color: '#C5FFA7',
                            fontFamily: 'monospace',
                            fontSize: '14px',
                            margin: '0 4px'
                          }}
                        />
                        {' BTC/bloc'})
                    </div>
                    <div className="calculator-formula-explanation">
                      <strong>Exemple :</strong> Machine 605 TH/s, Réseau 600 EH/s (600,000,000 TH/s)
                      <br />
                      BTC/jour = (605 / 600,000,000) × ({formulaParams.blocksPerDay} × {formulaParams.btcPerBlock}) = {((605 / 600000000) * formulaParams.blocksPerDay * formulaParams.btcPerBlock).toFixed(8)} BTC/jour
                    </div>
                  </div>
                </div>

                <div className="calculator-formula-section">
                  <h3 className="calculator-formula-section-title">2. Revenu Brut par jour</h3>
                  <div className="calculator-formula-box">
                    <div className="calculator-formula-formula">
                      Revenu Brut/jour = BTC/jour × Prix BTC
                    </div>
                    <div className="calculator-formula-explanation">
                      <strong>Exemple :</strong> 0.000452 BTC/jour × $95,000 = $42.94/jour
                    </div>
                  </div>
                </div>

                <div className="calculator-formula-section">
                  <h3 className="calculator-formula-section-title">3. OPEX par jour</h3>
                  <div className="calculator-formula-box">
                    <div className="calculator-formula-formula">
                      OPEX/jour = (Power kW × 24h) × Prix Électricité + (Frais Additionnels / 30)
                    </div>
                    <div className="calculator-formula-explanation">
                      <strong>Exemple :</strong> Machine 5870W (5.87 kW), Électricité $0.072/kWh, Frais $25/mois
                      <br />
                      OPEX/jour = (5.87 × 24) × 0.072 + (25 / 30) = $10.14 + $0.83 = $10.97/jour
                    </div>
                  </div>
                </div>

                <div className="calculator-formula-section">
                  <h3 className="calculator-formula-section-title">4. Revenu Net par jour</h3>
                  <div className="calculator-formula-box">
                    <div className="calculator-formula-formula">
                      Revenu Net/jour = Revenu Brut/jour - OPEX/jour
                    </div>
                    <div className="calculator-formula-explanation">
                      <strong>Exemple :</strong> $42.94 - $10.97 = $31.97/jour
                    </div>
                  </div>
                </div>

                <div className="calculator-formula-section">
                  <h3 className="calculator-formula-section-title">5. ROI (Return on Investment)</h3>
                  <div className="calculator-formula-box">
                    <div className="calculator-formula-formula">
                      ROI (jours) = CAPEX / Revenu Net/jour
                    </div>
                    <div className="calculator-formula-explanation">
                      <strong>Exemple :</strong> Machine $8,500, Revenu Net $31.97/jour
                      <br />
                      ROI = 8,500 / 31.97 = 266 jours ≈ 8.9 mois
                    </div>
                  </div>
                </div>

                <div className="calculator-formula-section">
                  <h3 className="calculator-formula-section-title">6. Break-even</h3>
                  <div className="calculator-formula-box">
                    <div className="calculator-formula-formula">
                      Break-even = ROI (même formule)
                    </div>
                    <div className="calculator-formula-explanation">
                      Le break-even correspond au moment où les revenus nets cumulés égalent l'investissement initial (CAPEX).
                    </div>
                  </div>
                </div>

                <div className="calculator-formula-section">
                  <h3 className="calculator-formula-section-title">7. Revenue par TH/s par jour</h3>
                  <div className="calculator-formula-box">
                    <div className="calculator-formula-formula">
                      Revenue TH/$ = (BTC produits par jour / Hashrate Réseau Total) × Prix BTC
                    </div>
                    <div className="calculator-formula-explanation">
                      <strong>Exemple :</strong> ({formulaParams.blocksPerDay} × {formulaParams.btcPerBlock}) / 600,000,000 × ${formatNumber(btcPrice || 95000, 0)} = ${formatNumber((formulaParams.blocksPerDay * formulaParams.btcPerBlock / 600000000) * (btcPrice || 95000), 4)} par TH/s/jour
                    </div>
                  </div>
                </div>

                {/* Section Tests */}
                <div className="calculator-formula-section" style={{ marginTop: 'var(--space-8)', paddingTop: 'var(--space-6)', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <h3 className="calculator-formula-section-title">🔬 Tests de Validation (4 Scénarios)</h3>
                  <div className="calculator-formula-box">
                    <div className="calculator-formula-explanation" style={{ marginBottom: 'var(--space-4)' }}>
                      Lancez 4 scénarios de test automatiques pour valider les formules de calcul avec différentes configurations.
                    </div>
                    <button
                      onClick={runTests}
                      className="calculator-calculate-btn"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      <Icon name="running" />
                      <span>Lancer les Tests (4 Scénarios)</span>
                    </button>
                    
                    {testResults.length > 0 && (
                      <div style={{ marginTop: 'var(--space-6)' }}>
                        <h4 style={{ color: '#C5FFA7', marginBottom: 'var(--space-4)', fontSize: 'var(--text-base)' }}>Résultats des Tests</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                          {testResults.map((test, index) => (
                            <div key={index} style={{
                              background: 'rgba(0, 0, 0, 0.3)',
                              border: '1px solid rgba(197, 255, 167, 0.2)',
                              borderRadius: 'var(--radius-md)',
                              padding: 'var(--space-4)',
                            }}>
                              <div style={{ fontWeight: 'bold', color: '#C5FFA7', marginBottom: 'var(--space-2)' }}>
                                {test.name}
                              </div>
                              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                                Machine: {test.inputs.machine} | Hoster: {test.inputs.hoster} | Lifespan: {test.inputs.lifespan} ans
                              </div>
                              {test.results && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-2)', fontSize: 'var(--text-xs)' }}>
                                  <div>
                                    <span style={{ color: 'var(--text-secondary)' }}>ROI:</span>{' '}
                                    <span style={{ color: '#C5FFA7' }}>
                                      {test.results.roiDays ? `${formatNumber(test.results.roiDays, 0)} jours` : 'N/A'}
                                    </span>
                                  </div>
                                  <div>
                                    <span style={{ color: 'var(--text-secondary)' }}>Revenu Net/jour:</span>{' '}
                                    <span style={{ color: test.results.netRevenuePerDay >= 0 ? '#C5FFA7' : '#FF4D4D' }}>
                                      ${formatNumber(test.results.netRevenuePerDay)}
                                    </span>
                                  </div>
                                  <div>
                                    <span style={{ color: 'var(--text-secondary)' }}>BTC/jour:</span>{' '}
                                    <span style={{ color: '#C5FFA7' }}>
                                      {formatBTC(test.results.btcPerDay)} BTC
                                    </span>
                                  </div>
                                  <div>
                                    <span style={{ color: 'var(--text-secondary)' }}>Break-even:</span>{' '}
                                    <span style={{ color: '#C5FFA7' }}>
                                      {test.results.breakEven ? `${formatNumber(test.results.breakEven, 0)} jours` : 'N/A'}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
