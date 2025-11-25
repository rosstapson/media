# Authentication Setup

The application now includes JWT-based authentication to protect media files.

## Features Added

### Backend (Express + JWT)
- ✅ JWT token generation and verification
- ✅ Secure password hashing with bcryptjs
- ✅ Cookie-based and header-based authentication
- ✅ Protected API endpoints
- ✅ User login/logout functionality

### Frontend (React)
- ✅ Login page with form validation
- ✅ Auth context for global state management
- ✅ Automatic token refresh and verification
- ✅ Protected routes that require authentication
- ✅ User menu with logout functionality

## API Endpoints

### Authentication Endpoints

#### POST `/api/auth/login`
Login with email/username and password.

**Request:**
```json
{
  "email": "admin@media-player.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "admin@media-player.com",
    "username": "admin",
    "firstName": "Admin",
    "lastName": "User"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### GET `/api/auth/verify`
Verify if the current token is valid.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "admin@media-player.com",
    "username": "admin",
    "firstName": "Admin",
    "lastName": "User"
  }
}
```

#### POST `/api/auth/logout`
Logout and clear authentication cookie.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Protected Media Endpoints

Both endpoints now require authentication:

- `GET /api/media` - List all media files
- `GET /api/media/:filename` - Stream a specific media file

**Authentication Methods:**
1. Cookie (set automatically on login)
2. Authorization header: `Bearer <token>`
3. Query parameter: `?token=<token>` (for media streaming)

## Environment Variables

Add these to your `.env` file:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## Default Credentials

After running `yarn db:seed`, you can login with:

- **Email:** admin@media-player.com
- **Username:** admin
- **Password:** admin123

⚠️ **Important:** Change these credentials in production!

## How It Works

### Backend Flow

1. User sends login credentials to `/api/auth/login`
2. Backend verifies credentials against database
3. If valid, generates JWT token with user info
4. Token sent in response and set as httpOnly cookie
5. All subsequent requests include token in cookie or Authorization header
6. Middleware verifies token before allowing access to protected routes

### Frontend Flow

1. User enters credentials on login page
2. On successful login, token stored in localStorage and AuthContext
3. AuthContext wraps entire app and provides auth state
4. Protected routes check `isAuthenticated` before rendering
5. All API requests include token in Authorization header
6. On logout, token removed from storage and state cleared

### Token Security

- Tokens are signed with `JWT_SECRET`
- Tokens expire after 7 days (configurable)
- httpOnly cookies prevent XSS attacks
- CORS configured to only accept requests from frontend URL
- Passwords hashed with bcrypt (10 rounds)

## Usage

### Starting the App

1. **Start Backend:**
   ```powershell
   cd backend
   yarn dev
   ```

2. **Start Frontend:**
   ```powershell
   cd frontend
   yarn start
   ```

3. Navigate to `http://localhost:3000`
4. Login with admin credentials
5. Access media library after authentication

### Testing Authentication

**Test Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@media-player.com","password":"admin123"}'
```

**Test Protected Endpoint:**
```bash
curl http://localhost:5000/api/media \
  -H "Authorization: Bearer <your-token>"
```

## Security Best Practices

✅ **Implemented:**
- Password hashing with bcrypt
- JWT for stateless authentication
- httpOnly cookies
- CORS protection
- Token expiration

⚠️ **For Production:**
- Use strong `JWT_SECRET` (32+ random characters)
- Enable HTTPS (set `secure: true` in cookies)
- Implement rate limiting on login endpoint
- Add refresh token mechanism
- Enable CSRF protection
- Set up monitoring and logging
- Implement password reset functionality
- Add email verification

## Troubleshooting

### "Authentication required" error
- Ensure you're logged in
- Check that token is in localStorage
- Verify token hasn't expired
- Check CORS settings if calling from different origin

### "Invalid credentials" error
- Verify email/username is correct
- Ensure password matches database
- Run `yarn db:seed` to create admin user

### Token not persisting
- Check browser localStorage
- Ensure cookies are enabled
- Verify CORS credentials setting

## File Structure

```
backend/
├── middleware/
│   └── auth.js           # JWT middleware
├── routes/
│   └── auth.js           # Auth endpoints
├── db/
│   ├── schema.js         # Users table schema
│   └── seed.js           # Admin user seeding
└── server.js             # Protected routes

frontend/
├── src/
│   ├── components/
│   │   ├── Login.js      # Login form
│   │   └── Login.css
│   ├── context/
│   │   └── AuthContext.js # Auth state management
│   ├── App.js            # Protected app
│   └── index.js          # AuthProvider wrapper
```

## Next Steps

Consider implementing:
- User registration
- Password reset flow
- Email verification
- Role-based access control (RBAC)
- Refresh tokens
- Two-factor authentication (2FA)
- Session management
- Account lockout after failed attempts
