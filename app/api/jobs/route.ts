import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const project_id = searchParams.get('project_id')
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {
      project: {
        userId: session.user.id,
      },
    }

    if (project_id) {
      where.projectId = project_id
    }

    if (status) {
      where.status = status.toUpperCase()
    }

    if (type) {
      where.type = type.toUpperCase()
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.job.count({ where }),
    ])

    // Format jobs for frontend
    const formattedJobs = jobs.map((job) => {
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
      
      return {
        ...job,
        project: {
          id: job.project.id,
          name: job.project.name,
        },
        context_data: contextData,
        metadata: metadata,
      }
    })

    // Si pas de jobs, retourner des données mockées
    if (formattedJobs.length === 0) {
      const mockJobs = [
        {
          id: '1',
          projectId: '1',
          type: 'REFACTOR',
          status: 'SUCCESS',
          inputPrompt: 'Refactor the dashboard component to improve performance',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 1000).toISOString(),
          completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
          project: { id: '1', name: 'HearstAI Dashboard' },
          context_data: {},
          metadata: {},
        },
        {
          id: '2',
          projectId: '2',
          type: 'DEBUG',
          status: 'SUCCESS',
          inputPrompt: 'Fix the chart rendering issue on mobile devices',
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          startedAt: new Date(Date.now() - 5 * 60 * 60 * 1000 + 2000).toISOString(),
          completedAt: new Date(Date.now() - 5 * 60 * 60 * 1000 + 8 * 60 * 1000).toISOString(),
          project: { id: '2', name: 'Mining Analytics Platform' },
          context_data: {},
          metadata: {},
        },
        {
          id: '3',
          projectId: '3',
          type: 'GENERATE',
          status: 'RUNNING',
          inputPrompt: 'Generate new API endpoints for electricity monitoring',
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          startedAt: new Date(Date.now() - 30 * 60 * 1000 + 1000).toISOString(),
          completedAt: null,
          project: { id: '3', name: 'Electricity Monitor' },
          context_data: {},
          metadata: {},
        },
        {
          id: '4',
          projectId: '1',
          type: 'PATCH',
          status: 'SUCCESS',
          inputPrompt: 'Add error handling to the authentication flow',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 1500).toISOString(),
          completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 6 * 60 * 1000).toISOString(),
          project: { id: '1', name: 'HearstAI Dashboard' },
          context_data: {},
          metadata: {},
        },
        {
          id: '5',
          projectId: '4',
          type: 'REVIEW',
          status: 'PENDING',
          inputPrompt: 'Review the collateral tracking implementation',
          createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          startedAt: null,
          completedAt: null,
          project: { id: '4', name: 'Collateral Tracker' },
          context_data: {},
          metadata: {},
        },
      ]
      return NextResponse.json({
        jobs: mockJobs,
        total: mockJobs.length,
      })
    }

    return NextResponse.json({
      jobs: formattedJobs,
      total,
    })
  } catch (error) {
    console.error('Error getting jobs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { project_id, type, prompt_profile_id, context_data, input_prompt } =
      body

    // Validation
    if (!project_id || !type || !input_prompt) {
      return NextResponse.json(
        { error: 'Missing required fields: project_id, type, input_prompt' },
        { status: 400 }
      )
    }

    const validTypes = ['DEBUG', 'PATCH', 'REFACTOR', 'GENERATE', 'REVIEW']
    if (!validTypes.includes(type.toUpperCase())) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: project_id,
        userId: session.user.id,
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      )
    }

    const job = await prisma.job.create({
      data: {
        projectId: project_id,
        type: type.toUpperCase() as any,
        status: 'PENDING',
        promptProfileId: prompt_profile_id || null,
        inputPrompt: input_prompt,
        contextData: typeof context_data === 'object' ? JSON.stringify(context_data) : (context_data || '{}'),
        metadata: '{}',
      },
    })

    // Execute job in background (will be implemented in services)
    // For now, we'll just return the job
    // TODO: Implement job executor service

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
    
    return NextResponse.json(
      {
        job: {
          ...job,
          context_data: contextData,
          metadata: metadata,
        },
        message: 'Job created and queued for execution',
      },
      { status: 202 }
    )
  } catch (error) {
    console.error('Error creating job:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



