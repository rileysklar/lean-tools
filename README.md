# Manufacturing Efficiency Tracking System

<div align="center">
  <strong>Industrial Production Efficiency & Machine Cycle Tracking</strong>
</div>
<div align="center">Built with Next.js 15, React 18, TypeScript, and Supabase</div>

<br />

<div align="center">
  <a href="#overview">Overview</a> •
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#database-setup">Database Setup</a>
</div>

## Overview

The Manufacturing Efficiency Tracking System is designed for industrial production facilities to track and optimize efficiency. It logs machine cycles, identifies bottlenecks, measures cycle times, and allows for dynamic adjustments to production standards.

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

## Features

### 🏭 **Production Management**
- **Multi-tenant Architecture** - Support for multiple organizations and sites
- **Value Stream Mapping** - Hierarchical organization of production cells
- **Real-time Efficiency Tracking** - Live monitoring of machine performance
- **Cycle Time Analysis** - Target vs. actual cycle time comparison

### 🔐 **Security & Access Control**
- **Clerk Authentication** - Enterprise-grade user management
- **Role-Based Access Control (RBAC)** - Admin, Manager, Operator roles
- **Protected Routes** - Secure access to sensitive operations
- **Row Level Security** - Database-level data isolation

### 📊 **Analytics & Reporting**
- **Efficiency Dashboards** - Real-time performance metrics
- **Downtime Tracking** - Planned and unplanned stoppage monitoring
- **Issue Management** - Problem tracking and resolution workflows
- **Historical Analysis** - Trend analysis and performance optimization

### ⚡ **Real-time Capabilities**
- **Live Updates** - WebSocket-based real-time data synchronization
- **Instant Notifications** - Real-time alerts for critical events
- **Live Efficiency Metrics** - Continuous monitoring of production KPIs

## Tech Stack

- **Framework** - [Next.js 15](https://nextjs.org/) with App Router
- **Runtime** - [React 18](https://react.dev) (Stable compatibility)
- **Language** - [TypeScript](https://www.typescriptlang.org)
- **Authentication** - [Clerk](https://clerk.com/) (Enterprise auth)
- **Database** - [Supabase](https://supabase.com/) (PostgreSQL + Real-time)
- **Styling** - [Tailwind CSS](https://tailwindcss.com) with CSS Variables
- **Components** - [ShadCN/UI](https://ui.shadcn.com) (Radix UI primitives)
- **State Management** - React hooks + Context API
- **Forms** - [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Real-time** - Supabase Realtime with WebSockets
- **Deployment** - [Vercel](https://vercel.com/) (Frontend) + [Fly.io](https://fly.io/) (Backend)

## Project Structure

```plaintext
src/
├── app/ # Next.js App Router
│ ├── (auth)/ # Authentication routes (route group)
│ │ ├── sign-in/ # Sign in page
│ │ └── sign-up/ # Sign up page
│ ├── welcome/ # Welcome/landing page
│ ├── dashboard/ # Main application routes
│ │ ├── attainment/ # Efficiency tracking
│ │ ├── organization/ # Company/site management
│ │ └── profile/ # User profile management
│ ├── api/ # API endpoints
│ ├── layout.tsx # Root layout
│ ├── page.tsx # Home page
│ ├── globals.css # Global styles
│ └── theme.css # Theme configuration
│
├── components/ # Shared components
│ ├── ui/ # ShadCN UI components
│ ├── layout/ # Layout components
│ ├── auth/ # Authentication components
│ └── features/ # Feature showcase components
│
├── features/ # Feature-based modules
│ ├── auth/ # Authentication features
│ └── profile/ # User profile management
│
├── hooks/ # Custom React hooks
│ ├── use-user-role.ts # Role management
│ ├── use-clerk-organization.ts # Organization context
│ └── use-loading-state.ts # Loading state management
│
├── lib/ # Core utilities
│ ├── auth/ # Permission system
│ ├── forms/ # Form validation
│ └── utils/ # Shared utilities
│
└── types/ # TypeScript definitions
    ├── api.ts # API types
    ├── common.ts # Common types
    └── data-table.ts # Table component types
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm package manager
- Clerk.com account for authentication
- Supabase account for database

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd lean-tools
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Environment Configuration**
```bash
# Copy environment template
cp env.example.txt .env.local

# Add your environment variables
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-key
CLERK_SECRET_KEY=your-clerk-secret
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
```

4. **Start development server**
```bash
pnpm dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup

The system uses Supabase (PostgreSQL) for data storage. See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for complete database setup instructions.

### Quick Database Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Get your project URL and API keys

2. **Run Database Schema**
   - Execute the SQL commands from `SUPABASE_SETUP.md`
   - Set up Row Level Security policies
   - Configure real-time subscriptions

3. **Test Connection**
   - Verify database connectivity
   - Test CRUD operations
   - Validate RLS policies

## Authentication & Roles

### User Roles

- **Admin** - Full system access, user management, organization settings
- **Manager** - Efficiency tracking, reporting, basic organization access
- **Operator** - Machine cycle tracking, basic reporting, profile management

### Access Control

- **Company & Site** - Locked upon sign-up, admin-managed
- **Value Stream & Cell** - Adjustable within the app
- **Role Permissions** - Granular access control based on user roles

## Development Workflow

### Code Quality Standards

- **TypeScript Strict Mode** - Full type safety
- **ESLint + Prettier** - Code formatting and linting
- **Feature-based Organization** - Modular, maintainable architecture
- **Component Library** - Consistent UI with ShadCN/UI

### Testing

- **Unit Tests** - Component and utility testing
- **Integration Tests** - API endpoint testing
- **E2E Tests** - User workflow testing

### Deployment

- **Frontend** - Vercel with automatic deployments
- **Database** - Supabase with automated backups
- **Environment Management** - Separate configs for dev/staging/prod

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

**Authentication Problems**
- Verify Clerk environment variables
- Check user role assignments
- Validate organization membership

**Database Connection Issues**
- Confirm Supabase credentials
- Check network connectivity
- Verify RLS policies

**Build Errors**
- Clear node_modules: `rm -rf node_modules pnpm-lock.yaml && pnpm install`
- Check TypeScript errors: `pnpm type-check`
- Verify environment variables

### Getting Help

- Check the [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for database issues
- Review [Clerk documentation](https://clerk.com/docs) for auth problems
- Open an issue for bugs or feature requests

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [React](https://react.dev)
- UI components from [ShadCN/UI](https://ui.shadcn.com)
- Authentication by [Clerk](https://clerk.com/)
- Database powered by [Supabase](https://supabase.com/)

---

**Ready to optimize your manufacturing efficiency?** 🚀

Start by setting up your Supabase database and implementing the machine cycle tracking features. Check out the [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed database configuration instructions.
