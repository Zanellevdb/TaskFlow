Authentication Flow Documentation

Overview

TaskFlow uses JWT (JSON Web Tokens) with access and refresh tokens for stateless authentication. This document describes the complete authentication flow and implementation details.

Token Strategy

Access Token

Duration: 15 minutes (configurable)

Usage: Included in Authorization: Bearer <token> header

Storage: Can be stored in memory, localStorage, or sessionStorage

Payload: { userId, email, iat, exp }

Refresh Token

Duration: 7 days (configurable)

Usage: Only for obtaining new access tokens

Storage: Recommended in httpOnly cookie (secure, not accessible to JavaScript)

Payload: { userId, email, iat, exp }

API Endpoints

1. Register User

Endpoint: POST /api/auth/register

Request:

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "SecurePassword123"
}

Validation Rules:

Email: Valid email format, must be unique

Name: Minimum 2 characters

Password: Minimum 8 characters

Response (201 Created):

{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "abc123",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

Error Response (409 Conflict):

{
  "success": false,
  "message": "Email already registered"
}

2. Login User

Endpoint: POST /api/auth/login

Request:

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}

Response (200 OK):

{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "abc123",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

Response Headers:

Set-Cookie: refreshToken=<token>; HttpOnly; Secure; SameSite=Strict; Max-Age=604800

Error Response (401 Unauthorized):

{
  "success": false,
  "message": "Invalid email or password"
}

3. Refresh Access Token

Endpoint: POST /api/auth/refresh

Request:

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (200 OK):

{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

Error Response (401 Unauthorized):

{
  "success": false,
  "message": "Invalid refresh token"
}

4. Get Current User

Endpoint: GET /api/auth/me

Headers:

Authorization: Bearer <accessToken>

Response (200 OK):

{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "abc123",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}

Error Response (401 Unauthorized):

{
  "success": false,
  "message": "Invalid access token"
}

5. Logout

Endpoint: POST /api/auth/logout

Headers:

Authorization: Bearer <accessToken>

Response (200 OK):

{
  "success": true,
  "message": "Logout successful"
}

Response Headers:

Set-Cookie: refreshToken=; HttpOnly; Secure; SameSite=Strict; Max-Age=0

Client-Side Authentication

Storing Tokens

// Access token in memory/localStorage/sessionStorage
localStorage.setItem('accessToken', response.data.accessToken);

// Refresh token in httpOnly cookie (set by server)
// Use httpOnly for refresh to prevent XSS attacks

Making Authenticated Requests

import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true
});

// Add access token to each request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle token expiration and refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getCookie('refreshToken');

        const response = await axios.post(
          '/api/auth/refresh',
          { refreshToken },
          { withCredentials: true }
        );

        localStorage.setItem(
          'accessToken',
          response.data.data.accessToken
        );

        originalRequest.headers.Authorization =
          `Bearer ${response.data.data.accessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

Security Best Practices

1. Password Security

Minimum 8 characters required

Hashed with bcrypt (10 salt rounds)

Never stored in plain text

Never returned in API responses

2. Token Security

Short-lived access tokens (15 minutes)

Refresh tokens expire after 7 days

Refresh token should use an httpOnly cookie

Secure cookies should be enabled in production

SameSite cookie protection is enabled

JWT secrets must be strong random values

Never commit secrets to version control

3. Input Validation

Zod schemas validate request bodies

Invalid input returns 400 Bad Request

Validation errors include field-level details

4. Error Handling

Authentication failures return 401 Unauthorized

Duplicate registration returns 409 Conflict

Unexpected errors return 500 Internal Server Error

Password and token details are not exposed in error messages

Error Codes

400 Bad Request

Validation errors (invalid email, short password, etc.)

Includes detailed error messages for each field

401 Unauthorized

Invalid credentials

Expired or invalid token

Missing authentication header

409 Conflict

Email already registered

User already exists

500 Internal Server Error

Database errors

Unexpected server errors

Testing

Unit Tests

Password hashing and comparison

JWT generation and verification

Input validation

Integration Tests

Complete register flow

Complete login flow

Token refresh flow

Access to protected endpoints

Error scenarios

Test Credentials (Development Only)

Email: alice@example.com Password: password123

Email: bob@example.com Password: password123

Email: charlie@example.com Password: password123

Troubleshooting

"Invalid email or password"

Verify email exists in database

Verify password is correct

Check password hashing is working

"Token expired"

Use refresh endpoint to get a new token

Check system clock is synchronized

Verify JWT_EXPIRES_IN is configured correctly

"Email already registered"

Email is already in database

Use login endpoint instead

Request password reset if needed

CORS errors

Check origin is allowed in CORS configuration

Verify credentials are being sent (withCredentials: true)

Check cookie settings in browser

Configuration

Environment variables in .env:

JWT_SECRET=<strong-random-string>
JWT_REFRESH_SECRET=<strong-random-string>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d