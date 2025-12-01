import type { User, Post, Comment } from "./types"

const USERS_KEY = "social_users"
const POSTS_KEY = "social_posts"
const CURRENT_USER_KEY = "social_current_user"

// Demo user
const demoUser: User = {
  id: "demo-user",
  email: "demo@example.com",
  name: "Demo User",
  username: "demouser",
  avatar: "/demo-user-avatar.png",
  bio: "Welcome to my social media profile!",
  createdAt: new Date().toISOString(),
}

// Sample posts
const samplePosts: Post[] = [
  {
    id: "post-1",
    userId: "demo-user",
    content:
      "Just joined this amazing social platform! Excited to connect with everyone here. What are you all working on today?",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    likes: [],
    comments: [],
  },
  {
    id: "post-2",
    userId: "user-2",
    content:
      "The key to productivity is not doing more, but doing what matters. Focus on the essential and let go of the rest.",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    likes: ["demo-user"],
    comments: [
      {
        id: "comment-1",
        userId: "demo-user",
        postId: "post-2",
        content: "Great insight! Totally agree with this.",
        createdAt: new Date(Date.now() - 3000000).toISOString(),
      },
    ],
  },
  {
    id: "post-3",
    userId: "user-3",
    content:
      "Beautiful sunset today! Nature never fails to amaze me. Taking a moment to appreciate the little things in life.",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    likes: ["demo-user", "user-2"],
    comments: [],
  },
]

const sampleUsers: User[] = [
  demoUser,
  {
    id: "user-2",
    email: "sarah@example.com",
    name: "Sarah Johnson",
    username: "sarahj",
    avatar: "/professional-woman-avatar.png",
    bio: "Productivity enthusiast. Coffee lover.",
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: "user-3",
    email: "mike@example.com",
    name: "Mike Chen",
    username: "mikechen",
    avatar: "/casual-man-avatar.png",
    bio: "Photographer and nature lover.",
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
  },
]

// Initialize local storage with demo data
export function initializeStorage() {
  if (typeof window === "undefined") return

  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(sampleUsers))
  }
  if (!localStorage.getItem(POSTS_KEY)) {
    localStorage.setItem(POSTS_KEY, JSON.stringify(samplePosts))
  }
}

// User operations
export function getUsers(): User[] {
  if (typeof window === "undefined") return []
  const users = localStorage.getItem(USERS_KEY)
  return users ? JSON.parse(users) : []
}

export function getUserById(id: string): User | null {
  const users = getUsers()
  return users.find((u) => u.id === id) || null
}

export function getUserByEmail(email: string): User | null {
  const users = getUsers()
  return users.find((u) => u.email === email) || null
}

export function createUser(user: Omit<User, "id" | "createdAt">): User {
  const users = getUsers()
  const newUser: User = {
    ...user,
    id: `user-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  users.push(newUser)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  return newUser
}

// Auth operations
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const userId = localStorage.getItem(CURRENT_USER_KEY)
  if (!userId) return null
  return getUserById(userId)
}

export function setCurrentUser(userId: string | null) {
  if (userId) {
    localStorage.setItem(CURRENT_USER_KEY, userId)
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

// Post operations
export function getPosts(): Post[] {
  if (typeof window === "undefined") return []
  const posts = localStorage.getItem(POSTS_KEY)
  return posts ? JSON.parse(posts) : []
}

export function getPostsByUserId(userId: string): Post[] {
  return getPosts().filter((p) => p.userId === userId)
}

export function createPost(userId: string, content: string): Post {
  const posts = getPosts()
  const newPost: Post = {
    id: `post-${Date.now()}`,
    userId,
    content,
    createdAt: new Date().toISOString(),
    likes: [],
    comments: [],
  }
  posts.unshift(newPost)
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
  return newPost
}

export function deletePost(postId: string) {
  const posts = getPosts().filter((p) => p.id !== postId)
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
}

export function updatePost(postId: string, content: string) {
  const posts = getPosts()
  const postIndex = posts.findIndex((p) => p.id === postId)
  if (postIndex !== -1) {
    posts[postIndex].content = content
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
  }
}

export function toggleLike(postId: string, userId: string): boolean {
  const posts = getPosts()
  const post = posts.find((p) => p.id === postId)
  if (!post) return false

  const likeIndex = post.likes.indexOf(userId)
  if (likeIndex === -1) {
    post.likes.push(userId)
  } else {
    post.likes.splice(likeIndex, 1)
  }
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
  return likeIndex === -1
}

export function addComment(postId: string, userId: string, content: string): Comment {
  const posts = getPosts()
  const post = posts.find((p) => p.id === postId)
  if (!post) throw new Error("Post not found")

  const newComment: Comment = {
    id: `comment-${Date.now()}`,
    userId,
    postId,
    content,
    createdAt: new Date().toISOString(),
  }
  post.comments.push(newComment)
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
  return newComment
}

// Stats
export function getUserStats(userId: string) {
  const posts = getPosts()
  const userPosts = posts.filter((p) => p.userId === userId)
  const totalLikes = userPosts.reduce((acc, post) => acc + post.likes.length, 0)
  const totalComments = posts.reduce((acc, post) => acc + post.comments.filter((c) => c.userId === userId).length, 0)
  return {
    postsCount: userPosts.length,
    likesReceived: totalLikes,
    commentsCount: totalComments,
  }
}
