import { useAuth } from "./AuthContext";

export const useAuthFetch = () => {
  const { token, refreshAccessToken, logout } = useAuth();

  const authFetch = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      // If token expired → try refresh
      if (response.status === 401) {
        const newToken = await refreshAccessToken();

        const retryResponse = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: newToken,
            "Content-Type": "application/json",
          },
        });

        if (!retryResponse.ok) throw new Error("Session expired. Please log in again");
        return retryResponse.json();
      }

      if (!response.ok) throw new Error("API error");

      return response.json();
    } catch (err) {
      logout();
      throw err;
    }
  };

  return authFetch;
};
