# AppHelper Login Playground

A test environment for the `@churchapps/apphelper-login` components.

## Quick Start

From the root directory, run:

```bash
npm run test:login
```

This will:
1. Build the required packages
2. Start the development server
3. Open your browser to http://localhost:3000

## Available Components

The playground includes test pages for all login components:

- **LoginPage** - Main login page with tabs
- **Login** - Simple login form
- **Register** - User registration form  
- **Forgot** - Password recovery form
- **LoginSetPassword** - Set new password form
- **Church Selection** - Church search and registration components

## Development

To run the playground independently:

```bash
cd playground
npm run dev
```

## Structure

- `src/App.tsx` - Main app with routing
- `src/main.tsx` - Entry point
- Components are imported from `@churchapps/apphelper-login`
- Uses Material-UI for theming and layout