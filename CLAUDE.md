# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Raycast extension for habit tracking that allows users to authenticate, create habit boards, and track their progress. The extension connects to a backend API (configurable via preferences) and uses session-based authentication with support for token refresh.

## Development Commands

### Core Commands

- `ray build` - Build the extension for production
- `ray develop` - Start development mode with hot reload
- `ray lint` - Run ESLint to check code quality
- `ray lint --fix` - Auto-fix lint issues
- `npx @raycast/api@latest publish` - Publish extension to Raycast Store

### Testing and Quality

- Always run `ray lint` before committing changes
- The project uses TypeScript - ensure type safety when making changes

## Architecture Overview

### Authentication Flow

The extension uses a sophisticated session-based authentication system with automatic token refresh:

- **AuthService** (`src/auth-service.ts`) - Singleton service managing authentication state
- **Session Management** - Stores encrypted session data in LocalStorage with expiry tracking
- **Auto-refresh** - Automatically refreshes expired tokens using refresh tokens
- **API Integration** - All API requests go through authenticated service with retry logic

Key authentication patterns:

- Sessions are stored with expiry timestamps for automatic refresh
- Cookie-based fallback for server-side session management
- Automatic logout on authentication failures
- Session verification on app focus/navigation

### Component Structure

#### Main Commands

- **Auth** (`src/auth.tsx`) - Handles login/registration with form validation
- **Dashboard** (`src/dashboard.tsx`) - Main interface showing user profile and habit boards

#### Data Models (`src/types.ts`)

- `User` - User profile with registration details
- `Board` - Habit tracking boards with metadata
- `CheckIn` - Individual habit tracking entries
- `SupabaseSession` - Authentication session structure
- `ApiError` - Standardized error handling

#### Shared Utilities

- **logout-action** (`src/logout-action.ts`) - Centralized logout handler used across components
- **auth-service** - Singleton pattern for state management across the extension

### State Management Patterns

The extension uses a singleton AuthService pattern with LocalStorage persistence:

- Session state survives app restarts
- Automatic session validation on initialization
- Reactive hooks for UI state updates
- Centralized API request handling with authentication

### Backend Integration

The extension expects a REST API with these endpoints:

- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `POST /auth/logout` - Session termination
- `POST /auth/token` - Token refresh
- `GET /auth/me` - Session verification
- `GET /boards` - Fetch user's habit boards
- `POST /boards` - Create new habit board
- `GET /check-ins?boardId=X` - Fetch check-ins for a board
- `POST /check-ins` - Create new check-in

API base URL is configurable via Raycast preferences (`apiBaseUrl`).

### Key Implementation Details

#### Session Handling

- Sessions include access_token, refresh_token, and calculated expiry time
- Auto-refresh happens 30 seconds before token expiry
- Failed refresh attempts trigger automatic logout
- Cookie-based sessions supported as fallback

#### Error Handling

- Custom `ApiError` class for standardized error responses
- Toast notifications for user feedback
- Graceful fallbacks for network failures
- Automatic retry logic for transient failures

#### Navigation Patterns

- Form-based flows for authentication
- List-based interfaces for data browsing
- ActionPanel integration for context actions
- Consistent logout action available throughout the app

## MCP Integration

The project includes MCP (Model Context Protocol) server configurations:

- **Supabase MCP** - Read-only access to Supabase project for database operations
- **Raycast Docs MCP** - Access to Raycast extension documentation

## File Organization

```text
src/
├── auth.tsx              # Authentication UI with login/signup forms
├── auth-service.ts       # Singleton authentication service
├── dashboard.tsx         # Main dashboard with boards and check-ins
├── logout-action.ts      # Shared logout functionality
└── types.ts             # TypeScript interfaces and error classes
```

## Security Considerations

- API tokens and sessions are stored securely in Raycast's LocalStorage
- Session expiry is enforced client-side with server verification
- Automatic cleanup of expired sessions
- API credentials configurable via Raycast preferences (not hardcoded)
