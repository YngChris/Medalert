## MedAlert Project Documentation

### 1. Overview
MedAlert is a React Native (Expo) application that provides authentication, profile management, and reporting features with a polished, Google-like UX for form validation. It supports email/password auth, Google OAuth, and includes auxiliary flows like password reset and location auto-detection during signup.

### 2. Tech Stack
- React Native (Expo)
- React Navigation (native + native-stack)
- Axios (API calls)
- AsyncStorage (local storage)
- Expo modules: Auth Session, Image Picker, Location, Web Browser
- Vector Icons (Feather)

### 3. Project Structure (key paths)
- `src/screens/`
  - `LoginScreen.js`
  - `SignupScreen.js`
  - `ForgotPasswordScreen.js`
  - `ProfileScreen.js`
  - `ReportformScreen.js`
- `src/context/AuthContext.js`
- `src/services/api.js` (primary API client)
- `src/services/mockAuth.js` (optional mock auth for offline dev)
- `src/context/ThemeContext.js`

### 4. Environment Configuration
Use a `.env` file in the project root.

- Required variables:
  - `EXPO_PUBLIC_BASE_URL` (Do NOT include `/api` here; the client appends it)
  - `EXPO_PUBLIC_USE_MOCK_AUTH` (`false` for real backend; `true` to force mock auth)
  - `EXPO_PUBLIC_GOOGLE_CLIENT_ID` (Google OAuth client id)
  - `GOOGLE_CLIENT_SECRET` (Google OAuth client secret)

- Typical values by runtime:
  - Android emulator: `EXPO_PUBLIC_BASE_URL=http://10.0.2.2:3001`
  - iOS simulator: `EXPO_PUBLIC_BASE_URL=http://127.0.0.1:3001`
  - Physical device: `EXPO_PUBLIC_BASE_URL=http://<YOUR_PC_LAN_IP>:3001`
  - Hosted backend: `EXPO_PUBLIC_BASE_URL=https://your-domain`

Restart Expo after changes: `expo start -c`.

#### 4.1 Managing multiple environments
- Create files like `.env.development`, `.env.staging`, `.env.production` and load them with your CI or start scripts.
- Example start scripts in `package.json`:
  - `"start:dev": "cross-env ENVFILE=.env.development expo start"`
  - `"start:prod": "cross-env ENVFILE=.env.production expo start"`

### 5. Running the App
1) Install deps: `npm install`
2) Start: `npm run start` (or `expo start`)
3) Open on device/emulator per Expo prompts.

#### 5.1 Platform specifics
- Android emulator uses host alias `10.0.2.2` to reach your PC's `localhost`.
- iOS simulator can use `127.0.0.1`.
- For a physical device, ensure your server listens on `0.0.0.0` and use your PC LAN IP.

### 6. API Client and Auth Flow
- `src/services/api.js` creates an Axios instance pointing to `EXPO_PUBLIC_BASE_URL`.
- Endpoints are prefixed with `/api` internally (e.g., `/api/auth/login`). Ensure your server exposes these routes.
- Interceptors attach `Authorization: Bearer <token>` if present.
- Token refresh is supported via `/api/auth/refresh` (for real backend).
- Optional mock auth: `src/services/mockAuth.js` is used only if `EXPO_PUBLIC_USE_MOCK_AUTH=true`.

#### AuthContext responsibilities (`src/context/AuthContext.js`)
- `login(credentials)`
- `register(userData)`
- `logout()`
- `getProfile`, `updateProfile`, `changePassword`, `deleteAccount`
- Persists user + tokens in AsyncStorage
- Checks auth status on app startup

#### 6.1 AsyncStorage keys used
- `authToken`: access token
- `refreshToken`: refresh token
- `user`: canonical user profile object
- `userData`: compatibility copy for some screens

### 7. Screens
#### Login (`src/screens/LoginScreen.js`)
- Google Forms-style validation:
  - Validates on field blur and on submit
  - Email: format check; Password: min 8 chars
  - Minimal red error styling (no success checkmarks)
- Calls `login({ email, password })` from `AuthContext`.

#### Signup (`src/screens/SignupScreen.js`)
- Fields: first name, last name, email, password, optional phone/location/profile image
- Google Forms-style validation (required fields + email + password length)
- Password eye toggle to show/hide password
- Location auto-detect with Expo Location:
  - Tap location button to fill `City, Region, Country`
  - Silent auto-detect on mount if permission already granted

#### Forgot Password (`src/screens/ForgotPasswordScreen.js`)
- Google-like simple input + clear messaging UX
- Validates email on blur/submit
- Simulates API call; integrate real endpoint in `handleResetPassword` when available

