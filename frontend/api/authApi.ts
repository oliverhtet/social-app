
import apiClient from "./../lib/apiClient";

export interface ApiResponse {
  success: boolean;
  message: string;
  error?: string;
}

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}): Promise<ApiResponse> => {
  try {
    await apiClient.post("/register", data);
    return { success: true, message: "Registration successful!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to register user" };
  }
};

export const loginUser = async (data: {
  email: string;
  password: string;
}): Promise<{
  data: any; token: string; user: any 
}> => {
  const response = await apiClient.post("/login", data);
  return response.data;
};

export const logoutUser = async (): Promise<ApiResponse> => {
  try {
    await apiClient.post("/logout");
    localStorage.removeItem("token");
    return { success: true, message: "Logout successful!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to logout" };
  }
};

export const getProfile = async () => {
  const response = await apiClient.get("/profile");
  return response.data.data;
};
