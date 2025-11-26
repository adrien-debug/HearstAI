import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Désactiver l'authentification pour le développement
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    const where: any = {
      // userId: session?.user?.id, // Désactivé pour le développement
    }

    if (status) {
      where.status = status.toUpperCase()
    }

    if (type) {
      where.type = type.toUpperCase()
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
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
        _count: {
          select: {
            versions: true,
            jobs: true,
          },
        },
      },
    })
    
    // Extract imageUrl from metadata for each project
    const projectsWithImages = projects.map(project => {
      let imageUrl = null
      try {
        const metadata = typeof project.metadata === 'string' ? JSON.parse(project.metadata) : project.metadata
        imageUrl = metadata?.imageUrl || null
      } catch (e) {
        // Ignore parsing errors
      }
      return {
        ...project,
        imageUrl,
      }
    })

    // Si pas de projets, retourner des données mockées
    if (projectsWithImages.length === 0) {
      const mockProjects = [
        {
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
          imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
          stableVersion: null,
          user: {
            id: 'mock-user-id',
            name: 'John Doe',
            email: 'john@hearstai.com',
            image: 'https://ui-avatars.com/api/?name=John+Doe&background=C5FFA7&color=000',
          },
          _count: { versions: 8, jobs: 45 },
        },
        {
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
          imageUrl: 'https://images.unsplash.com/photo-1639322537504-6427a16b0a28?w=800',
          stableVersion: null,
          user: {
            id: 'mock-user-id',
            name: 'Jane Smith',
            email: 'jane@hearstai.com',
            image: 'https://ui-avatars.com/api/?name=Jane+Smith&background=C5FFA7&color=000',
          },
          _count: { versions: 12, jobs: 78 },
        },
        {
          id: '3',
          name: 'Electricity Monitor',
          description: 'Système de monitoring de la consommation électrique',
          type: 'NODEJS_APP',
          repoType: 'LOCAL',
          status: 'ACTIVE',
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          userId: 'mock-user-id',
          repoUrl: null,
          repoBranch: 'main',
          localPath: '/apps/electricity-monitor',
          metadata: JSON.stringify({ imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800' }),
          imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
          stableVersion: null,
          user: {
            id: 'mock-user-id',
            name: 'Bob Wilson',
            email: 'bob@hearstai.com',
            image: 'https://ui-avatars.com/api/?name=Bob+Wilson&background=C5FFA7&color=000',
          },
          _count: { versions: 6, jobs: 34 },
        },
        {
          id: '4',
          name: 'Collateral Tracker',
          description: 'Suivi des positions de collatéral sur DeBank',
          type: 'DASHBOARD',
          repoType: 'GITHUB',
          status: 'ACTIVE',
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          userId: 'mock-user-id',
          repoUrl: 'https://github.com/hearstai/collateral-tracker',
          repoBranch: 'main',
          localPath: null,
          metadata: JSON.stringify({ imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800' }),
          imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
          stableVersion: null,
          user: {
            id: 'mock-user-id',
            name: 'Alice Brown',
            email: 'alice@hearstai.com',
            image: 'https://ui-avatars.com/api/?name=Alice+Brown&background=C5FFA7&color=000',
          },
          _count: { versions: 9, jobs: 56 },
        },
        {
          id: '5',
          name: 'Cockpit Management',
          description: 'Interface de gestion du cockpit minier',
          type: 'DASHBOARD',
          repoType: 'GITHUB',
          status: 'ACTIVE',
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          userId: 'mock-user-id',
          repoUrl: 'https://github.com/hearstai/cockpit',
          repoBranch: 'main',
          localPath: null,
          metadata: JSON.stringify({ imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800' }),
          imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
          stableVersion: null,
          user: {
            id: 'mock-user-id',
            name: 'Charlie Davis',
            email: 'charlie@hearstai.com',
            image: 'https://ui-avatars.com/api/?name=Charlie+Davis&background=C5FFA7&color=000',
          },
          _count: { versions: 15, jobs: 21 },
        },
      ]
      return NextResponse.json({ projects: mockProjects })
    }

    return NextResponse.json({ projects: projectsWithImages })
  } catch (error) {
    console.error('Error getting projects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Désactiver l'authentification pour le développement
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // Créer ou récupérer un utilisateur par défaut pour le développement
    // (doit être fait avant le traitement de l'image)
    let defaultUser
    try {
      // Chercher un utilisateur par défaut
      defaultUser = await prisma.user.findFirst({
        where: {
          email: 'dev@hearstai.local'
        }
      })
      
      // Si pas d'utilisateur, en créer un
      if (!defaultUser) {
        defaultUser = await prisma.user.create({
          data: {
            email: 'dev@hearstai.local',
            name: 'Dev User',
          }
        })
      }
    } catch (error: any) {
      console.error('Error creating/finding default user:', error)
      // Si erreur (table User n'existe pas), utiliser un ID mock
      const defaultUserId = 'dev-user-id'
      defaultUser = { id: defaultUserId }
    }

    // Handle FormData (for image upload) or JSON
    const contentType = request.headers.get('content-type') || ''
    let body: any = {}
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      body = {
        name: formData.get('name'),
        description: formData.get('description'),
        type: formData.get('type'),
        repo_type: formData.get('repo_type'),
        repo_url: formData.get('repo_url'),
        repo_branch: formData.get('repo_branch') || 'main',
        local_path: formData.get('local_path'),
      }
      
      // Handle image upload
      const imageFile = formData.get('image') as File | null
      if (imageFile) {
        try {
          // Sauvegarder le fichier sur le serveur
          const { writeFile, mkdir } = await import('fs/promises')
          const { existsSync } = await import('fs')
          const path = await import('path')
          
          // Créer le répertoire de stockage si nécessaire
          const uploadDir = path.default.join(process.cwd(), 'public', 'uploads', 'projects', defaultUser.id)
          if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true })
          }
          
          // Générer un nom de fichier unique
          const timestamp = Date.now()
          const originalName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')
          const fileName = `${timestamp}-${originalName}`
          const filePath = path.default.join(uploadDir, fileName)
          const publicUrl = `/uploads/projects/${defaultUser.id}/${fileName}`
          
          // Sauvegarder le fichier
          const bytes = await imageFile.arrayBuffer()
          const buffer = Buffer.from(bytes)
          await writeFile(filePath, buffer)
          
          // Stocker l'URL dans les métadonnées
          body.metadata = JSON.stringify({ imageUrl: publicUrl })
        } catch (error: any) {
          console.error('Error saving project image:', error)
          // En cas d'erreur, ne pas bloquer la création du projet
          body.metadata = JSON.stringify({ imageUrl: null })
        }
      }
    } else {
      try {
        body = await request.json()
      } catch (e) {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
      }
    }
    const {
      name,
      description,
      type,
      repo_type,
      repo_url,
      repo_branch,
      local_path,
    } = body

    // Validation
    if (!name || !type || !repo_type) {
      return NextResponse.json(
        { error: 'Missing required fields: name, type, repo_type' },
        { status: 400 }
      )
    }

    const validTypes = ['HTML_STATIC', 'SPA', 'DASHBOARD', 'NODEJS_APP', 'OTHER']
    if (!validTypes.includes(type.toUpperCase())) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    const validRepoTypes = ['LOCAL', 'GITHUB']
    if (!validRepoTypes.includes(repo_type.toUpperCase())) {
      return NextResponse.json(
        { error: `Invalid repo_type. Must be one of: ${validRepoTypes.join(', ')}` },
        { status: 400 }
      )
    }
    
    const project = await prisma.project.create({
      data: {
        name,
        description: description || null,
        type: type.toUpperCase() as any,
        repoType: repo_type.toUpperCase() as any,
        repoUrl: repo_url || null,
        repoBranch: repo_branch || 'main',
        localPath: local_path || null,
        userId: defaultUser.id,
        status: 'ACTIVE',
        metadata: body.metadata || '{}',
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
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



