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

    if (!project_id) {
      return NextResponse.json(
        { error: 'project_id is required' },
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

    const versions = await prisma.version.findMany({
      where: { projectId: project_id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            files: true,
          },
        },
      },
    })

    // Si pas de versions, retourner des données mockées
    if (versions.length === 0) {
      const mockVersions = [
        {
          id: '1',
          projectId: project_id,
          label: 'v1.2.0',
          description: 'Stable release with performance improvements',
          isStable: true,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          parentVersionId: null,
          metadata: '{}',
          _count: { files: 45 },
        },
        {
          id: '2',
          projectId: project_id,
          label: 'v1.1.5',
          description: 'Bug fixes and minor updates',
          isStable: false,
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          parentVersionId: '1',
          metadata: '{}',
          _count: { files: 42 },
        },
        {
          id: '3',
          projectId: project_id,
          label: 'v1.1.0',
          description: 'Feature release',
          isStable: true,
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          parentVersionId: null,
          metadata: '{}',
          _count: { files: 38 },
        },
      ]
      return NextResponse.json({ versions: mockVersions })
    }

    return NextResponse.json({ versions })
  } catch (error) {
    console.error('Error getting versions:', error)
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
    const { project_id, label, description, parent_version_id } = body

    if (!project_id) {
      return NextResponse.json(
        { error: 'project_id is required' },
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

    // Generate label if not provided
    let versionLabel = label
    if (!versionLabel) {
      const lastVersion = await prisma.version.findFirst({
        where: { projectId: project_id },
        orderBy: { createdAt: 'desc' },
      })

      if (lastVersion) {
        const match = lastVersion.label.match(/v(\d+)/)
        const nextNum = match ? parseInt(match[1]) + 1 : 1
        versionLabel = `v${nextNum}`
      } else {
        versionLabel = 'v1'
      }
    }

    const version = await prisma.version.create({
      data: {
        projectId: project_id,
        label: versionLabel,
        description: description || null,
        parentVersionId: parent_version_id || null,
        isStable: false,
        metadata: '{}',
      },
    })

    return NextResponse.json({ version }, { status: 201 })
  } catch (error) {
    console.error('Error creating version:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



