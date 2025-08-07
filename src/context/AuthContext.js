import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI, tokenManager, userManager } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authenticated = await tokenManager.isAuthenticated();
      if (authenticated) {
        const userData = await userManager.getUser();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Try to get user profile from API
          try {
            const profile = await authAPI.getProfile();
            setUser(profile.user);
            setIsAuthenticated(true);
            await userManager.storeUser(profile.user);
          } catch (error) {
            // Profile fetch failed, clear auth
            await logout();
          }
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
      await logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);

      if (response.accessToken && response.refreshToken) {
        await tokenManager.storeTokens(
          response.accessToken,
          response.refreshToken
        );
      }

      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        await userManager.storeUser(response.user);
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);

      if (response.accessToken && response.refreshToken) {
        await tokenManager.storeTokens(
          response.accessToken,
          response.refreshToken
        );
      }

      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        await userManager.storeUser(response.user);
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call logout API if user is authenticated
      if (isAuthenticated) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Clear local data regardless of API call success
      await tokenManager.clearTokens();
      await userManager.clearUser();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      if (response.user) {
        setUser(response.user);
        await userManager.updateUser(response.user);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (passwordData) => {
    try {
      const response = await authAPI.changePassword(passwordData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      await authAPI.deleteAccount();
      await logout();
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    deleteAccount,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
