"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@/context/auth-context"
import { getPostsByUserId, getUserStats, initializeStorage } from "@/lib/data-store"
import type { Post } from "@/lib/types"
import { Navbar } from "@/components/navbar"
import { PostCard } from "@/components/post-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Calendar, FileText, Heart, MessageCircle } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [stats, setStats] = useState({ postsCount: 0, likesReceived: 0, commentsCount: 0 })
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isLoading, isAuthenticated, router])

  const loadData = () => {
    if (!user) return
    initializeStorage()
    const userPosts = getPostsByUserId(user.id)
    setPosts(userPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    setStats(getUserStats(user.id))
    setIsLoadingPosts(false)
  }

  useEffect(() => {
    if (isAuthenticated && user) {
      loadData()
    }
  }, [isAuthenticated, user])

  if (isLoading || !isAuthenticated || !user) {
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
        {/* Profile Header */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="text-2xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">@{user.username}</p>
                {user.bio && <p className="mt-2 text-foreground">{user.bio}</p>}
                <div className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground sm:justify-start">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center rounded-lg bg-muted/50 p-4">
                <FileText className="mb-1 h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">{stats.postsCount}</span>
                <span className="text-xs text-muted-foreground">Posts</span>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-muted/50 p-4">
                <Heart className="mb-1 h-5 w-5 text-rose-500" />
                <span className="text-2xl font-bold">{stats.likesReceived}</span>
                <span className="text-xs text-muted-foreground">Likes</span>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-muted/50 p-4">
                <MessageCircle className="mb-1 h-5 w-5 text-blue-500" />
                <span className="text-2xl font-bold">{stats.commentsCount}</span>
                <span className="text-xs text-muted-foreground">Comments</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User's Posts */}
        <div className="mt-6">
          <h2 className="mb-4 text-lg font-semibold">Your Posts</h2>
          <div className="space-y-4">
            {isLoadingPosts ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.id} post={post} onUpdate={loadData} showActions />)
            ) : (
              <Card className="border-0 shadow-sm">
                <CardContent className="py-12 text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">{"You haven't posted anything yet."}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Share your first thought with the community!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
