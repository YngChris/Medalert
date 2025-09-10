import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock authentication service for development when no backend is available
export const mockAuthAPI = {
  // Mock register function
  register: async (userData) => {
    try {
      console.log("🧪 Mock Register - Input data:", userData);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUsers = await AsyncStorage.getItem('mockUsers');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      const existingUser = users.find(user => user.email === userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        firstName: userData.firstName || userData.first_name,
        lastName: userData.lastName || userData.last_name,
        email: userData.email.toLowerCase(),
        password: userData.password, // In real app, this would be hashed
        phoneNumber: userData.phoneNumber || userData.phone_number,
        location: userData.location,
        profileImage: userData.profileImage || userData.profile_image,
        signupDate: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
      };
      
      // Store user
      users.push(newUser);
      await AsyncStorage.setItem('mockUsers', JSON.stringify(users));
      
      // Generate mock tokens
      const accessToken = `mock_access_token_${newUser.id}_${Date.now()}`;
      const refreshToken = `mock_refresh_token_${newUser.id}_${Date.now()}`;
      
      console.log("✅ Mock Register - User created:", newUser);
      
      return {
        success: true,
        user: newUser,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error("❌ Mock Register - Error:", error.message);
      throw error;
    }
  },

  // Mock login function
  login: async (credentials) => {
    try {
      console.log("🧪 Mock Login - Credentials:", { email: credentials.email, password: "***" });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get stored users
      const existingUsers = await AsyncStorage.getItem('mockUsers');
      let users = existingUsers ? JSON.parse(existingUsers) : [];
      
      // Initialize with default test users if no users exist
      if (users.length === 0) {
        const defaultUsers = [
          {
            id: "1",
            firstName: "Test",
            lastName: "User",
            email: "test@gmail.com",
            password: "password123",
            phoneNumber: "+233 20 123 4567",
            location: "Accra, Ghana",
            profileImage: "https://via.placeholder.com/150x150/4ECDC4/FFFFFF?text=TU",
            signupDate: new Date().toISOString().split("T")[0],
            createdAt: new Date().toISOString(),
          },
          {
            id: "2",
            firstName: "VK",
            lastName: "User",
            email: "vk@gmail.com",
            password: "password123",
            phoneNumber: "+233 20 234 5678",
            location: "Kumasi, Ghana",
            profileImage: "https://via.placeholder.com/150x150/45B7D1/FFFFFF?text=VK",
            signupDate: new Date().toISOString().split("T")[0],
            createdAt: new Date().toISOString(),
          }
        ];
        
        users = defaultUsers;
        await AsyncStorage.setItem('mockUsers', JSON.stringify(users));
        console.log("🧪 Mock Login - Initialized default users");
      }
      
      // Find user by email and password
      const user = users.find(u => 
        u.email.toLowerCase() === credentials.email.toLowerCase() && 
        u.password === credentials.password
      );
      
      if (!user) {
        console.log("❌ Mock Login - User not found or invalid password");
        console.log("Available users:", users.map(u => ({ email: u.email, password: u.password })));
        throw new Error('Invalid email or password');
      }
      
      // Generate mock tokens
      const accessToken = `mock_access_token_${user.id}_${Date.now()}`;
      const refreshToken = `mock_refresh_token_${user.id}_${Date.now()}`;
      
      console.log("✅ Mock Login - User authenticated:", user);
      
      return {
        success: true,
        user,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error("❌ Mock Login - Error:", error.message);
      throw error;
    }
  },

  // Mock logout function
  logout: async () => {
    console.log("🧪 Mock Logout - Success");
    return { success: true };
  },

  // Mock get profile function
  getProfile: async () => {
    try {
      // Get current user from storage
      const userData = await AsyncStorage.getItem('user');
      if (!userData) {
        throw new Error('No user data found');
      }
      
      const user = JSON.parse(userData);
      console.log("🧪 Mock Get Profile - User:", user);
      
      return {
        success: true,
        user,
      };
    } catch (error) {
      // console.error("❌ Mock Get Profile - Error:", error.message);
      throw error;
    }
  },

  // Mock update profile function
  updateProfile: async (profileData) => {
    try {
      console.log("🧪 Mock Update Profile - Data:", profileData);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get current user
      const userData = await AsyncStorage.getItem('user');
      if (!userData) {
        throw new Error('No user data found');
      }
      
      const currentUser = JSON.parse(userData);
      const updatedUser = { ...currentUser, ...profileData };
      
      // Update in mock users database
      const existingUsers = await AsyncStorage.getItem('mockUsers');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      const userIndex = users.findIndex(u => u.id === currentUser.id);
      
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        await AsyncStorage.setItem('mockUsers', JSON.stringify(users));
      }
      
      console.log("✅ Mock Update Profile - Updated user:", updatedUser);
      
      return {
        success: true,
        user: updatedUser,
      };
    } catch (error) {
      console.error("❌ Mock Update Profile - Error:", error.message);
      throw error;
    }
  },

  // Mock change password function
  changePassword: async (passwordData) => {
    console.log("🧪 Mock Change Password - Success");
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },

  // Mock delete account function
  deleteAccount: async () => {
    console.log("🧪 Mock Delete Account - Success");
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },
};

// Helper function to check if we should use mock API
export const shouldUseMockAPI = () => {
  // Explicit flag controls mock usage. Defaults to false if not set.
  const flag = String(process.env.EXPO_PUBLIC_USE_MOCK_AUTH || '').toLowerCase();
  return flag === 'true' || flag === '1';
};

// Helper function to list all mock users (for debugging)
export const getMockUsers = async () => {
  const existingUsers = await AsyncStorage.getItem('mockUsers');
  return existingUsers ? JSON.parse(existingUsers) : [];
};

// Helper function to clear all mock data
export const clearMockData = async () => {
  await AsyncStorage.multiRemove(['mockUsers', 'user', 'authToken', 'refreshToken']);
  console.log("🧹 Mock data cleared");
};
