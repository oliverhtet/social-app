
import apiClient from "../lib/apiClient";
import type { ApiResponse } from "./authApi";

export const getAllPosts = async (page: number, limit: number) => {
  const response = await apiClient.get(`/posts?page=${page}&limit=${limit}`);
  console.log("API response for getAllPosts:", response);
  return response.data;
};

export const createPost = async (createData: FormData): Promise<ApiResponse> => {
  try {
    await apiClient.post("/posts", createData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { success: true, message: "Post created successfully!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to create post" };
  }
};

export const updatePost = async (
  updateData: FormData,
  postId: string
): Promise<ApiResponse> => {
  try {
    await apiClient.put(`/posts/${postId}`, updateData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { success: true, message: "Post updated successfully!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update post" };
  }
};

export const deletePost = async (id: string): Promise<ApiResponse> => {
  try {
    await apiClient.delete(`/posts/${id}`);
    return { success: true, message: "Post deleted successfully!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to delete post" };
  }
};

export const addComment = async (
  postId: string,
  content: string
): Promise<ApiResponse> => {
  try {
    await apiClient.post(`/posts/${postId}/comments`, { content });
    return { success: true, message: "Comment added successfully!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to add comment" };
  }
};

export const toggleReaction = async (
  postId: string,
  type: string
): Promise<ApiResponse> => {
  try {
    await apiClient.post(`/posts/${postId}/reaction`, { type });
    return { success: true, message: "Reaction updated successfully!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update reaction" };
  }
};


export const getMyPosts = async () => {
  const response = await apiClient.get("/posts/my-posts");
  return response.data.data;
}