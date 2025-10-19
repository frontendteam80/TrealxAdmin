 import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [bearerToken, setBearerToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedBearer = localStorage.getItem("bearerToken");
    const savedRefresh = localStorage.getItem("refreshToken");

    if (savedUser && savedBearer && savedRefresh) {
      setUser(JSON.parse(savedUser));
      setBearerToken(savedBearer);
      setRefreshToken(savedRefresh);
    }
    setLoading(false);
  }, []);

  const login = async ({ Email, Password }) => {
    setLoading(true);
    const res = await fetch(
      "https://imsdev.akrais.com:8444/AKRARealityLTAPI/api/auth/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email, Password }),
      }
    );

    if (!res.ok) throw new Error("Invalid credentials");

    const data = await res.json();

    const userObj = {
      id: data.Id,
      email: data.Email,
      firstName: data.FirstName,
    };

    setUser(userObj);
    setBearerToken(data.BearerToken);
    setRefreshToken(data.RefreshToken);

    localStorage.setItem("user", JSON.stringify(userObj));
    localStorage.setItem("bearerToken", data.BearerToken);
    localStorage.setItem("refreshToken", data.RefreshToken);

    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    setBearerToken(null);
    setRefreshToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("bearerToken");
    localStorage.removeItem("refreshToken");
  };

  const refreshBearerToken = useCallback(async () => {
    if (!refreshToken) return;

    try {
      const res = await fetch(
        "https://imsdev.akrais.com:8444/AKRARealityLTAPI/api/auth/token/refresh",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ RefreshToken: refreshToken }),
        }
      );

      if (!res.ok) throw new Error("Failed to refresh token");

      const data = await res.json();
      setBearerToken(data.BearerToken);
      setRefreshToken(data.RefreshToken);

      localStorage.setItem("bearerToken", data.BearerToken);
      localStorage.setItem("refreshToken", data.RefreshToken);
    } catch (err) {
      console.error("Token refresh failed:", err);
      logout();
    }
  }, [refreshToken]);

  useEffect(() => {
    if (!bearerToken) {
      setLoading(false);
      return;
    }

    try {
      const payloadBase64 = bearerToken.split(".")[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      const expiryTime = decodedPayload.exp * 1000;
      const now = Date.now();
      const timeout = expiryTime - now - 60000;

      if (timeout <= 0) {
        refreshBearerToken();
        return;
      }

      const timer = setTimeout(() => {
        refreshBearerToken();
      }, timeout);

      return () => clearTimeout(timer);
    } catch (err) {
      console.error("Error decoding token:", err);
      logout();
    }
  }, [bearerToken, refreshBearerToken]);

  const isAuthenticated = !!user && !!bearerToken;

  return (
    <AuthContext.Provider
      value={{
        user,
        bearerToken,
        refreshToken,
        login,
        logout,
        loading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
