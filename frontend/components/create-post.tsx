"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { createPost } from "@/lib/data-store"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Send } from "lucide-react"

interface CreatePostProps {
  onPostCreated: () => void
}

const MAX_CHARACTERS = 500

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const { user } = useAuth()
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const remainingChars = MAX_CHARACTERS - content.length
  const isOverLimit = remainingChars < 0
  const isNearLimit = remainingChars <= 50 && remainingChars >= 0

  const handleSubmit = async () => {
    if (!content.trim() || isOverLimit || !user) return

    setIsSubmitting(true)
    createPost(user.id, content.trim())
    setContent("")
    onPostCreated()
    setIsSubmitting(false)
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none border-0 bg-transparent p-0 text-base placeholder:text-muted-foreground focus-visible:ring-0"
            />
            <div className="mt-3 flex items-center justify-between border-t pt-3">
              <span
                className={cn(
                  "text-sm",
                  isOverLimit && "text-destructive",
                  isNearLimit && "text-amber-500",
                  !isNearLimit && !isOverLimit && "text-muted-foreground",
                )}
              >
                {remainingChars} characters remaining
              </span>
              <Button onClick={handleSubmit} disabled={!content.trim() || isOverLimit || isSubmitting} size="sm">
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Post
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
