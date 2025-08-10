# MedAlert Backend Integration Setup

## Environment Configuration

Create a `.env` file in your project root with the following variables:

```env
# API Configuration
EXPO_PUBLIC_BASE_URL=http://localhost:3000

# Google OAuth (if using Google Sign-In)
EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID=your_expo_client_id_here
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your_ios_client_id_here
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your_android_client_id_here
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_web_client_id_here
```

## Backend API Endpoints

The frontend is now integrated with the following backend endpoints:

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/update-profile` - Update user profile
- `PUT /api/auth/change-password` - Change user password
- `POST /api/auth/refresh` - Refresh JWT token
- `DELETE /api/auth/delete-account` - Delete user account

## Features Implemented

### 1. API Service (`src/services/api.js`)
- Axios instance with interceptors for automatic token management
- Automatic token refresh on 401 errors
- Centralized API methods for all authentication operations

### 2. Authentication Context (`src/context/AuthContext.js`)
- Global authentication state management
- Automatic token storage and retrieval
- User session persistence
- Methods for login, register, logout, profile updates

### 3. Updated Screens
- **LoginScreen**: Now uses AuthContext for login
- **SignupScreen**: Now uses AuthContext for registration
- Both screens include proper error handling and success messages

### 4. Token Management
- Automatic JWT token storage in AsyncStorage
- Token refresh on expiration
- Secure token clearing on logout

## Usage

### Login
```javascript
const { login } = useAuth();

const handleLogin = async () => {
  try {
    const response = await login({
      emailOrUsername: 'user@example.com',
      password: 'password123',
      rememberMe: true
    });
    // User is automatically logged in and redirected
  } catch (error) {
    // Handle error
  }
};
```

### Register
```javascript
const { register } = useAuth();

const handleRegister = async () => {
  try {
    const response = await register({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phoneNumber: '+1234567890',
      password: 'password123',
      location: 'New York'
    });
    // User is automatically registered and logged in
  } catch (error) {
    // Handle error
  }
};
```

### Logout
```javascript
const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
  // User is automatically logged out and tokens cleared
};
```

### Check Authentication Status
```javascript
const { isAuthenticated, user, loading } = useAuth();

if (loading) {
  return <LoadingScreen />;
}

if (!isAuthenticated) {
  return <LoginScreen />;
}

return <HomeScreen />;
```

## Backend Requirements

Your backend should return responses in this format:

### Login/Register Response
```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "jwt_access_token_here",
  "refreshToken": "jwt_refresh_token_here",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "location": "New York"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

## Testing

1. Start your backend server on `http://localhost:3000`
2. Set the `EXPO_PUBLIC_BASE_URL` in your `.env` file
3. Run the React Native app: `npm start`
4. Test login and registration flows

## Security Features

- JWT tokens stored securely in AsyncStorage
- Automatic token refresh
- Token clearing on logout
- Error handling for network issues
- Input validation on forms 