### 8. Google OAuth
- Uses `expo-auth-session` and `expo-web-browser`
- Requires a valid `EXPO_PUBLIC_GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Redirect URI based on Expo configuration

#### 8.1 Setup steps
1) Create a project in Google Cloud Console and enable OAuth consent screen.
2) Create OAuth 2.0 Client ID (type: Web) and add the redirect URIs that Expo generates (use `makeRedirectUri`).
3) Put the client id/secret in `.env`.
4) For production, configure real redirect URIs and verified domains.

### 9. Networking Configuration Tips
- Do not include `/api` in `EXPO_PUBLIC_BASE_URL` (the client adds it).
- Ensure backend is reachable from your runtime:
  - Android emulator uses `10.0.2.2` to access host machine’s `localhost`.
  - iOS simulator uses `127.0.0.1`.
  - Physical device must use your PC’s LAN IP and the server must listen on `0.0.0.0`.
- Common errors:
  - “Network Error” / “Connection reset”: server not reachable, firewall, wrong host/port, or HTTPS mismatch.
  - Double `/api`: Base URL mistakenly contains `/api`.

### 10. Troubleshooting
- After editing `.env`, always restart Expo (and optionally clear cache).
- Verify server health:
  - From the same network: open `http://<host>:<port>/api/auth/login` in a browser; 404/405 is OK (means route is reachable).
  - Confirm CORS and JSON parsing enabled on the server (Express: `app.use(express.json()); app.use(require('cors')());`).
- If you used mock auth previously and switch to real backend, re-register the account on the backend or reset the password.

#### 10.1 Common error resolutions
- Axios “Network Error”: wrong BASE URL for runtime, server down, or blocked by firewall.
- 401 Unauthorized on `/api/auth/me`: missing/expired token; ensure login flow stored tokens.
- Double `/api` in URLs: remove `/api` from BASE URL.

### 11. Key UX Behaviors (Google-style validation)
- Errors appear on blur and on submit.
- Messages are concise: “This field is required”, “Enter a valid email”, “Use 8 or more characters”.
- Minimal red underline/border for errors; no success tick marks.

### 12. Security Notes
- Tokens are stored in AsyncStorage for the mobile client.
- Do not commit `.env` with secrets.
- Use HTTPS in production.

### 13. Extending the App
- Replace the simulated reset password API in `ForgotPasswordScreen` with a call to your backend.
- Add more profile fields or validation rules centrally.
- Implement push notifications and deep links for password reset flows.

### 14. Converting this Document to Word
- Option 1: Open this Markdown file in Microsoft Word and save as `.docx`.
- Option 2 (CLI): Use `pandoc`:
  - `pandoc docs/MedAlert_Documentation.md -o docs/MedAlert_Documentation.docx`

### 15. Backend API Contract (expected)

Base: `${EXPO_PUBLIC_BASE_URL}/api`

- POST `/auth/register`
  - Request (JSON):
    - camelCase or snake_case accepted by some backends; recommended camelCase:
    ```json
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "password": "8+ chars",
      "phoneNumber": "optional",
      "location": "optional",
      "profileImage": "optional URI"
    }
    ```
  - Response (JSON):
    ```json
    {
      "success": true,
      "user": { "id": "...", "email": "john@example.com", "firstName": "John", "lastName": "Doe" },
      "accessToken": "...",
      "refreshToken": "..."
    }
    ```

- POST `/auth/login`
  - Request (JSON): `{ "email": "john@example.com", "password": "..." }`
  - Response (JSON): same shape as register response

- GET `/auth/me`
  - Headers: `Authorization: Bearer <accessToken>`
  - Response: `{ "user": { ... } }`

- POST `/auth/logout` (optional)
  - Headers: `Authorization: Bearer <accessToken>`
  - Response: `{ "success": true }`

- POST `/auth/refresh`
  - Request: `{ "refreshToken": "..." }`
  - Response: `{ "accessToken": "..." }`

Error format recommendation:
```json
{ "message": "Invalid email or password" }
```

### 16. Permissions & Privacy
- Location: requested on Signup when user taps detect button; auto-detects silently on mount only if permission already granted.
- Camera/Photos: used for profile image selection via Expo Image Picker.
- OAuth: opens system browser; token exchange handled securely over HTTPS in production.

### 17. Theming & Styling
- `ThemeContext` provides `theme` and `getThemeColors()`; screens derive dynamic colors (background, text, border, error, primary).
- Validation styles use Google’s red (`#d93025`) for errors.

### 18. Build & Release (high-level)
- Android: `eas build -p android` (set up EAS first) or classic builds per Expo docs.
- iOS: `eas build -p ios` (requires Apple account and certificates).
- Ensure environment variables are set at build time (EAS secrets / env).


