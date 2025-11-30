import { NextRequest, NextResponse } from 'next/server'

/**
 * @swagger
 * /api/debank/health:
 *   get:
 *     tags: [debank]
 *     summary: Check DeBank API health and configuration
 *     description: Verify DeBank API connection and configuration status
 *     responses:
 *       200:
 *         description: DeBank API health status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [operational, error, not_configured]
 *                 configured:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 testResult:
 *                   type: object
 *                 error:
 *                   type: string
 *                 instructions:
 *                   type: array
 *                   items:
 *                     type: string
 */
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const DEBANK_ACCESS_KEY = process.env.DEBANK_ACCESS_KEY
  
  const isConfigured = !!DEBANK_ACCESS_KEY && 
                       DEBANK_ACCESS_KEY !== 'your_debank_access_key_here' &&
                       DEBANK_ACCESS_KEY.trim() !== ''
  
  if (!isConfigured) {
    return NextResponse.json({
      status: 'not_configured',
      configured: false,
      message: 'DEBANK_ACCESS_KEY is not configured. Please add it to your .env.local file.',
      instructions: [
        '1. Get your API key from https://pro.debank.com/',
        '2. Add DEBANK_ACCESS_KEY=your_key_here to .env.local',
        '3. Restart your development server'
      ]
    }, { status: 200 })
  }

  // Test the API with a simple request
  try {
    const testWallet = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' // Vitalik's wallet for testing
    const url = `https://pro-openapi.debank.com/v1/user/all_complex_protocol_list?id=${testWallet}&chain_ids=eth`
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'AccessKey': DEBANK_ACCESS_KEY,
      },
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json({
        status: 'operational',
        configured: true,
        message: 'DeBank API is operational',
        testResult: {
          status: response.status,
          protocolsFound: Array.isArray(data) ? data.length : 0,
        }
      }, { status: 200 })
    } else {
      const errorText = await response.text().catch(() => '')
      return NextResponse.json({
        status: 'error',
        configured: true,
        message: `DeBank API returned error: ${response.status} ${response.statusText}`,
        error: errorText,
        testResult: {
          status: response.status,
          statusText: response.statusText,
        }
      }, { status: 200 })
    }
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      configured: true,
      message: 'Error testing DeBank API connection',
      error: error.message,
    }, { status: 200 })
  }
}
