# 🔐 Google Sign-In Setup Guide for MedAlert

This guide will help you set up Google Sign-In functionality in your MedAlert app.

## 📋 Prerequisites

- ✅ Expo project with `expo-auth-session` and `expo-web-browser` installed
- ✅ Google Developer Account
- ✅ Basic understanding of OAuth 2.0

## 🚀 Step-by-Step Setup

### 1. Create Google OAuth 2.0 Credentials

#### A. Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Create a new project or select an existing one

#### B. Enable Google+ API
1. In the left sidebar, click **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"** or **"Google Identity"**
3. Click on it and press **"Enable"**

#### C. Create OAuth 2.0 Credentials
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth 2.0 Client IDs"**
3. Select **"Web application"** as the application type
4. Fill in the details:
   - **Name**: `MedAlert Mobile App`
   - **Authorized JavaScript origins**: 
     - `https://auth.expo.io` (for Expo development)
     - `https://yourdomain.com` (for production)
   - **Authorized redirect URIs**:
     - `https://auth.expo.io/@your-expo-username/your-app-slug`
     - `https://yourdomain.com/auth/callback` (for production)

#### D. Get Your Credentials
1. After creating, you'll see your **Client ID** and **Client Secret**
2. Copy these values - you'll need them for the next step

### 2. Update Configuration File

#### A. Edit `src/config/googleAuth.js`
Replace the placeholder values with your actual credentials:

```javascript
export const GOOGLE_AUTH_CONFIG = {
  // Replace with your actual Google OAuth 2.0 Client ID
  CLIENT_ID: "123456789-abcdefghijklmnop.apps.googleusercontent.com",
  
  // Replace with your actual Google OAuth 2.0 Client Secret
  CLIENT_SECRET: "GOCSPX-your-actual-secret-here",
  
  // ... rest of the config remains the same
};
```

#### B. Important Security Notes
- ⚠️ **Never commit your Client Secret to version control**
- 🔒 **Keep your credentials secure**
- 📱 **Consider using environment variables for production**

### 3. Test the Implementation

#### A. Run Your App
```bash
expo start
```

#### B. Test Google Sign-In
1. Navigate to the Login screen
2. Tap "Sign in with Google"
3. You should see the Google OAuth consent screen
4. After successful authentication, you'll be redirected back to your app

### 4. Handle User Data

#### A. Current Implementation
The current implementation:
- ✅ Authenticates with Google
- ✅ Retrieves user profile information
- ✅ Creates a user object with Google data
- ✅ Navigates to Home screen

#### B. Next Steps (Recommended)
You should implement:

1. **Backend Integration**
   ```javascript
   // Send Google user data to your backend
   const response = await fetch('YOUR_API_URL/auth/google', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(googleUser)
   });
   ```

2. **User Storage**
   ```javascript
   // Store user data locally
   await AsyncStorage.setItem('user', JSON.stringify(googleUser));
   await AsyncStorage.setItem('accessToken', googleUser.accessToken);
   ```

3. **Token Management**
   ```javascript
   // Handle token refresh
   if (tokenData.refresh_token) {
     await AsyncStorage.setItem('refreshToken', tokenData.refresh_token);
   }
   ```

## 🔧 Troubleshooting

### Common Issues

#### 1. "Invalid redirect URI" Error
- ✅ Check that your redirect URI matches exactly in Google Console
- ✅ Ensure you're using the correct Expo username and app slug
- ✅ Verify the URI format: `https://auth.expo.io/@username/app-slug`

#### 2. "Client ID not found" Error
- ✅ Verify your Client ID is correct in `googleAuth.js`
- ✅ Check that the Google+ API is enabled
- ✅ Ensure you're using the correct project in Google Console

#### 3. "Access denied" Error
- ✅ Check your OAuth consent screen settings
- ✅ Verify the app is not in testing mode (or add your email as a test user)
- ✅ Ensure the required scopes are enabled

#### 4. App Crashes on Google Sign-In
- ✅ Check that `expo-auth-session` and `expo-web-browser` are installed
- ✅ Verify your Expo SDK version supports these packages
- ✅ Check the console for specific error messages

### Debug Mode

Enable debug logging by adding this to your LoginScreen:

```javascript
// Add this before handleGoogleSignIn
console.log('Redirect URI:', AuthSession.makeRedirectUri({ useProxy: true }));
console.log('Auth URL:', getGoogleAuthUrl(redirectUri));
```

## 📱 Production Considerations

### 1. Environment Variables
For production, use environment variables:

```javascript
// .env file
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

// In googleAuth.js
CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
```

### 2. Custom URL Schemes
For production builds, consider using custom URL schemes:

```javascript
// app.json
{
  "expo": {
    "scheme": "medalert",
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [
            {
              "scheme": "medalert"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

### 3. Security Best Practices
- 🔐 Use HTTPS for all API calls
- 🚫 Never expose Client Secret in client-side code
- 🔄 Implement proper token refresh logic
- 🛡️ Validate all user data from Google
- 📊 Monitor authentication attempts

## 🎯 What You Get

After setup, your users can:

1. **One-tap Sign-In** with their Google account
2. **Automatic Profile Creation** using Google data
3. **Secure Authentication** via OAuth 2.0
4. **Seamless Experience** without password entry
5. **Profile Picture & Name** automatically imported

## 📞 Support

If you encounter issues:

1. **Check the console logs** for specific error messages
2. **Verify your Google Console settings** match this guide
3. **Test with a simple redirect URI** first
4. **Check Expo documentation** for package-specific issues

## 🎉 Success!

Once everything is working, you'll have a professional Google Sign-In experience that:
- ✅ Improves user onboarding
- ✅ Reduces friction in authentication
- ✅ Provides secure, OAuth-based login
- ✅ Integrates seamlessly with your existing auth system

---

**Happy coding! 🚀**
