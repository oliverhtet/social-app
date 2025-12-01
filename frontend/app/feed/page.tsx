"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { getPosts, initializeStorage } from "@/lib/data-store"
import type { Post } from "@/lib/types"
import { Navbar } from "@/components/navbar"
import { CreatePost } from "@/components/create-post"
import { PostCard } from "@/components/post-card"
import { Loader2 } from "lucide-react"

export default function FeedPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)
console.log(posts);
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isLoading, isAuthenticated, router])

  const loadPosts = () => {
    initializeStorage()
    const allPosts = getPosts()
    setPosts(allPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    setIsLoadingPosts(false)
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadPosts()
    }
  }, [isAuthenticated])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <CreatePost onPostCreated={loadPosts} />

        <div className="mt-6 space-y-4">
          {isLoadingPosts ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} onUpdate={loadPosts} />)
          ) : (
            <div className="rounded-lg bg-card p-12 text-center">
              <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
