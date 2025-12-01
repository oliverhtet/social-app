"use client"

import { useState, ChangeEvent } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Send, ImageIcon, Trash2 } from "lucide-react"
import { useCreatePost } from "@/hooks/usePosts"

interface CreatePostProps {
  onPostCreated: () => void
}

const MAX_CHARACTERS = 500

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const { user } = useAuth()
  const [content, setContent] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // 🔥 React Query mutation
  const createPostMutation = useCreatePost()
  const isSubmitting = createPostMutation.isPending

  const remainingChars = MAX_CHARACTERS - content.length
  const isOverLimit = remainingChars < 0
  const isNearLimit = remainingChars <= 50 && remainingChars >= 0

  // Handle image selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setSelectedFile(file)
    setPreviewUrl(file ? URL.createObjectURL(file) : null)
  }

  const handleRemoveImage = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  const handleSubmit = () => {
  createPostMutation.mutate(
    {  content },
    {
      onSuccess: () => {
        setContent("");
        onPostCreated();
      },
    }
  );
};

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

            {/* Image preview */}
            {previewUrl && (
              <div className="relative mt-2">
                <img src={previewUrl} alt="Preview" className="max-h-48 w-full rounded-md object-cover" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="mt-3 flex items-center justify-between border-t pt-3">
              <div className="flex items-center gap-2">
                {/* File input */}
                <label className="cursor-pointer text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm">
                  <ImageIcon className="h-4 w-4" />
                  <span>Add Image</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>

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
              </div>

              <Button
                onClick={handleSubmit}
                disabled={(content.trim() === "" && !selectedFile) || isOverLimit || isSubmitting}
                size="sm"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Post
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
