import { NextRequest, NextResponse } from 'next/server'

// Cache pour hashprice
let hashpriceCache: any = null
let hashpriceCacheTime = 0
const CACHE_DURATION = 600000 // 10 minutes

async function fetchHashprice() {
  // Vérifier le cache
  if (hashpriceCache && (Date.now() - hashpriceCacheTime) < CACHE_DURATION) {
    return hashpriceCache
  }

  try {
    // TODO: Intégrer API externe (Luxor, Hashlabs, etc.)
    // const response = await fetch('https://api.luxor.tech/hashprice/v1/latest')
    // const data = await response.json()
    
    // MOCK DATA pour démo
    const hashprice = {
      current: 45.2 + (Math.random() - 0.5) * 2,
      avg7d: 44.8,
      avg30d: 46.5,
      timestamp: new Date().toISOString(),
      source: 'Mock API'
    }
    
    hashpriceCache = hashprice
    hashpriceCacheTime = Date.now()
    
    return hashprice
  } catch (error) {
    console.error('Failed to fetch hashprice:', error)
    return hashpriceCache || { 
      current: 45.0, 
      avg7d: 44.5, 
      avg30d: 46.0,
      timestamp: new Date().toISOString(),
      source: 'Fallback'
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const hashprice = await fetchHashprice()
    return NextResponse.json(hashprice)
  } catch (error) {
    console.error('Error in hashprice/current:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch hashprice',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

