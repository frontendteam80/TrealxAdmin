 // src/API/Api.js
import { useCallback } from "react";
import { useAuth } from "../auth/AuthContext";

const API_URL = "https://imsdev.akrais.com:8444/AKRARealityLTAPI/api/data";

export function useApi() {
  const { bearerToken, refreshBearerToken, logout } = useAuth();

  // Low-level reusable API request
  const apiRequest = useCallback(
    async (requestType, extraBody = {}, attemptRefresh = true) => {
      if (!bearerToken) {
        throw new Error("No auth token available");
      }

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ RequestParamType: requestType, ...extraBody }),
        });

        const raw = await res.text();

        // Handle expired token
        if (res.status === 401 || res.status === 403) {
          if (attemptRefresh) {
            const refreshed = await refreshBearerToken();
            if (refreshed) {
              return apiRequest(requestType, extraBody, false);
            } else {
              logout();
              throw new Error("Unauthorized - token refresh failed");
            }
          } else {
            logout();
            throw new Error(`Unauthorized: ${raw}`);
          }
        }

        if (!res.ok) {
          throw new Error(`API error ${res.status}: ${raw}`);
        }

        return raw ? JSON.parse(raw) : [];
      } catch (err) {
        console.error(`API request failed (${requestType}):`, err);
        return [];
      }
    },
    [bearerToken, refreshBearerToken, logout]
  );

  // Wrapper for read-type requests
  const fetchData = useCallback(
    async (requestType, extraBody = {}) => {
      return apiRequest(requestType, extraBody);
    },
    [apiRequest]
  );

  // Wrapper for update/create-type requests
  const postData = useCallback(
    async (requestType, extraBody = {}) => {
      return apiRequest(requestType, extraBody);
    },
    [apiRequest]
  );

  return { fetchData, postData };
}
