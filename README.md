# Habit Tracker

A Raycast extension for tracking your habits and staying productive.

## Features

- **Authentication**: Secure login and account management
- **Dashboard**: View your habit tracking progress and statistics
- **API Integration**: Connect to your preferred habit tracking backend
- **Preferences**: Configurable API base URL for flexibility

## Installation

1. Install the extension from the Raycast Store
2. Configure your API base URL in extension preferences
3. Use the Authentication command to sign in
4. Access your Dashboard to view habits and progress

## Commands

### Authentication
Login or Sign Up to your Habit Tracker account

**Usage**: `auth`

### Dashboard
View your habit tracking dashboard with progress and statistics

**Usage**: `dashboard`

## Configuration

The extension requires configuration of an API base URL in Raycast preferences:

- **API Base URL**: The base URL for your Habit Tracker API (default: `http://localhost:61967/api`)

## Development

This extension is built with:

- **TypeScript**: Type-safe development
- **React**: UI components via Raycast API
- **ESLint**: Code quality and consistency
- **Jest**: Testing framework

### Setup

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Lint code
npm run lint
```

### Project Structure

```
src/
├── auth.tsx              # Authentication command
├── auth-service.ts       # Session management service
├── dashboard.tsx         # Dashboard command
├── logout-action.ts      # Shared logout functionality
└── types.ts             # TypeScript interfaces

tests/
├── contract/            # Contract validation tests
├── integration/         # End-to-end tests
└── unit/               # Component unit tests

assets/
├── extension-icon.png   # Main extension icon
└── command-icons/      # Individual command icons
```

## License

MIT
