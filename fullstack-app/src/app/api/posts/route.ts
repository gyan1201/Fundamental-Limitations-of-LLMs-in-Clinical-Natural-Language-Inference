import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  categoryId: z.string().optional(),
})

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        category: {
          select: {
            id: true,
            name: true,
          }
        },
        _count: {
          select: {
            comments: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { title, content, categoryId } = postSchema.parse(body)

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        categoryId,
        published: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        category: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}