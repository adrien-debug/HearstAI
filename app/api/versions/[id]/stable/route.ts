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
    const version = await prisma.version.findFirst({
      where: {
        id: params.id,
        project: {
          userId: session.user.id,
        },
      },
      include: {
        project: true,
      },
    })

    if (!version) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 })
    }

    // Mark this version as stable and update project
    await prisma.$transaction([
      // Unmark all other stable versions for this project
      prisma.version.updateMany({
        where: {
          projectId: version.projectId,
          isStable: true,
        },
        data: {
          isStable: false,
        },
      }),
      // Mark this version as stable
      prisma.version.update({
        where: { id: params.id },
        data: { isStable: true },
      }),
      // Update project stable version
      prisma.project.update({
        where: { id: version.projectId },
        data: { stableVersionId: params.id },
      }),
    ])

    const updatedVersion = await prisma.version.findUnique({
      where: { id: params.id },
    })

    return NextResponse.json({
      version: updatedVersion,
      message: 'Version marked as stable',
    })
  } catch (error) {
    console.error('Error marking version as stable:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}




