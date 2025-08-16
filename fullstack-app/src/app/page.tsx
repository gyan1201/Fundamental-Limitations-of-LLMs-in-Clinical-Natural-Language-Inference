import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function Home() {
  const recentPosts = await prisma.post.findMany({
    where: { published: true },
    take: 3,
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
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to BlogApp
        </h1>
        <p className="text-xl mb-8">
          A modern full-stack blog application built with Next.js 13, TypeScript, Tailwind CSS, and Prisma
        </p>
        <div className="space-x-4">
          <Link
            href="/posts"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Browse Posts
          </Link>
          <Link
            href="/auth/signup"
            className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Recent Posts */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Recent Posts</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {post.content.length > 150 
                  ? `${post.content.substring(0, 150)}...` 
                  : post.content
                }
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>By {post.author.name}</span>
                {post.category && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {post.category.name}
                  </span>
                )}
              </div>
              <Link
                href={`/posts/${post.id}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Read more →
              </Link>
            </div>
          ))}
        </div>
        {recentPosts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No posts yet. Be the first to create one!</p>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Create Posts</h3>
            <p className="text-gray-600">Write and publish your thoughts with our rich text editor</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Engage</h3>
            <p className="text-gray-600">Comment on posts and interact with other users</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Connect</h3>
            <p className="text-gray-600">Join our community and share your knowledge</p>
          </div>
        </div>
      </div>
    </div>
  )
}
