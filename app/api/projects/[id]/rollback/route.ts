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
    const existingProject = await prisma.project.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const body = await request.json()
    const { version_id } = body

    if (!version_id) {
      return NextResponse.json(
        { error: 'version_id is required' },
        { status: 400 }
      )
    }

    // Verify version belongs to project
    const version = await prisma.version.findFirst({
      where: {
        id: version_id,
        projectId: params.id,
      },
    })

    if (!version) {
      return NextResponse.json(
        { error: 'Version not found or does not belong to this project' },
        { status: 404 }
      )
    }

    const project = await prisma.project.update({
      where: { id: params.id },
      data: { stableVersionId: version_id },
      include: {
        stableVersion: true,
      },
    })

    return NextResponse.json({
      project,
      message: 'Project rolled back successfully',
    })
  } catch (error) {
    console.error('Error rolling back project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}




