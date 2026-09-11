/**
 * Centralized API Configuration & Hook
 *
 * To change the backend URL:
 * 1. Set VITE_API_URL in a `.env` file (e.g., VITE_API_URL=http://localhost:5000)
 * 2. Or update the fallback URL below directly.
 */

// export const API_URL = import.meta.env.VITE_API_URL_LIVE || "https://rupdarpon-server.vercel.app";
export const API_URL = import.meta.env.VITE_API_URL_LIVE || "https://rup-darpan.vercel.app";
// export const API_URL = import.meta.env.VITE_API_URL_LOCAL || "http://localhost:5000";

export const API_BASE_URL = API_URL;
export const BASE_URL = API_URL;

/**
 * Custom React hook for accessing the backend API URL.
 * Supports both direct string usage and object destructuring:
 *
 * Example 1: const API_URL = useApiConfig();
 * Example 2: const { API_URL } = useApiConfig();
 * Example 3: const { baseURL } = useApiConfig();
 */
export const useApiConfig = () => {
  const urlObj = new String(API_URL);
  urlObj.API_URL = API_URL;
  urlObj.baseURL = API_URL;
  urlObj.baseUrl = API_URL;
  urlObj.apiUrl = API_URL;
  return urlObj;
};

export const useApi = useApiConfig;
export default useApiConfig;
