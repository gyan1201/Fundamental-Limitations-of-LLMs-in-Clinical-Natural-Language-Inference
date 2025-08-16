import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { CommentSection } from "@/components/CommentSection"
import Link from "next/link"

interface PostPageProps {
  params: {
    id: string
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await prisma.post.findUnique({
    where: { id: params.id, published: true },
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
      comments: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      }
    }
  })

  if (!post) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Post Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Link
            href="/posts"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Posts
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {post.author.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span>{post.author.name}</span>
            </div>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            {post.category && (
              <>
                <span>•</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  {post.category.name}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Post Content */}
      <article className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {post.content}
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Comments ({post.comments.length})
        </h2>
        <CommentSection postId={post.id} comments={post.comments} />
      </div>
    </div>
  )
}