import { NextResponse } from 'next/server'

export async function GET() {
  // Get the base URL being used
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'Not set (using /api)'
  const backendUrl = process.env.BACKEND_URL || 'Not set'
  
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    api: {
      baseUrl: apiUrl,
      backendUrl: backendUrl,
      usingRailway: apiUrl.includes('railway.app') || apiUrl.includes('railway'),
      usingLocal: !apiUrl.includes('http') || apiUrl === '/api',
    },
  })
}
