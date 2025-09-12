import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI, tokenManager, userManager, setAccessToken } from "../services/api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { flushQueue } from '../services/persistence';
import { EXPO_PUBLIC_BASE_URL } from "@env";

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
          // Also update AsyncStorage for ProfileScreen compatibility
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
        } else {
          // Try to get user profile from API
          try {
            const profile = await authAPI.getProfile();
            
            // Handle different response formats
            let userData = null;
            if (profile.user) {
              userData = profile.user;
            } else if (profile.data && profile.data.user) {
              userData = profile.data.user;
            } else if (profile.data) {
              userData = profile.data;
            }
            
            if (userData) {
              // Ensure all required fields are present with fallbacks
              userData = {
                ...userData,
                phoneNumber: userData.phoneNumber || userData.phone_number || '',
                profileImage: userData.profileImage || userData.profile_image || userData.avatar || null,
                firstName: userData.firstName || userData.first_name || '',
                lastName: userData.lastName || userData.last_name || '',
                email: userData.email || '',
                location: userData.location || '',
              };
              
              setUser(userData);
              setIsAuthenticated(true);
              await userManager.storeUser(userData);
              await AsyncStorage.setItem('userData', JSON.stringify(userData));
            } else {
              throw new Error("No user data in profile response");
            }
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

  const refreshUserData = async () => {
    try {
      console.log("🔄 Refreshing user data from database...");
      if (isAuthenticated) {
        const profile = await authAPI.getProfile();
        console.log("📊 Profile API response:", profile);
        
        // Handle different response formats
        let userData = null;
        if (profile.user) {
          userData = profile.user;
        } else if (profile.data && profile.data.user) {
          userData = profile.data.user;
        } else if (profile.data) {
          userData = profile.data;
        }
        
        // Ensure all required fields are present with fallbacks
        if (userData) {
          userData = {
            ...userData,
            phoneNumber: userData.phoneNumber || userData.phone_number || '',
            profileImage: userData.profileImage || userData.profile_image || userData.avatar || null,
            firstName: userData.firstName || userData.first_name || '',
            lastName: userData.lastName || userData.last_name || '',
            email: userData.email || '',
            location: userData.location || '',
          };
          console.log("✅ Normalized user data with all fields:", userData);
        }
        
        if (userData) {
          setUser(userData);
          await userManager.storeUser(userData);
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
          console.log("✅ User data refreshed from database:", userData);
          return userData;
        } else {
          console.log("⚠️ Profile response doesn't contain user data:", profile);
        }
      } else {
        console.log("⚠️ User not authenticated, cannot refresh profile");
      }
    } catch (error) {
      console.error("❌ Error refreshing user data:", error);
    }
    return null;
  };

  const login = async (credentials) => {
    try {
      console.log("🔐 Starting login process...");
      console.log("📧 Login credentials:", { 
        email: credentials.email, 
        password: credentials.password ? "***" : "MISSING" 
      });
      console.log("🌐 Backend URL:", EXPO_PUBLIC_BASE_URL || "http://localhost:3000");
      
      const response = await authAPI.login(credentials);
      console.log("📡 Login API response:", response);
      console.log("🔍 Response structure analysis:");
      console.log("  - Has accessToken:", !!response.accessToken);
      console.log("  - Has refreshToken:", !!response.refreshToken);
      console.log("  - Has user object:", !!response.user);
      console.log("  - Has success flag:", !!response.success);
      console.log("  - Has userId:", !!response.userId);
      console.log("  - Has id:", !!response.id);
      console.log("  - Response keys:", Object.keys(response));

      if (response.accessToken) {
        console.log("🔑 Storing tokens...");
        // Store access token; refresh token if present
        await AsyncStorage.setItem("authToken", response.accessToken);
        setAccessToken(response.accessToken);
        if (response.refreshToken) {
          await AsyncStorage.setItem("refreshToken", response.refreshToken);
        }
        console.log("🔑 Tokens stored successfully");
        
        // Verify tokens were actually stored
        const storedToken = await tokenManager.getAccessToken();
        console.log("🔍 Stored token verification:", storedToken ? "✅ Found" : "❌ Missing");
        
        if (!storedToken) {
          console.log("⚠️ Token not found after storage, trying direct AsyncStorage...");
          const directToken = await AsyncStorage.getItem("authToken");
          console.log("🔍 Direct AsyncStorage token:", directToken ? "✅ Found" : "❌ Missing");
          
          if (directToken) {
            console.log("✅ Token found in AsyncStorage, proceeding...");
          } else {
            // Try to manually set the token
            console.log("🔄 Attempting manual token storage...");
            await AsyncStorage.setItem("authToken", response.accessToken);
            await AsyncStorage.setItem("refreshToken", response.refreshToken);
            
            // Verify manual storage
            const manualToken = await AsyncStorage.getItem("authToken");
            if (manualToken) {
              console.log("✅ Manual token storage successful");
            } else {
              throw new Error("Failed to store access token even with manual storage");
            }
          }
        }
        
        // Small delay to ensure tokens are properly stored and available
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Always fetch complete user profile from database after successful login
      let userProfile = null;
      
      if (response.user) {
        // If login response contains user data, use it as initial data
        console.log("👤 User data received from login response:", response.user);
        userProfile = response.user;
      } else if (response.success && response.raw) {
        console.log("🔄 Login successful, fetching complete profile from database...");
        // Try to extract user data from normalized raw payload
        const payload = response.raw.data || response.raw;
        if (payload && payload.user) {
          userProfile = payload.user;
          console.log("✅ Found user data in normalized payload:", userProfile);
        }
      } else {
        console.log("⚠️ Login response format unclear, attempting to fetch profile...");
      }

      // Fetch complete user profile from database
      try {
        console.log("🔄 Fetching complete user profile from database...");
        
        // Verify token is available before making profile request
        let currentToken = await tokenManager.getAccessToken();
        console.log("🔑 Current access token via tokenManager:", currentToken ? "Available" : "Missing");
        
        if (!currentToken) {
          console.log("⚠️ Token not found via tokenManager, trying direct AsyncStorage...");
          currentToken = await AsyncStorage.getItem("authToken");
          console.log("🔑 Direct AsyncStorage token:", currentToken ? "Available" : "Missing");
        }
        
        if (!currentToken) {
          console.log("❌ No token found in any location");
          throw new Error("Access token not available for profile request");
        }
        
        console.log("✅ Token found and ready for profile request");
        
        // Test token validity with a simple request first
        console.log("🧪 Testing token validity...");
        try {
          const profileResponse = await authAPI.getProfile();
          console.log("📊 Profile API response:", profileResponse);
          
          // Handle different response formats
          if (profileResponse.user) {
            userProfile = profileResponse.user;
            console.log("✅ Complete user profile fetched from database:", userProfile);
          } else if (profileResponse.data && profileResponse.data.user) {
            userProfile = profileResponse.data.user;
            console.log("✅ User profile data from database (nested):", userProfile);
          } else if (profileResponse.data) {
            userProfile = profileResponse.data;
            console.log("✅ User profile data from database (direct):", userProfile);
          } else {
            console.log("⚠️ Profile response format unexpected:", profileResponse);
          }
          
          // Ensure all required fields are present with fallbacks
          if (userProfile) {
            userProfile = {
              ...userProfile,
              phoneNumber: userProfile.phoneNumber || userProfile.phone_number || '',
              profileImage: userProfile.profileImage || userProfile.profile_image || userProfile.avatar || null,
              firstName: userProfile.firstName || userProfile.first_name || '',
              lastName: userProfile.lastName || userProfile.last_name || '',
              email: userProfile.email || '',
              location: userProfile.location || '',
            };
            console.log("✅ Normalized user profile with all fields:", userProfile);
          }
        } catch (tokenTestError) {
          console.log("🔒 Token test failed:", tokenTestError.response?.status);
          throw tokenTestError;
        }
      } catch (profileError) {
        // console.error("❌ Error fetching user profile from database:", profileError);
        
        if (profileError.response?.status === 401) {
          console.log("🔒 401 Unauthorized - Token issue detected");
          console.log("🔄 Attempting to use login response data as fallback");
          
          if (response.user) {
            userProfile = response.user;
            console.log("✅ Using login response user data as fallback");
            console.log("⚠️ Profile data will be fetched when user navigates to Profile screen");
          } else {
            console.log("⚠️ No user data in login response, creating minimal user profile");
            // Create a minimal user profile from available data
            userProfile = {
              email: credentials.email,
              id: response.userId || response.id || Date.now().toString(),
              firstName: response.firstName || "User",
              lastName: response.lastName || "",
              signupDate: new Date().toISOString().split("T")[0],
            };
            console.log("✅ Created minimal user profile as fallback:", userProfile);
          }
        } else if (profileError.message?.includes("Access token not available")) {
          console.log("🔑 Access token issue detected");
          console.log("🔄 Attempting to use login response data as fallback");
          
          if (response.user) {
            userProfile = response.user;
            console.log("✅ Using login response user data as fallback");
            console.log("⚠️ Profile data will be fetched when user navigates to Profile screen");
          } else {
            console.log("⚠️ No user data in login response, creating minimal user profile");
            // Create a minimal user profile from available data
            userProfile = {
              email: credentials.email,
              id: response.userId || response.id || Date.now().toString(),
              firstName: response.firstName || "User",
              lastName: response.lastName || "",
              signupDate: new Date().toISOString().split("T")[0],
            };
            console.log("✅ Created minimal user profile as fallback:", userProfile);
          }
        } else if (userProfile) {
          console.log("⚠️ Using login response data as fallback");
        } else {
          console.log("⚠️ No fallback data available, creating minimal user profile");
          // Create a minimal user profile from available data
          userProfile = {
            email: credentials.email,
            id: response.userId || response.id || Date.now().toString(),
            firstName: response.firstName || "User",
            lastName: response.lastName || "",
            signupDate: new Date().toISOString().split("T")[0],
          };
          console.log("✅ Created minimal user profile as final fallback:", userProfile);
        }
      }

      // Store the complete user profile
      if (userProfile) {
        setUser(userProfile);
        setIsAuthenticated(true);
        await userManager.storeUser(userProfile);
        await AsyncStorage.setItem('userData', JSON.stringify(userProfile));
        
        console.log("✅ Complete user profile stored after login:", userProfile);
        console.log("📱 User can now enter app with full profile data");

        // Flush any offline actions queued while logged out
        try {
          await flushQueue(async (item) => {
            // Example dispatch placeholder; expand per item.type
            // if (item.type === 'UPDATE_PROFILE') await authAPI.updateProfile(item.payload);
            // else if (item.type === 'CREATE_REPORT') await reportsAPI.create(item.payload);
            // For now, no-op to illustrate hook-up point
            return Promise.resolve();
          });
          console.log('✅ Offline queue flushed after login');
        } catch (e) {
          console.log('⚠️ Failed flushing offline queue, will retry later');
        }
      } else {
        throw new Error("No user profile data available after login");
      }

      return response;
    } catch (error) {
      console.error("❌ Login error:", error);
      
      // Log detailed error information
      if (error.response) {
        console.error("📊 Error response status:", error.response.status);
        console.error("📊 Error response data:", error.response.data);
        console.error("📊 Error response headers:", error.response.headers);
      } else if (error.request) {
        console.error("📡 No response received:", error.request);
      } else {
        console.error("❌ Error setting up request:", error.message);
      }
      
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);

      if (response.accessToken) {
        // Store tokens
        await tokenManager.storeTokens(
          response.accessToken,
          response.refreshToken || ''
        );
        // Set token immediately for axios instance
        setAccessToken(response.accessToken);
      }

      if (response.user) {
        // Store the user data from registration response
        setUser(response.user);
        setIsAuthenticated(true);
        await userManager.storeUser(response.user);
        
        // Store in userData for ProfileScreen compatibility
        await AsyncStorage.setItem('userData', JSON.stringify(response.user));
        
        console.log("✅ User data stored after registration:", response.user);
      } else if (response.success) {
        // If backend returns success without user object, create user object from input
        const createdUser = {
          firstName: userData.firstName || userData.first_name,
          lastName: userData.lastName || userData.last_name,
          email: userData.email,
          phoneNumber: userData.phoneNumber || userData.phone_number,
          location: userData.location,
          profileImage: userData.profileImage || userData.profile_image,
          signupDate: new Date().toISOString().split("T")[0],
        };
        
        setUser(createdUser);
        setIsAuthenticated(true);
        await userManager.storeUser(createdUser);
        await AsyncStorage.setItem('userData', JSON.stringify(createdUser));
        
        console.log("✅ User data created and stored after registration:", createdUser);
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
      // Clear persisted navigation state so we don't restore protected routes
      try { await AsyncStorage.removeItem('navState_v1'); } catch (_) {}
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      console.log("🔄 AuthContext - Updating profile with data:", profileData);
      const response = await authAPI.updateProfile(profileData);
      console.log("📡 AuthContext - Update profile response:", response);
      
      if (response.user) {
        console.log("✅ AuthContext - Setting updated user:", response.user);
        console.log("📞 AuthContext - Updated user phoneNumber:", response.user.phoneNumber);
        setUser(response.user);
        await userManager.updateUser(response.user);
        // Also update AsyncStorage for ProfileScreen compatibility
        await AsyncStorage.setItem('userData', JSON.stringify(response.user));
      }
      return response;
    } catch (error) {
      console.error("❌ AuthContext - Update profile error:", error);
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
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
