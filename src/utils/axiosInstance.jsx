import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL, CAMERA_API_URL } from '../config';

// Factory function to create axios instances with interceptors
const createAxiosInstance = baseURL => {
  const instance = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
  });

  // Attach token
  instance.interceptors.request.use(
    config => {
      const token = Cookies.get('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );

  // Refresh token handling
  instance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      if (error.response?.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = Cookies.get('refreshToken');
          if (!refreshToken) throw new Error('No refresh token found');

          const res = await axios.post(`${API_URL}/Account/refresh-token`, {
            refreshToken,
          });

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data;

          // Save new tokens
          Cookies.set('token', newAccessToken, { secure: true });
          Cookies.set('refreshToken', newRefreshToken, { secure: true });

          // Retry original request
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          Cookies.remove('token');
          Cookies.remove('refreshToken');
          window.location.href = '/login'; // logout
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Export API clients
export const api = createAxiosInstance(API_URL);
export const deviceApi = createAxiosInstance(CAMERA_API_URL);

// import axios from "axios";
// import Cookies from "js-cookie";
// import { API_URL } from "../config";

// const axiosInstance = axios.create({
//   baseURL: API_URL,
//   headers: { "Content-Type": "application/json" },
// });

// // Attach access token
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = Cookies.get("token");
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Handle refresh token on 401
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const refreshToken = Cookies.get("refreshToken");
//         if (!refreshToken) throw new Error("No refresh token found");

//         const res = await axios.post(`${API_URL}/Account/refresh-token`, {
//           refreshToken,
//         });

//         const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data;

//         // Save new tokens
//         Cookies.set("token", newAccessToken, { secure: true });
//         Cookies.set("refreshToken", newRefreshToken, { secure: true });

//         // Retry original request
//         originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         Cookies.remove("token");
//         Cookies.remove("refreshToken");
//         window.location.href = "/login"; // force logout
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export const api = {
//   get: (url, config = {}) => axiosInstance.get(url, config),
//   post: (url, data, config = {}) => axiosInstance.post(url, data, config),
//   put: (url, data, config = {}) => axiosInstance.put(url, data, config),
//   delete: (url, config = {}) => axiosInstance.delete(url, config),
// };

// export default axiosInstance;
