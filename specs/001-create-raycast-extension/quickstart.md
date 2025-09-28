# Quickstart: Create Raycast Extension

## Prerequisites

- Node.js 18+ installed
- Raycast app installed on macOS/Windows
- TypeScript knowledge recommended

## 1. Project Initialization

```bash
# Create new Raycast extension project
npm create raycast-extension@latest my-extension

# Navigate to project directory
cd my-extension

# Install dependencies
npm install
```

**Expected Output**: Project scaffold with package.json, tsconfig.json, and src/ directory created

## 2. Development Environment Setup

```bash
# Start development mode with hot reloading
npm run dev
```

**Expected Behavior**:

- Extension loads in Raycast
- Hot reloading active for file changes
- Development command available in Raycast

## 3. Configure Extension Manifest

Edit `package.json` to define extension metadata:

```json
{
  "name": "my-extension",
  "title": "My Extension",
  "description": "Description of what the extension does",
  "author": "your-name",
  "categories": ["Productivity"],
  "commands": [
    {
      "name": "main",
      "title": "Main Command",
      "description": "Primary extension command",
      "mode": "view"
    }
  ]
}
```

**Validation**: Extension appears in Raycast with correct title and description

## 4. Create First Command

Create `src/main.tsx`:

```typescript
import { List } from "@raycast/api";

export default function Command() {
  return (
    <List>
      <List.Item title="Hello World" />
    </List>
  );
}
```

**Expected Result**: Command displays "Hello World" item in Raycast

## 5. Add Preferences (Optional)

Add to `package.json`:

```json
{
  "preferences": [
    {
      "name": "apiKey",
      "title": "API Key",
      "description": "Your service API key",
      "type": "password",
      "required": true
    }
  ]
}
```

**Validation**: Preference appears in Raycast extension settings

## 6. Build and Test

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint -- --fix

# Build for production
npm run build
```

**Expected Output**: No linting errors, successful build in `dist/` directory

## 7. Publishing Preparation

```bash
# Validate extension for store submission
npm run publish -- --validate

# Submit to Raycast Store (when ready)
npm run publish
```

**Success Criteria**:

- ✅ Extension loads without errors
- ✅ All commands respond within 200ms
- ✅ Preferences save and load correctly
- ✅ Linting passes with zero warnings
- ✅ Build completes successfully
- ✅ Store validation passes

## Common Issues and Solutions

### Extension Won't Load

- Check TypeScript compilation errors
- Verify package.json schema compliance
- Ensure all required fields are present

### Slow Performance

- Implement lazy loading for heavy operations
- Use React.memo for expensive components
- Check for unnecessary re-renders

### Store Submission Fails

- Run `npm run lint -- --fix` to fix code style
- Verify icon files are PNG format
- Check all required metadata is present

## Next Steps

- Add error handling with Toast notifications
- Implement state persistence with LocalStorage
- Add keyboard shortcuts for better UX
- Write unit tests for command logic
