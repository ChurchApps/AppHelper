# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AppHelper is a React/Next.js component library for ChurchApps - a collection of Material-UI based components, helpers, and utilities for church management applications. It's published as `@churchapps/helpers` on npm and depends on `@churchapps/helpers` for core interfaces and utilities.

## Build Commands

```bash
npm run clean          # Remove dist folder
npm run tsc           # TypeScript compilation only
npm run build         # Full build (clean + tsc + copy assets)
npm run copy-assets   # Copy CSS, icons, emojis, and language files
```

### Asset Copying
The build process copies several asset types to the dist folder:
- CSS files from markdown editor
- SVG icons (toolbar buttons, formatting icons)
- Emoji images (PNG files)
- Localization files (12 languages: en, de, es, fr, hi, it, ko, no, pt, ru, tl, zh)

## Local Development & Linking

Due to React peer dependency conflicts, linking requires special handling:

```bash
# In AppHelper directory:
npm unlink ../../path/to/consumer/node_modules/react
npm unlink ../../path/to/consumer/node_modules/react-dom  
npm unlink ../../path/to/consumer/node_modules/react-router-dom
npm run build
npm link

# In consumer project:
npm link @churchapps/apphelper
npm start
```

Alternative approach using npm pack:
```bash
npm run build && npm pack
# Then reference the .tgz file in consumer's package.json
```

## Publishing

```bash
# Update version in package.json first
npm run build
npm publish --access=public
```

## Code Architecture

### Core Structure
- `src/components/` - React components using Material-UI 5
- `src/helpers/` - Re-exports from @churchapps/helpers plus app-specific utilities
- `src/donationComponents/` - Stripe-integrated donation forms and management
- `src/pageComponents/` - Authentication pages (login, register, etc.)
- `src/hooks/` - Custom React hooks

### Key Components

**SiteWrapper** - Main application shell with:
- Material-UI navigation drawer
- User authentication context
- Notification system integration
- Dynamic theming support

**MarkdownEditor** - Lexical-based rich text editor with:
- Lazy loading for performance
- Toolbar with formatting options
- Custom link and emoji plugins
- Markdown transformers

**Donation Components** - Stripe integration for:
- One-time and recurring donations
- Payment method management
- Fund-specific donation handling

### Helper Architecture
- Extends `@churchapps/helpers` with app-specific utilities
- `ApiHelper` - Centralized API communication with JWT authentication
- `AppearanceHelper` - Theme and branding management
- `SocketHelper` - Real-time communication
- `CurrencyHelper`, `DateHelper` - Formatting utilities

## Technology Stack

- **React 18+** with TypeScript
- **Material-UI 5** for components and theming
- **Lexical** for rich text editing
- **Stripe** for payment processing
- **i18next** for internationalization (12 languages)
- **Emotion** for CSS-in-JS styling

## Code Style

Key style rules enforced in the codebase:
- 2-space indentation
- Prefer double quotes for JSX
- No trailing spaces
- Arrow functions preferred
- No trailing commas
- Keep arrays/objects on single line when possible
- Consistent array/object formatting

Note: ESLint has been removed to eliminate deprecated dependency warnings. Code style is maintained manually.