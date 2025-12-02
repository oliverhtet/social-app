"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@/context/auth-context"
import type { Post } from "@/lib/types"
import { toggleLike, getUserById, deletePost, updatePost } from "@/lib/data-store"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Heart, MessageCircle, MoreHorizontal, Edit2, Trash2, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAddComment,useToggleReaction } from "@/hooks/usePosts";

interface PostCardProps {
  post: Post
  onUpdate: () => void
  showActions?: boolean
}

export function PostCard({ post, onUpdate, showActions = true }: PostCardProps) {
  const { user } = useAuth()
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(post.content)
 console.log(post);
  const postAuthor = getUserById(post.userId)
  const isLiked = user ? post.likes?.includes(user.id) : false
  const isOwner = user?.id === post.userId

   const addCommentMutation = useAddComment()
  const toggleReactionMutation = useToggleReaction()

  const handleLike = () => {
    if (!user) return
    toggleReactionMutation.mutate(
      { postId: post.id, type: "like" },
      { onSuccess: () => onUpdate() }
    )
  }

  const handleComment = () => {
    if (!user || !commentText.trim()) return
    addCommentMutation.mutate(
      { postId: post.id, content: commentText.trim() },
      { onSuccess: () => onUpdate() }
    )
    setCommentText("")
  }

  const handleDelete = () => {
    deletePost(post.id)
    onUpdate()
  }

  const handleEdit = () => {
    if (!editContent.trim()) return
    updatePost(post.id, editContent.trim())
    setIsEditing(false)
    onUpdate()
  }

  return (
    <Card className="border-0 shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={postAuthor?.avatar || "/placeholder.svg"} alt={postAuthor?.name} />
            <AvatarFallback>{postAuthor?.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{post.author?.name}</span>
                <span className="text-sm text-muted-foreground">@{postAuthor?.email}</span>
                <span className="text-sm text-muted-foreground">·</span>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </span>
              </div>
              {isOwner && showActions && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {isEditing ? (
              <div className="mt-2 space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[80px]"
                  maxLength={500}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleEdit}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false)
                      setEditContent(post.content)
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="mt-2 whitespace-pre-wrap break-words text-foreground">{post.content}</p>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t px-4 py-2">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className={cn("gap-2", isLiked && "text-rose-500 hover:text-rose-600")}
            onClick={handleLike}
          >
            <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
            <span>{post.likes.length || 0}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2" onClick={() => setShowComments(!showComments)}>
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments.length || 0}</span>
          </Button>
        </div>
      </CardFooter>

      {showComments && (
        <div className="border-t px-4 py-3">
          {/* Comment input */}
          <div className="mb-4 flex gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-1 gap-2">
              <Textarea
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="min-h-[60px] flex-1 resize-none"
              />
              <Button size="icon" onClick={handleComment} disabled={!commentText.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Comments list */}
          <div className="space-y-3">
            {post.comments.map((comment) => {
              const commentAuthor = getUserById(comment.userId)
              return (
                <div key={comment._id} className="flex gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={commentAuthor?.avatar || "/placeholder.svg"} alt={commentAuthor?.name} />
                    <AvatarFallback>{commentAuthor?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 rounded-lg bg-muted p-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{commentAuthor?.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="mt-1 text-sm">{comment.content}</p>
                  </div>
                </div>
              )
            })}
            {post.comments.length === 0 && (
              <p className="py-2 text-center text-sm text-muted-foreground">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}
