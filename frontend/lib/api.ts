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

    // ------------------- HANDLE TOKEN EXPIRY -------------------
    if (res.status === 401) {
      if (typeof window !== "undefined") {
        toast.error("Token expired. Logging out in 5 seconds...");

        // Clear token
        localStorage.removeItem("token");

        // Redirect to login after 5 seconds
        setTimeout(() => {
          window.location.href = "/";
        }, 5000);
      }

      return {
        success: false,
        message: data?.message || "Unauthorized. Token expired.",
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
