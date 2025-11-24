import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify ownership
    const job = await prisma.job.findFirst({
      where: {
        id: params.id,
        project: {
          userId: session.user.id,
        },
      },
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    if (job.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Job is not in pending status' },
        { status: 400 }
      )
    }

    // Update job status to running
    await prisma.job.update({
      where: { id: params.id },
      data: {
        status: 'RUNNING',
        startedAt: new Date(),
      },
    })

    // TODO: Execute job in background using job executor service
    // For now, we'll just return success
    // The actual execution will be implemented in Phase 4

    return NextResponse.json({
      message: 'Job execution started',
      jobId: params.id,
    })
  } catch (error) {
    console.error('Error executing job:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



