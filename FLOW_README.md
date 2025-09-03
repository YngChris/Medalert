# MedAlert App - User Flow Documentation

## Complete User Flow: Signup → Profile → Edit Profile

### 1. Signup Screen (`SignupScreen.js`)
- **Purpose**: User registration with personal information
- **Fields**: First Name, Last Name, Email, Phone Number, Password, Location
- **Navigation**: After successful signup, navigates to Profile screen with user data
- **Key Features**: Form validation, Google signup integration, phone number input

### 2. Profile Screen (`ProfileScreen.js`)
- **Purpose**: Display user profile information
- **Data Source**: Receives user data from SignupScreen navigation params
- **Navigation Options**:
  - **Edit Profile**: Navigates to EditProfileScreen
  - **Go to Home**: Navigates to HomeScreen with user data
  - **Back to Signup**: Returns to SignupScreen for testing
- **Key Features**: Read-only profile display, profile image placeholder

### 3. Edit Profile Screen (`EditProfileScreen.js`)
- **Purpose**: Allow users to modify their profile information
- **Data Source**: Receives existing user data from ProfileScreen
- **Navigation**: After saving, returns to ProfileScreen with updated data
- **Key Features**: Form validation, image picker, phone number validation

### 4. Home Screen (`HomeScreen.js`)
- **Purpose**: Main dashboard with navigation to various app features
- **Profile Access**: Profile icon in header for easy access to ProfileScreen
- **User Data**: Displays personalized welcome message using user data

## Navigation Flow

```
SignupScreen → ProfileScreen → EditProfileScreen → ProfileScreen (updated)
     ↓              ↓              ↓
HomeScreen ← ProfileScreen ← EditProfileScreen
```

## Key Implementation Details

### Data Persistence
- User data is stored in AsyncStorage for persistence
- Navigation params are used to pass data between screens
- Profile updates are reflected immediately in the UI

### Navigation Structure
- Stack-based navigation using React Navigation
- Custom headers with back buttons
- Consistent navigation patterns across screens

### User Experience
- Toast notifications for success/error messages
- Form validation with error display
- Loading states during API calls
- Smooth transitions between screens

## Testing the Flow

1. **Start at SignupScreen**: Fill out the registration form
2. **Complete Signup**: After successful registration, automatically navigate to ProfileScreen
3. **View Profile**: See all user information displayed
4. **Edit Profile**: Tap "Edit Profile" to go to EditProfileScreen
5. **Make Changes**: Modify any profile information
6. **Save Changes**: Return to ProfileScreen with updated information
7. **Navigate to Home**: Use "Go to Home" button to access main dashboard
8. **Return to Profile**: Use profile icon in HomeScreen header

## File Structure

```
src/
├── screens/
│   ├── SignupScreen.js      # User registration
│   ├── ProfileScreen.js     # Profile display
│   ├── EditProfileScreen.js # Profile editing
│   └── HomeScreen.js        # Main dashboard
├── components/
│   └── ProfileDetails.js    # Reusable profile form component
└── context/
    └── AuthContext.js       # Authentication state management
```

This flow provides a complete user journey from initial registration through profile management, with seamless navigation and data persistence.
