
import { useMutation, useQuery } from "@tanstack/react-query";
import { loginUser, registerUser, logoutUser, getProfile } from "../api/authApi";

export const useLogin = () =>
  useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.data.token);
    },
    onError: (error) => {
      // Optional: Clear token if an error occurred during an active session attempt
      localStorage.removeItem("token");
      console.error("Login mutation error:", error);
    }
});

export const useRegister = () => useMutation({ mutationFn: registerUser });

export const useLogout = () => useMutation({ mutationFn: logoutUser });

export const useProfile = (isTokenPresent: boolean) =>
  useQuery({
    queryKey: ["profiles"],
    queryFn: getProfile,
  });
