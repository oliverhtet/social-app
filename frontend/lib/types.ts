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
  _id: string
  comment_count: number
  reaction_count: number
  createdAt:  Date
  author: any
  id: string
  userId: string
  content: string
  likes: string[]
  comments: Comment[]
}

export interface Comment {
  _id: string
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
