import api from "@/lib/api-client";
import { HttpError } from "@/lib/http-error";

interface ApiErrorResponse {
  error?: { message?: string };
  message?: string;
}

const apiService = {
  requestOtp: async (email: string) => {
    try {
      const response = await api.post("/api/user/request-otp", { email });
      return { success: true, message: (response.data as { message?: string }).message };
    } catch (error) {
      const err = error as HttpError<ApiErrorResponse>;
      return {
        success: false,
        error: err.response?.data?.message || err.message || "Failed to request OTP",
      };
    }
  },
};

export { api, apiService };
