import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: {
          name: true,
        }
      },
      category: {
        select: {
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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">All Posts</h1>
        <Link
          href="/create-post"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-500 mb-6">Be the first to share your thoughts with the community!</p>
          <Link
            href="/create-post"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  {post.category && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {post.category.name}
                    </span>
                  )}
                  <span className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  <Link href={`/posts/${post.id}`} className="hover:text-blue-600 transition-colors">
                    {post.title}
                  </Link>
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.content.length > 200 
                    ? `${post.content.substring(0, 200)}...` 
                    : post.content
                  }
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {post.author.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700">{post.author.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {post._count.comments}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-3 bg-gray-50 border-t">
                <Link
                  href={`/posts/${post.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Read full post →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}