import { API_PATH, AUTH, ERROR_TYPES, ROUTES_WITH_LOGIN, ROUTES_WITH_VERIFICATION } from "@/constants/Ui";
import { useLoaderStore } from "@/globalstore/apiLoaderStore";
import { userLoginPopupStore, userVerificationPopupStore, useUserStore } from "@/globalstore/userStore";
import axios, { AxiosRequestConfig } from "axios";
import Toast from "react-native-toast-message";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: `${process.env.API_URL}`,
  timeout: 10000, // Timeout after 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include credentials (cookies) in requests
});


export const useApiCall = () => {
  const { setIsLoading } = useLoaderStore();
  const { user, isLoggedin, setIsLoggedin, setAccessToken, accessToken, refreshToken, clearUser } = useUserStore();
  const { setShowLoginPopup } = userLoginPopupStore();
  const { setShowUserVerificationModal } = userVerificationPopupStore();

  // adding access token
  axiosInstance.interceptors.request.use(request => {
    if (accessToken) {
      request.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return request;
  }, error => {
    return Promise.reject(error);
  });

  // refreshing access token logic
  axiosInstance.interceptors.response.use(
    response => response, // Directly return successful responses.
    async error => {
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.

        try {
          // Make a request to your auth server to refresh the token.
          const response = await axiosInstance.post(API_PATH.token.verifyRFToken, {
            refreshToken
          });

          const newAccessToken = response?.data?.accessToken;
          if (newAccessToken) {
            delete axiosInstance.defaults.headers.common['Authorization'];
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            // Store the new access and refresh tokens.
            setAccessToken(newAccessToken);
            // Update the authorization header with the new access token.
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

            // **Explicitly update the originalRequest headers.**
            // originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest); // Retry the original request with the new access token.
          }


        } catch (refreshError) {
          // Handle refresh token errors by clearing stored tokens and redirecting to the login page.
          clearUser();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error); // For all other errors, return the error as is.
    }
  );



  const apiCall = async (config: AxiosRequestConfig): Promise<any> => {
    try {
      let urlPath = config.url || "";
      if (!isLoggedin && ROUTES_WITH_LOGIN.includes(urlPath)) {
        setShowLoginPopup(true);
        return;
      }

      if (!user?.isVerified && ROUTES_WITH_VERIFICATION.includes(urlPath)) {
        setShowUserVerificationModal(true);
        return;
      }

      setIsLoading(true);

      const response = await axiosInstance(config);
      setIsLoading(false);

      return response.data; // Directly return data from response
    } catch (error: any) {
      setIsLoading(false);
      const statusCode = error.response?.status || 500;
      const errorType = error.response?.data?.errorType || ""
      const errorMessage =
        error.response?.data?.error ||
        error.response.error ||
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";

      // Show a toast for 400 and 500 status codes
      if (statusCode === 400 || statusCode === 500) {
        if (errorType === ERROR_TYPES.verifcationToken) {
          Toast.show({
            type: 'error',
            text1: 'Verification mail already sent',
            text2: `${errorMessage} .Try after some time`
          });
        } else if (errorType === AUTH.accessTokenNA) {
          Toast.show({
            type: 'error',
            text1: `Error ${statusCode}`,
            text2: `${errorMessage}`
          });
          clearUser();
        } else {
          Toast.show({
            type: 'error',
            text1: `Error ${statusCode}`,
            text2: `${errorMessage}`
          });
        }
      } else if (statusCode === 401) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        Toast.show({
          type: 'info',
          text1: "Session expired.",
          text2: "Please login again."
        });
      } else if (statusCode === 403) {
        Toast.show({
          type: 'error',
          text1: `Error ${statusCode}`,
          text2: `${errorMessage}`
        });
      } else {
        Toast.show({
          type: 'error',
          text1: `Something went wrong.`,
          text2: `Please try again.`
        });
      }
    }
  };

  return { apiCall };
};

