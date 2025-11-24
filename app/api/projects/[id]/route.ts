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
    // Désactiver l'authentification pour le développement
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }
    
    // Pour le développement, récupérer le projet sans filtre userId
    const session = null

    const project = await prisma.project.findFirst({
      where: {
        id: params.id,
        // userId: session?.user?.id, // Désactivé pour le développement
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        stableVersion: true,
        versions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        jobs: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        _count: {
          select: {
            versions: true,
            jobs: true,
          },
        },
      },
    })

    // Si pas de projet dans la DB, retourner un projet mocké pour le développement
    if (!project) {
      // Projets mockés pour le développement
      const mockProjects: Record<string, any> = {
        '1': {
          id: '1',
          name: 'HearstAI Dashboard',
          description: 'Dashboard principal de la plateforme HearstAI',
          type: 'DASHBOARD',
          repoType: 'GITHUB',
          status: 'ACTIVE',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          userId: 'mock-user-id',
          repoUrl: 'https://github.com/hearstai/dashboard',
          repoBranch: 'main',
          localPath: null,
          metadata: JSON.stringify({ imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800' }),
          user: {
            id: 'mock-user-id',
            name: 'John Doe',
            email: 'john@hearstai.com',
            image: 'https://ui-avatars.com/api/?name=John+Doe&background=C5FFA7&color=000',
          },
          stableVersion: null,
          versions: [],
          jobs: [],
        },
        '2': {
          id: '2',
          name: 'Mining Analytics Platform',
          description: 'Plateforme d\'analyse des données de minage',
          type: 'DASHBOARD',
          repoType: 'GITHUB',
          status: 'ACTIVE',
          createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          userId: 'mock-user-id',
          repoUrl: 'https://github.com/hearstai/mining-analytics',
          repoBranch: 'main',
          localPath: null,
          metadata: JSON.stringify({ imageUrl: 'https://images.unsplash.com/photo-1639322537504-6427a16b0a28?w=800' }),
          user: {
            id: 'mock-user-id',
            name: 'Jane Smith',
            email: 'jane@hearstai.com',
            image: 'https://ui-avatars.com/api/?name=Jane+Smith&background=C5FFA7&color=000',
          },
          stableVersion: null,
          versions: [],
          jobs: [],
        },
      }
      
      const mockProject = mockProjects[params.id]
      if (mockProject) {
        let imageUrl = null
        try {
          const metadata = typeof mockProject.metadata === 'string' ? JSON.parse(mockProject.metadata) : mockProject.metadata
          imageUrl = metadata?.imageUrl || null
        } catch (e) {
          // Ignore parsing errors
        }
        
        return NextResponse.json({ 
          project: {
            ...mockProject,
            imageUrl,
          }
        })
      }
      
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Extract imageUrl from metadata if present
    let imageUrl = null
    try {
      const metadata = typeof project.metadata === 'string' ? JSON.parse(project.metadata) : project.metadata
      imageUrl = metadata?.imageUrl || null
    } catch (e) {
      // Ignore parsing errors
    }

    return NextResponse.json({ 
      project: {
        ...project,
        imageUrl,
      }
    })
  } catch (error) {
    console.error('Error getting project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Désactiver l'authentification pour le développement
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // Handle FormData (for image upload) or JSON
    const contentType = request.headers.get('content-type') || ''
    let body: any = {}
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      body = {
        name: formData.get('name'),
        description: formData.get('description'),
        status: formData.get('status'),
      }
      
      // Handle image upload
      const imageFile = formData.get('image') as File | null
      if (imageFile) {
        // For now, we'll store the image URL in metadata
        // In production, you'd upload to a storage service
        const imageUrl = URL.createObjectURL(imageFile)
        body.metadata = JSON.stringify({ imageUrl })
      }
    } else {
      try {
        body = await request.json()
      } catch (e) {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
      }
    }

    // Verify project exists
    const existingProject = await prisma.project.findFirst({
      where: {
        id: params.id,
        // userId: session?.user?.id, // Désactivé pour le développement
      },
    })

    // Si le projet n'existe pas dans la DB, on ne peut pas le mettre à jour
    // (les projets mockés ne peuvent pas être modifiés)
    if (!existingProject) {
      return NextResponse.json({ 
        error: 'Project not found in database. Cannot update mock projects.' 
      }, { status: 404 })
    }

    const updateData: any = {}

    if (body.name !== undefined && body.name !== null) updateData.name = body.name
    if (body.description !== undefined) updateData.description = body.description || null
    if (body.stable_version_id !== undefined)
      updateData.stableVersionId = body.stable_version_id
    if (body.status !== undefined && body.status !== null) {
      updateData.status = body.status.toUpperCase()
    }
    if (body.metadata !== undefined) updateData.metadata = body.metadata

    // Vérifier qu'il y a au moins un champ à mettre à jour
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    try {
      const project = await prisma.project.update({
        where: { id: params.id },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      })

      // Extract imageUrl from metadata if present
      let imageUrl = null
      try {
        const metadata = typeof project.metadata === 'string' ? JSON.parse(project.metadata) : project.metadata
        imageUrl = metadata?.imageUrl || null
      } catch (e) {
        // Ignore parsing errors
      }

      return NextResponse.json({ 
        project: {
          ...project,
          imageUrl,
        }
      })
    } catch (error: any) {
      console.error('Error updating project:', error)
      // Si c'est une erreur Prisma, retourner un message plus clair
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }
      return NextResponse.json(
        { error: error.message || 'Internal server error' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error updating project:', error)
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
    // Désactiver l'authentification pour le développement
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // Verify project exists
    const existingProject = await prisma.project.findFirst({
      where: {
        id: params.id,
        // userId: session?.user?.id, // Désactivé pour le développement
      },
    })

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Hard delete for development (or soft delete in production)
    await prisma.project.delete({
      where: { id: params.id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



