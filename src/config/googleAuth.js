// Google OAuth Configuration for MedAlert
// Replace these with your actual Google OAuth credentials
import { EXPO_PUBLIC_GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "@env";

// For development, you can hardcode these values
// For production, use environment variables (.env file)
export const GOOGLE_AUTH_CONFIG = {
  // Your Google OAuth 2.0 Client ID
  // Get this from: https://console.developers.google.com/apis/credentials
  CLIENT_ID: EXPO_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
  
  // Your Google OAuth 2.0 Client Secret
  // Get this from: https://console.developers.google.com/apis/credentials
  CLIENT_SECRET: GOOGLE_CLIENT_SECRET || "YOUR_GOOGLE_CLIENT_SECRET",
  
  // OAuth scopes - these determine what user data you can access
  SCOPES: [
    'openid',        // OpenID Connect authentication
    'email',         // User's email address
    'profile'        // User's basic profile information
  ],
  
  // Additional OAuth parameters
  ACCESS_TYPE: 'offline',  // Request refresh token
  PROMPT: 'consent',       // Always show consent screen
  
  // Google OAuth endpoints
  AUTH_URL: 'https://accounts.google.com/o/oauth2/v2/auth',
  TOKEN_URL: 'https://oauth2.googleapis.com/token',
  USER_INFO_URL: 'https://www.googleapis.com/oauth2/v2/userinfo',
};

// Helper function to get the full auth URL
export const getGoogleAuthUrl = (redirectUri) => {
  const params = new URLSearchParams({
    client_id: GOOGLE_AUTH_CONFIG.CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: GOOGLE_AUTH_CONFIG.SCOPES.join(' '),
    access_type: GOOGLE_AUTH_CONFIG.ACCESS_TYPE,
    prompt: GOOGLE_AUTH_CONFIG.PROMPT,
  });
  
  return `${GOOGLE_AUTH_CONFIG.AUTH_URL}?${params.toString()}`;
};

// Helper function to exchange auth code for tokens
export const exchangeCodeForTokens = async (code, redirectUri) => {
  const response = await fetch(GOOGLE_AUTH_CONFIG.TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_AUTH_CONFIG.CLIENT_ID,
      client_secret: GOOGLE_AUTH_CONFIG.CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });
  
  return response.json();
};

// Helper function to get user info from access token
export const getUserInfo = async (accessToken) => {
  const response = await fetch(
    `${GOOGLE_AUTH_CONFIG.USER_INFO_URL}?access_token=${accessToken}`
  );
  return response.json();
};

// Configuration validation
export const validateGoogleConfig = () => {
  const errors = [];
  
  if (!GOOGLE_AUTH_CONFIG.CLIENT_ID || GOOGLE_AUTH_CONFIG.CLIENT_ID === "YOUR_GOOGLE_CLIENT_ID") {
    errors.push("Google Client ID is not configured");
  }
  
  if (!GOOGLE_AUTH_CONFIG.CLIENT_SECRET || GOOGLE_AUTH_CONFIG.CLIENT_SECRET === "YOUR_GOOGLE_CLIENT_SECRET") {
    errors.push("Google Client Secret is not configured");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Get configuration status
export const getConfigStatus = () => {
  const validation = validateGoogleConfig();
  
  if (validation.isValid) {
    return {
      status: "✅ Configured",
      message: "Google OAuth is properly configured",
      canUse: true
    };
  } else {
    return {
      status: "⚠️ Not Configured",
      message: `Google OAuth needs configuration: ${validation.errors.join(", ")}`,
      canUse: false
    };
  }
};
