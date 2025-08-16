"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface Comment {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    name: string
    email: string
  }
}

interface CommentSectionProps {
  postId: string
  comments: Comment[]
}

export function CommentSection({ postId, comments: initialComments }: CommentSectionProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session) {
      router.push("/auth/signin")
      return
    }

    if (!newComment.trim()) return

    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add comment")
      }

      const comment = await response.json()
      setComments([...comments, comment])
      setNewComment("")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to add comment")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Add Comment Form */}
      {session ? (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add a Comment</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              disabled={isSubmitting}
            />
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="border-t pt-6 text-center">
          <p className="text-gray-600 mb-4">
            Please sign in to leave a comment
          </p>
          <button
            onClick={() => router.push("/auth/signin")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-t pt-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-gray-700">
                    {comment.author.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {comment.author.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}