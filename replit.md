# Parlant Chat React - Project Documentation

## Overview
This is a React component library for integrating Parlant chat agents into React applications. The project provides both an embeddable chat component and a floating chat widget.

## Project Structure
- **Library Source**: `src/App.tsx` - Main Chatbox component
- **Development Demo**: `src/main.tsx` - Development environment for testing the component
- **Build System**: Vite with TypeScript and React
- **Package Manager**: npm

## Development Setup
- **Development Server**: Runs on port 5000 with Vite dev server
- **Host Configuration**: Configured for Replit environment (0.0.0.0:5000)
- **HMR**: Hot module replacement enabled for development

## Scripts
- `npm run dev` - Start development server
- `npm run build` - Build the library for production
- `npm run preview` - Preview production build
- `npm run lint` - Run Biome linter
- `npm run format` - Format code with Biome

## Dependencies
- **React 19** - Latest React version
- **Vite 7** - Build tool and dev server
- **TypeScript** - Type safety
- **Parlant Client** - Chat API integration
- **Radix UI** - UI components (Popover)
- **Lucide React** - Icons
- **React Query** - Data fetching and state management

## Deployment
- **Target**: Autoscale deployment (stateless)
- **Build**: npm run build
- **Serve**: npm run preview
- **Port**: 5000

## Current Status
✅ Dependencies installed
✅ Development environment configured
✅ Vite configuration optimized for Replit
✅ Workflow configured and running
✅ Build process verified
✅ Deployment configuration set

## Recent Changes
- Created development entry file (main.tsx) for component testing
- Configured Vite for Replit environment with proper host settings
- Set up workflow for development server
- Configured deployment for production builds
- **NEW**: Implemented visual section headings with themed styling and full-width separators
- **NEW**: Created scroll-aware header component that dynamically shows current visible section
- **NEW**: Added smooth CSS transitions for header background/text color changes between sections
- **NEW**: Implemented fallback header that shows agent name and avatar when no sections exist
- **NEW**: Header seamlessly transitions between fallback (white background) and section themes
- Project successfully imported and running (Sept 29, 2025)