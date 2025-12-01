
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  addComment,
  toggleReaction,
  getMyPosts,
} from "../api/postsApi";

export const usePosts = (page: number, limit: number) =>
  useQuery({
    queryKey: ["posts", page, limit],
    queryFn: () => getAllPosts(page, limit),
  });

export const useCreatePost = () => useMutation({ mutationFn: createPost });
export const useUpdatePost = () =>
  useMutation({
    mutationFn: ({
      postId,
      updateData,
    }: {
      postId: string;
      updateData: FormData;
    }) => updatePost(updateData, postId),
  });
export const useDeletePost = () => useMutation({ mutationFn: deletePost });
export const useAddComment = () =>
  useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) =>
      addComment(postId, content),
  });
export const useToggleReaction = () =>
  useMutation({
    mutationFn: ({ postId, type }: { postId: string; type: string }) =>
      toggleReaction(postId, type),
  });

export const useMyPosts = () =>
  useQuery({
    queryKey: ["myPosts"],
    queryFn: () => getMyPosts(),
  });

