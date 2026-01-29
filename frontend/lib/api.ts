import { toast } from "react-hot-toast";

const API_URL = "http://localhost:5000";

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

export const api = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null;

    const isFormData = options.body instanceof FormData;

    const res = await fetch(`${API_URL}${endpoint}`, {
      credentials: "include",
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      ...options,
    });

    let data;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

// ------------------- HANDLE TOKEN EXPIRY (SAFE) -------------------
if (
  res.status === 401 &&
  data?.message?.toLowerCase().includes("token")
) {
  if (typeof window !== "undefined") {
    toast.error("Session expired. Please login again.");

    localStorage.removeItem("token");

    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
  }

  return {
    success: false,
    message: "Session expired",
  };
}
// ------------------------------------------------------------

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Something went wrong",
      };
    }

    return {
      success: true,
      data,
      message: data?.message || "Success",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Network error. Please try again.",
    };
  }
};
