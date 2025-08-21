<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/9113740/201498864-2a900c64-d88f-4ed4-b5cf-770bcb57e1f5.png">
  <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/9113740/201498152-b171abb8-9225-487a-821c-6ff49ee48579.png">
</picture>

<div align="center"><strong>Next.js Admin Dashboard Starter Template With Shadcn-ui</strong></div>
<div align="center">Built with the Next.js 15 App Router</div>
<br />
<div align="center">
<a href="https://dub.sh/shadcn-dashboard">View Demo</a>
<span>
</div>

## Overview

This is a starter template using the following stack:

- Framework - [Next.js 15](https://nextjs.org/13)
- Runtime - [React 18](https://react.dev) (Stable compatibility with ecosystem)
- Language - [TypeScript](https://www.typescriptlang.org)
- Auth - [Clerk](https://go.clerk.com/ILdYhn7)
- Error tracking - [<picture><img alt="Sentry" src="public/assets/sentry.svg">
        </picture>](https://sentry.io/for/nextjs/?utm_source=github&utm_medium=paid-community&utm_campaign=general-fy26q2-nextjs&utm_content=github-banner-project-tryfree)
- Styling - [Tailwind CSS v4](https://tailwindcss.com)
- Components - [Shadcn-ui](https://ui.shadcn.com)
- Schema Validations - [Zod](https://zod.dev)
- State Management - [Zustand](https://zustand-demo.pmnd.rs)
- Search params state manager - [Nuqs](https://nuqs.47ng.com/)
- Tables - [Tanstack Data Tables](https://ui.shadcn.com/docs/components/data-table) • [Dice table](https://www.diceui.com/docs/components/data-table)
- Forms - [React Hook Form](https://ui.shadcn.com/docs/components/form)
- Command+k interface - [kbar](https://kbar.vercel.app/)
- Linting - [ESLint](https://eslint.org)
- Pre-commit Hooks - [Husky](https://typicode.github.io/husky/)
- Formatting - [Prettier](https://prettier.io)

_If you are looking for a Tanstack start dashboard template, here is the [repo](https://git.new/tanstack-start-dashboard)._

## Pages

| Pages                                                                                 | Specifications                                                                                                                                                                                                                                                          |
| :------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Signup / Signin](https://go.clerk.com/ILdYhn7)      | Authentication with **Clerk** provides secure authentication and user management with multiple sign-in options including passwordless authentication, social logins, and enterprise SSO - all designed to enhance security while delivering a seamless user experience. |
| [Dashboard (Overview)](https://shadcn-dashboard.kiranism.dev/dashboard)    | Cards with Recharts graphs for analytics. Parallel routes in the overview sections feature independent loading, error handling, and isolated component rendering. |
| [Product](https://shadcn-dashboard.kiranism.dev/dashboard/product)         | Tanstack tables with server side searching, filter, pagination by Nuqs which is a Type-safe search params state manager in nextjs                                                                                                                                       |
| [Product/new](https://shadcn-dashboard.kiranism.dev/dashboard/product/new) | A Product Form with shadcn form (react-hook-form + zod).                                                                                                                                                                                                                |
| [Profile](https://shadcn-dashboard.kiranism.dev/dashboard/profile)         | Clerk's full-featured account management UI that allows users to manage their profile and security settings                                                                                                                                                             |
| [Kanban Board](https://shadcn-dashboard.kiranism.dev/dashboard/kanban)     | A Drag n Drop task management board with dnd-kit and zustand to persist state locally.                                                                                                                                                                                  |
| [Not Found](https://shadcn-dashboard.kiranism.dev/dashboard/notfound)      | Not Found Page Added in the root level                                                                                                                                                                                                                                  |
| [Global Error](https://sentry.io/for/nextjs/?utm_source=github&utm_medium=paid-community&utm_campaign=general-fy26q2-nextjs&utm_content=github-banner-project-tryfree)           | A centralized error page that captures and displays errors across the application. Integrated with **Sentry** to log errors, provide detailed reports, and enable replay functionality for better debugging. |

## Feature based organization

```plaintext
src/
├── app/ # Next.js App Router directory
│ ├── (auth)/ # Auth route group
│ │ ├── (signin)/
│ ├── (dashboard)/ # Dashboard route group
│ │ ├── layout.tsx
│ │ ├── loading.tsx
│ │ └── page.tsx
│ └── api/ # API routes
│
├── components/ # Shared components
│ ├── ui/ # UI components (buttons, inputs, etc.)
│ └── layout/ # Layout components (header, sidebar, etc.)
│
├── features/ # Feature-based modules
│ ├── feature/
│ │ ├── components/ # Feature-specific components
│ │ ├── actions/ # Server actions
│ │ ├── schemas/ # Form validation schemas
│ │ └── utils/ # Feature-specific utilities
│ │
├── lib/ # Core utilities and configurations
│ ├── auth/ # Auth configuration
│ ├── db/ # Database utilities
│ └── utils/ # Shared utilities
│
├── hooks/ # Custom hooks
│ └── use-debounce.ts
│
├── stores/ # Zustand stores
│ └── dashboard-store.ts
│
└── types/ # TypeScript types
└── index.ts
```

## Getting Started

> [!IMPORTANT]  
> **React Version Compatibility**: This project uses **React 18** for maximum stability and compatibility with the entire ecosystem. While Next.js 15 supports React 19, we've chosen React 18 to avoid compatibility issues with icon libraries (@tabler/icons-react, lucide-react, @radix-ui/react-icons) and third-party components that haven't fully adapted to React 19's stricter type system yet.

### React 18 vs React 19 Compatibility

**Why React 18?**
- ✅ **Full ecosystem compatibility** - All icon libraries and UI components work seamlessly
- ✅ **Stable production-ready** - Battle-tested in enterprise applications  
- ✅ **No TypeScript errors** - Avoids `ForwardRefExoticComponent` type conflicts
- ✅ **Better developer experience** - No need for manual component wrapping or type assertions

**React 19 Issues (Resolved by using React 18):**
- ❌ Icon libraries export components with incompatible `ForwardRefExoticComponent` types
- ❌ React 19 expects JSX components to have `(props: any) => ReactNode` signature
- ❌ Requires manual `React.createElement()` wrapping for many third-party components
- ❌ Breaking changes in component prop typing

> [!TIP]
> **Future Migration**: You can upgrade to React 19 later when the ecosystem fully adapts. For now, React 18 provides all modern React features with maximum stability.

Follow these steps:

Clone the repo:

```
git clone https://github.com/Kiranism/next-shadcn-dashboard-starter.git
```

- `pnpm install` ( we have legacy-peer-deps=true added in the .npmrc)
- Create a `.env.local` file by copying the example environment file:
  `cp env.example.txt .env.local`
- Add the required environment variables to the `.env.local` file.
- `pnpm run dev`

##### Environment Configuration Setup

To configure the environment for this project, refer to the `env.example.txt` file. This file contains the necessary environment variables required for authentication and error tracking.

You should now be able to access the application at http://localhost:3000.

## Troubleshooting

### React 19 Compatibility Issues

If you encounter TypeScript errors like:
```
Type 'ForwardRefExoticComponent<...>' is not assignable to type '(props: any) => ReactNode'
```

**Root Cause**: React 19 introduced stricter typing for JSX components. Icon libraries and many UI components haven't fully adapted to these changes.

**Solutions**:
1. **Recommended**: Use React 18 (already configured in this project)
2. **Alternative**: If you must use React 19, you'll need to:
   - Wrap icon components with `React.createElement(IconComponent as any, props)`
   - Use type assertions: `as any` for third-party components
   - Update component prop types manually

**Migration Path**: 
- Stay on React 18 for production stability
- Monitor ecosystem adoption of React 19
- Upgrade when major libraries provide full React 19 support

### Common Build Errors

**Missing Environment Variables**:
```bash
cp env.example.txt .env.local
# Add your actual environment variables
```

**Package Installation Issues**:
```bash
rm -rf node_modules package-lock.json
pnpm install
```

> [!WARNING]
> After cloning or forking the repository, be cautious when pulling or syncing with the latest changes, as this may result in breaking conflicts.

Cheers! 🥂
