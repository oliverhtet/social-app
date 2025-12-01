"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import type { Post } from "@/lib/types";
import { Navbar } from "@/components/navbar";
import { CreatePost } from "@/components/create-post";
import { PostCard } from "@/components/post-card";
import { Loader2 } from "lucide-react";
import { usePosts } from "@/hooks/usePosts";

export default function FeedPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  // ✅ Pass page and limit to usePosts
  const { data: posts = [], isLoading: isLoadingPosts, refetch } = usePosts(1, 20);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <CreatePost onPostCreated={() => refetch()} />

        <div className="mt-6 space-y-4">
          {isLoadingPosts ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : posts.length > 0 ? (
            posts
              .slice()
              .sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((post: Post) => <PostCard key={post.id} post={post} onUpdate={() => refetch()} />)
          ) : (
            <div className="rounded-lg bg-card p-12 text-center">
              <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
