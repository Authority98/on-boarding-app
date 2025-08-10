# PlankPort - Client Onboarding Platform

A modern, full-featured client onboarding platform built with Next.js, TypeScript, and Supabase. PlankPort streamlines the client onboarding process with an intuitive dashboard, pricing plans, and comprehensive user management.

## Features

### 🔐 Authentication & User Management
- Secure sign-in/sign-up with Supabase authentication
- Protected routes and role-based access
- User profile management

### 💰 Pricing & Subscriptions
- Flexible pricing plans (Free, Startup, Agency)
- Monthly/Annual billing options with 20% annual discount
- Stripe integration for payment processing
- Reusable pricing components

### 📊 Dashboard
- Comprehensive admin dashboard with real-time data
- Analytics and reporting
- Complete client management system with CRUD operations
- Real-time client statistics (active, completed, success rate)
- Recent clients display with status tracking
- Task tracking
- Message center
- Template management
- Settings configuration
- Upgrade plan functionality

### 🎨 UI/UX
- Modern, responsive design with Tailwind CSS
- Dark/Light theme support
- Accessible components with proper cursor interactions
- Mobile-friendly interface
- Interactive dialogs and modals
- Real-time form validation
- Toast notifications for user feedback

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Supabase account
- Stripe account (for payments)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Authority98/on-boarding-app.git
cd on-boarding-app
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your Supabase and Stripe credentials to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

4. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── about/              # About page
├── dashboard/          # Protected dashboard area
│   ├── analytics/      # Analytics dashboard
│   ├── clients/        # Client management
│   ├── messages/       # Message center
│   ├── settings/       # User settings
│   ├── tasks/          # Task management
│   ├── templates/      # Template management
│   └── upgrade/        # Plan upgrade page
├── pricing/            # Public pricing page
├── signin/             # Authentication pages
└── signup/

components/
├── ui/                        # Reusable UI components
├── add-client-dialog.tsx      # Add new client dialog
├── edit-client-dialog.tsx     # Edit client information dialog
├── feature-in-progress-dialog.tsx # Feature progress notification
├── pricing-plans.tsx          # Pricing plans component
├── stripe-popup.tsx           # Stripe payment popup
├── theme-toggle.tsx           # Dark/light theme toggle
└── protected-route.tsx        # Route protection

lib/
├── auth-context.tsx    # Authentication context
├── supabase.ts         # Supabase client
└── utils.ts            # Utility functions
```

## Recent Updates

### v1.3.0 - Client Management & Real Data Dashboard
- ✅ Complete client management system with CRUD operations
- ✅ Real-time dashboard data from Supabase database
- ✅ Client statistics calculation (active, completed, success rate)
- ✅ Interactive client editing with form validation
- ✅ Database migrations for client data structure
- ✅ Removed demo data and implemented real client display
- ✅ Enhanced UI with loading states and error handling
- ✅ Toast notifications for user actions

### v1.2.0 - Enhanced Pricing & UX Improvements
- ✅ Refactored pricing plans into reusable components
- ✅ Added upgrade plan functionality in dashboard
- ✅ Implemented Stripe popup integration
- ✅ Fixed cursor pointer interactions on all buttons
- ✅ Separated billing toggle from header in pricing component
- ✅ Added configurable pricing component props

### v1.1.0 - Dashboard & Authentication
- ✅ Complete dashboard implementation
- ✅ Supabase authentication integration
- ✅ Protected routes and user management
- ✅ Theme toggle functionality

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@plankport.com or join our Discord community.
