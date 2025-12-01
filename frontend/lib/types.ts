export interface User {
  id: string
  email: string
  name: string
  username: string
  avatar: string
  bio: string
  createdAt: string
  postCount: number
  reactionCount:number
  commentCount:number
}

export interface Post {
  _id: Key | null | undefined
  comment_count: ReactNode
  reaction_count: ReactNode
  created_at: string | number | Date
  author: any
  id: string
  userId: string
  content: string
  createdAt: string
  likes: string[]
  comments: Comment[]
}

export interface Comment {
  _id: Key | null | undefined
  id: string
  userId: string
  postId: string
  content: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}
