"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"

export function Navbar() {
  const { data: session, status } = useSession()

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            BlogApp
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-600 hover:text-gray-800">
              Home
            </Link>
            <Link href="/posts" className="text-gray-600 hover:text-gray-800">
              Posts
            </Link>
            
            {status === "loading" ? (
              <div className="text-gray-600">Loading...</div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <Link href="/create-post" className="text-gray-600 hover:text-gray-800">
                  Create Post
                </Link>
                <span className="text-gray-600">
                  Welcome, {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/signin"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}