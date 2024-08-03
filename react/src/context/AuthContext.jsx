/* eslint-disable react/prop-types */
import { createContext, useState, useContext, useEffect } from "react";
import * as jose from "jose";
import { login as loginAuth } from "@/api/user/auth";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(() => {
    if (localStorage.getItem("access_token") != null) {
      return true;
    }
    return false;
  });
  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem("access_token");
  });
  const [refreshToken, setRefreshToken] = useState(() => {
    return localStorage.getItem("refresh_token");
  });
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("access_token");
    const storedRefreshToken = localStorage.getItem("refresh_token");

    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);

      try {
        setUserData(jose.decodeJwt(storedAccessToken));
      } catch (error) {
        setUserData({});
        setIsAuth(false);
        return;
      }

      setIsAuth(true);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedAccessToken = localStorage.getItem("access_token");
      const storedRefreshToken = localStorage.getItem("refresh_token");

      if (!storedAccessToken || !storedRefreshToken) {
        setIsAuth(false);
      } else {
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);

        try {
          setUserData(jose.decodeJwt(storedAccessToken));
        } catch (error) {
          setUserData({});
          setIsAuth(false);
          return;
        }

        setIsAuth(true);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    // Decodificar y actualizar userData cuando cambie el accessToken
    try {
      setUserData(
        jose.decodeJwt(typeof accessToken == "string" ? accessToken : ""),
      );
    } catch (error) {
      setUserData({});
      setIsAuth(false);
      return;
    }
  }, [accessToken]);

  const login = async (data) => {
    const response = await loginAuth(data);

    if (!response.status || response.status !== 200) {
      return {
        success: false,
        message: response.message ?? "Algo salio mal",
      };
    }

    const isSetLocalStorage = setAccessRefreshLocalStorage(response);
    if (isSetLocalStorage.success === false) {
      return isSetLocalStorage;
    }

    setIsAuth(true);
    return {
      success: true,
    };
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuth(false);
  };

  const setAccessRefreshLocalStorage = (response) => {
    if (!response.data.refresh || !response.data.access) {
      return {
        success: false,
        message: "Error del servidor",
      };
    }

    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);
    setAccessToken(response.data.access);
    setRefreshToken(response.data.refresh);
    return {
      success: true,
    };
  };

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        login,
        logout,
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
        userData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
};
