import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const job = await prisma.job.findFirst({
      where: {
        id: params.id,
        project: {
          userId: session.user.id,
        },
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        logEntries: {
          orderBy: { timestamp: 'asc' },
        },
        outputVersion: true,
      },
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    let contextData = {}
    let metadata = {}
    
    try {
      contextData = typeof job.contextData === 'string' ? JSON.parse(job.contextData || '{}') : (job.contextData || {})
    } catch {
      contextData = {}
    }
    
    try {
      metadata = typeof job.metadata === 'string' ? JSON.parse(job.metadata || '{}') : (job.metadata || {})
    } catch {
      metadata = {}
    }
    
    const logs = job.logEntries.map((log) => {
      let logMetadata = {}
      try {
        logMetadata = typeof log.metadata === 'string' ? JSON.parse(log.metadata || '{}') : (log.metadata || {})
      } catch {
        logMetadata = {}
      }
      return {
        ...log,
        metadata: logMetadata,
      }
    })
    
    return NextResponse.json({
      job: {
        ...job,
        context_data: contextData,
        metadata: metadata,
        logs: logs,
      },
    })
  } catch (error) {
    console.error('Error getting job:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify ownership
    const existingJob = await prisma.job.findFirst({
      where: {
        id: params.id,
        project: {
          userId: session.user.id,
        },
      },
    })

    if (!existingJob) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    // Cancel job - set status to cancelled
    const job = await prisma.job.update({
      where: { id: params.id },
      data: {
        status: 'CANCELLED',
        completedAt: new Date(),
      },
    })

    return NextResponse.json({
      job,
      message: 'Job cancelled successfully',
    })
  } catch (error) {
    console.error('Error cancelling job:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



