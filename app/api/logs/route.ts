import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const level = searchParams.get('level')
    const projectId = searchParams.get('project_id')
    const jobId = searchParams.get('job_id')
    const limit = parseInt(searchParams.get('limit') || '100')

    const where: any = {
      project: {
        userId: session.user.id,
      },
    }

    if (level) {
      where.level = level.toUpperCase()
    }

    if (projectId) {
      where.projectId = projectId
    }

    if (jobId) {
      where.jobId = jobId
    }

    const logs = await prisma.logEntry.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limit,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        job: {
          select: {
            id: true,
            type: true,
          },
        },
      },
    })

    return NextResponse.json({ logs })
  } catch (error) {
    console.error('Error getting logs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

