# PlankPort - Client Onboarding Platform

A modern, full-featured client onboarding platform built with Next.js, TypeScript, and Supabase. PlankPort streamlines the client onboarding process with an intuitive dashboard, pricing plans, and comprehensive user management.

## Features

### 🔐 Authentication & User Management
- Secure sign-in/sign-up with Supabase authentication
- Protected routes and role-based access
- User profile management with email change functionality
- Real-time auto-fill for agency URL during signup

### 💰 Pricing & Subscriptions
- Flexible pricing plans (Free, Startup, Agency)
- Monthly/Annual billing options with 20% annual discount
- Stripe integration for payment processing
- **Saved Payment Methods**: Secure card storage for one-click upgrades
- **Intelligent Upgrade Flow**: Detects saved cards and provides seamless upgrade experience
- **Subscription Management**: Real-time subscription status tracking and updates
- **Webhook Integration**: Automatic subscription synchronization with Stripe events
- Reusable pricing components

### 📊 Dashboard
- Comprehensive admin dashboard with real-time data
- Analytics and reporting
- Complete client management system with CRUD operations
- **Client Dashboard Editor**: Configure personalized dashboards for each client with advanced inline editing
- **Universal Inline Editing System**: Edit any content directly within the preview across all view modes
- **Full-Width Preview Layout**: Maximum editing space with sidebar-free interface design
- **Multi-Mode Dashboard System**: Three distinct dashboard experiences (Dashboard, Task, Hybrid)
- **Unique Client URLs**: Auto-generated secure URLs for each client's personalized dashboard
- **Public Client Access**: Clients can access their dashboards without authentication
- **Dynamic View Modes**: 
  - **Dashboard Mode**: Full analytics dashboard with KPIs, charts, and insights
  - **Task Mode**: Focused task list interface for client onboarding
  - **Hybrid Mode**: Combined dashboard and task management in one interface
- Real-time client statistics (active, completed, success rate)
- Recent clients display with status tracking
- User-specific client isolation for privacy
- Task tracking
- Message center
- Template management
- **Enhanced Settings**: Email change, billing management, and saved payment methods
- **Smart Upgrade Flow**: Context-aware upgrade functionality with saved card detection
- **Real-time Status Updates**: Live subscription status reflection across all components
- Personalized notifications and user avatars
- **Simplified Client Management**: Clean black/white themed client cards with improved space efficiency
- **Enhanced Delete Functionality**: Complete client deletion workflow with confirmation dialogs

### 🎨 UI/UX
- Modern, responsive design with Tailwind CSS
- **Clean Black/White Theme**: Minimalist design approach with monochrome color palette
- **Simplified Client Cards**: 40% more compact design with improved information density
- Dark/Light theme support
- Accessible components with proper cursor interactions
- Mobile-friendly interface
- Interactive dialogs and modals
- Real-time form validation
- Toast notifications for user feedback
- **Professional Card Layout**: Streamlined client information display with single action buttons

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Deployment**: Netlify
- **Runtime**: Node.js 20

## Recent Updates

### v4.2.0 - Client Card UI Simplification & Black/White Theme
- ✅ **Simplified Client Cards**: Dramatically reduced visual bulk by 40% with optimized padding and spacing
- ✅ **Black/White Theme Implementation**: Clean monochrome design with black headers and white content areas
- ✅ **Consolidated Information Layout**: Streamlined contact information display without heavy backgrounds or containers
- ✅ **Single Action Button**: Removed "View Dashboard" button, keeping only "Live Dashboard Editor" as primary action
- ✅ **Compact Avatar Design**: Reduced avatar size and positioning for better proportions
- ✅ **Minimal Icon Treatment**: Consistent gray monochrome icons throughout all sections
- ✅ **Improved Readability**: Better text hierarchy with smaller, consistent font sizes
- ✅ **Space Efficiency**: Enhanced information density while maintaining functionality
- ✅ **Enhanced Delete Functionality**: Complete delete client workflow with confirmation dialogs
- ✅ **Improved Dropdown Menu**: Enhanced dropdown with descriptive menu items and consistent styling
- ✅ **Professional Appearance**: Clean, minimalist design following modern UI/UX principles

### v4.1.0 - Advanced Inline Editing System
- ✅ **Universal Inline Editing**: Extended comprehensive inline editing to all dashboard view modes (Dashboard, Task, Hybrid)
- ✅ **Full-Width Preview Layout**: Removed sidebar completely to give preview maximum space for enhanced editing experience
- ✅ **Click-to-Edit Interface**: Users can now edit any text, color, or value directly within the preview by clicking on it
- ✅ **Comprehensive Task Mode Editing**: Complete inline editing for task titles, categories, priorities, progress tracking, and statistics
- ✅ **Enhanced Hybrid Mode**: Full inline editing capabilities for KPIs, tasks, progress overview, and section management
- ✅ **Visual Feedback System**: Hover states, editing indicators, and contextual controls for intuitive user experience
- ✅ **Keyboard Accessibility**: Enter/Escape key controls for quick save/cancel operations during editing
- ✅ **Dynamic Content Management**: Add/remove buttons that appear on hover for seamless content manipulation
- ✅ **Real-time Color Editing**: Advanced color pickers for theme customization directly within preview
- ✅ **Interactive Section Toggles**: Dynamic show/hide controls for dashboard sections with immediate preview updates
- ✅ **Mobile-Optimized Editing**: Responsive inline editing that works across all device sizes
- ✅ **WYSIWYG Experience**: True "what you see is what you get" editing similar to modern tools like Notion or Figma

### v4.0.0 - Complete Dashboard Content Management System
- ✅ **Comprehensive Content Editor**: Full-featured dashboard customization with visual editor interface
- ✅ **Advanced Layout Control**: Drag & drop components, section management, and responsive design controls
- ✅ **Complete Branding System**: Custom colors, logos, welcome messages, and company descriptions
- ✅ **Dynamic KPI Management**: Add, edit, remove, and reorder KPI cards with custom values and types
- ✅ **Task Management System**: Full task CRUD with priorities, due dates, categories, and status tracking
- ✅ **Announcement Center**: Create and manage client announcements with different types and active status
- ✅ **Media Management**: Upload and organize images, videos, and documents for client dashboards
- ✅ **Real-time Preview**: Live preview of dashboard changes with actual configuration data
- ✅ **Database Schema**: New tables for templates, content, and assets with proper RLS policies
- ✅ **Template System**: Reusable dashboard templates for quick client setup
- ✅ **Advanced UI Controls**: Color pickers, drag & drop, section toggles, and content ordering
- ✅ **Multi-tab Interface**: Organized editing experience with Layout, Content, Branding, Advanced, and Preview tabs

### v3.1.0 - Inline Dashboard Editor & UX Improvements
- ✅ **Inline Dashboard Editor**: Converted popup-based dashboard editor to seamless inline interface
- ✅ **Enhanced Navigation**: Added back navigation and improved client selection flow
- ✅ **Two-Column Layout**: Optimized space utilization with better visual hierarchy
- ✅ **State Management**: Implemented proper client selection state for smooth transitions
- ✅ **Mobile Responsive**: Enhanced mobile experience for dashboard editor interface
- ✅ **User Experience**: Eliminated popup interruptions for more natural editing workflow

### v3.0.0 - Client Dashboard Editor System
- ✅ **Multi-Mode Dashboard System**: Complete implementation of three distinct dashboard experiences
- ✅ **Dashboard Editor Interface**: Intuitive editor for agencies to configure client dashboard modes
- ✅ **Dynamic Client URLs**: Auto-generated unique, secure URLs for each client dashboard
- ✅ **Dashboard Mode**: Full analytics experience with KPI cards, performance charts, and activity feeds
- ✅ **Task Mode**: Focused task list interface with progress tracking and completion management
- ✅ **Hybrid Mode**: Combined dashboard and task management with collapsible sidebar
- ✅ **Public Dashboard Access**: Clients can access their personalized dashboards without authentication
- ✅ **Responsive Design**: All dashboard modes fully responsive for desktop, tablet, and mobile
- ✅ **Database Schema Extensions**: Added view_mode and dashboard_slug fields with automatic slug generation
- ✅ **Security Enhancements**: Proper RLS policies ensuring user data isolation while enabling public access
- ✅ **Real-time Data Integration**: Mock data with realistic interactions demonstrating full functionality
- ✅ **Next.js 15 Compatibility**: Updated dynamic routes to use proper async params handling
- ✅ **Security Fixes**: Resolved cross-user data leakage issues with enhanced RLS policies
- ✅ **Database Migrations**: Multiple migrations for schema updates, constraint fixes, and security patches

### v2.0.0 - Advanced Payment Management & Subscription Fixes
- ✅ **Saved Payment Methods**: Complete implementation of secure card storage using Stripe Setup Intents
- ✅ **One-Click Upgrades**: Intelligent upgrade flow that detects saved cards and enables instant upgrades
- ✅ **Enhanced Settings**: Comprehensive billing management with saved card display and deletion
- ✅ **Subscription Synchronization**: Fixed critical webhook issues causing subscription status mismatches
- ✅ **Manual Sync Tools**: Created utility scripts to recover missing subscription data
- ✅ **Session Preservation**: Resolved session logout issues during upgrade flows
- ✅ **Infinite Loop Fixes**: Fixed React useEffect dependency issues causing endless subscription refreshes
- ✅ **Real-time Updates**: Cross-component communication system for instant subscription status updates
- ✅ **Debug Enhancement**: Comprehensive logging system for troubleshooting subscription issues
- ✅ **Payment Method Management**: Full CRUD operations for saved payment methods
- ✅ **Fallback Handling**: Smart fallback to regular Stripe Checkout when no saved cards available
- ✅ **Webhook Recovery**: Automatic detection and fixing of missed webhook events
- ✅ **Development Tools**: Enhanced Stripe CLI integration and webhook forwarding setup

### v1.9.0 - User Settings & Email Management
- ✅ **Email Change Functionality**: Users can now update their email address directly from dashboard settings
- ✅ **Real-time Validation**: Implemented comprehensive email validation with user feedback
- ✅ **Auto-fill Agency URL**: Agency URL is automatically generated from agency name during signup
- ✅ **Enhanced UX**: Added success/error states with clear messaging for email updates
- ✅ **Secure Implementation**: Email changes require confirmation via Supabase Auth
- ✅ **Interactive UI**: Smooth toggle between view and edit modes for email field

### v1.8.0 - UI Simplification & Billing Toggle Removal
- ✅ **Simplified Pricing**: Removed monthly/annual billing toggle from upgrade and pricing pages
- ✅ **Streamlined UX**: Simplified pricing interface by removing billing period selection
- ✅ **Cleaner Design**: Reduced visual complexity on pricing and upgrade pages
- ✅ **Consistent Experience**: Unified pricing display across all pricing components

### v1.7.0 - Session Persistence & Upgrade Flow Fixes
- ✅ **Session Persistence**: Fixed critical session loss issue after Stripe payment redirects
- ✅ **Supabase Configuration**: Enhanced auth client with `autoRefreshToken`, `persistSession`, and `detectSessionInUrl` settings
- ✅ **Upgrade Success Flow**: Implemented robust session restoration logic with immediate and fallback mechanisms
- ✅ **Authentication Context**: Optimized auth context initialization with proper timing and mounted component handling
- ✅ **User Experience**: Users now stay logged in throughout the entire payment and upgrade process
- ✅ **Cross-Platform**: Fixed upgrade success flow for both localhost and Netlify deployments

### v1.6.0 - Netlify Deployment & Authentication Fixes
- ✅ **Netlify Redirect Fix**: Resolved post-payment redirect issue where users were sent to signin instead of dashboard
- ✅ **Authentication Handling**: Improved auth context initialization with proper retry logic for Netlify deployments
- ✅ **Return URL Support**: Added returnUrl parameter handling in signin page for seamless user experience
- ✅ **Upgrade Success Flow**: Enhanced upgrade success page to handle authentication delays and redirect appropriately
- ✅ **Error Handling**: Better error handling for authentication failures during payment completion
- ✅ **User Experience**: Added upgrade success messaging in signin page for clarity

### Environment & Deployment Fixes
- ✅ Fixed server-side environment variable handling for Supabase admin client
- ✅ Resolved Netlify secrets scanning issues by disabling scanner
- ✅ Upgraded to Node.js 20 for better compatibility
- ✅ Improved error handling for missing environment variables
- ✅ Enhanced client-server separation for secure API access

### Security Improvements
- Removed hardcoded secrets from codebase
- Implemented proper environment variable validation
- Server-side only access for sensitive operations

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
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

4. **Set up Stripe CLI for webhook testing (REQUIRED for subscription functionality):**
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Forward webhooks to your local server (CRITICAL for payment processing)
export STRIPE_API_KEY=$(grep STRIPE_SECRET_KEY .env.local | cut -d '=' -f2)
stripe listen --forward-to localhost:3001/api/stripe/webhook

# Copy the webhook signing secret from the CLI output and add it to .env.local
# Without this, subscription updates will not work properly!
```

**Important**: The Stripe CLI must be running during development for subscription updates to work. If you complete a payment but don't see your plan updated, check that the Stripe CLI is forwarding webhooks.

5. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

6. Open [http://localhost:3001](http://localhost:3001) in your browser.

### Using the Complete Dashboard Content Management System

After setting up the application, you can use the comprehensive Dashboard Content Editor with advanced inline editing:

1. **Create Clients**: Go to `/dashboard/clients` and add new clients
2. **Access Content Editor**: Click "Dashboard Editor" on any client to access the full content management interface
3. **Inline Editing Experience**:
   - **Click-to-Edit**: Click any text, color, or value directly in the preview to edit it
   - **Real-time Updates**: See changes immediately as you type or modify content
   - **Keyboard Controls**: Use Enter to save, Escape to cancel during editing
   - **Visual Feedback**: Hover states and editing indicators guide your interactions
   - **Full-Width Layout**: Maximum editing space with no sidebar distractions
4. **Multi-Mode Editing**:
   - **Dashboard Mode**: Edit KPIs, welcome messages, company descriptions, and theme colors inline
   - **Task Mode**: Edit task titles, categories, priorities, progress values, and statistics directly
   - **Hybrid Mode**: Edit both dashboard elements and tasks with compact inline controls
5. **Advanced Inline Features**:
   - **Color Pickers**: Click any color element to open advanced color editing tools
   - **Dynamic Sections**: Add/remove sections using buttons that appear on hover
   - **Priority Selectors**: Change task priorities with integrated dropdown controls
   - **Type Selectors**: Modify KPI types (percentage, number, currency, text) directly
   - **Progress Tracking**: Edit completion percentages and task counts inline
6. **Content Organization**:
   - **Add Elements**: Use "+" buttons to add new KPIs, tasks, or content sections
   - **Remove Elements**: "×" buttons appear on hover for easy content removal
   - **Toggle Sections**: Show/hide dashboard sections with integrated control buttons
7. **Template System**: Save configurations as reusable templates for quick client setup
8. **Database Management**: Apply migrations for new features:
   ```bash
   supabase db push
   ```

**Key Features**:
- **Universal Inline Editing**: Edit any content directly within the preview across all view modes
- **Click-to-Edit Interface**: Intuitive editing experience similar to modern tools like Notion or Figma
- **Advanced Color Pickers**: Visual color selection for themes and branding with hex code support
- **Dynamic Content Management**: Add/remove elements with hover-activated controls
- **Real-time Visual Feedback**: Immediate updates and hover states for enhanced user experience
- **Keyboard Accessibility**: Full keyboard navigation with Enter/Escape controls
- **Multi-mode Support**: Comprehensive editing across Dashboard, Task, and Hybrid modes
- **Full-Width Layout**: Maximum editing space with sidebar-free interface design
- **Responsive Design**: All inline editing features work seamlessly across desktop, tablet, and mobile

## Troubleshooting

### Subscription Status Issues

If you complete a payment but your plan doesn't update:

1. **Check Stripe CLI**: Ensure Stripe CLI is running and forwarding webhooks:
   ```bash
   stripe listen --forward-to localhost:3001/api/stripe/webhook
   ```

2. **Manual Sync**: Run the manual subscription sync script:
   ```bash
   node scripts/sync-missing-subscription.js
   ```

3. **Verify Webhook Secret**: Ensure `STRIPE_WEBHOOK_SECRET` in `.env.local` matches the CLI output

4. **Check Console Logs**: Look for debug logs like:
   ```
   🔍 Plan Detection Debug: {...}
   🔍 Subscription details: {...}
   ```

### Development Setup

- **Port**: Development server automatically uses port 3001 if 3000 is busy
- **Environment**: All environment variables must be properly configured
- **Database**: Ensure Supabase migrations are applied
- **Payments**: Test payments require Stripe CLI for webhook handling

## Project Structure

```
app/
├── about/              # About page
├── client-dashboard/   # Public client dashboard routes
│   └── [slug]/         # Dynamic client dashboard pages
├── dashboard/          # Protected dashboard area
│   ├── analytics/      # Analytics dashboard
│   ├── clients/        # Client management with dashboard editor
│   ├── messages/       # Message center
│   ├── settings/       # User settings
│   ├── tasks/          # Task management
│   ├── templates/      # Template management
│   └── upgrade/        # Plan upgrade page
├── pricing/            # Public pricing page
├── signin/             # Authentication pages
└── signup/

components/
├── ui/                           # Reusable UI components
├── add-client-dialog.tsx         # Add new client dialog
├── add-payment-method.tsx        # Add payment method component
├── client-dashboard.tsx          # Client dashboard router component
├── dashboard-editor.tsx          # Dashboard configuration editor (popup version)
├── dashboard-editor-inline.tsx   # Inline dashboard configuration editor
├── dashboard-content-editor.tsx  # Comprehensive dashboard content management system with universal inline editing
├── dashboard-advanced-editor.tsx # Advanced features: tasks, announcements, media
├── dashboard-mode.tsx            # Full analytics dashboard mode with custom config support
├── task-mode.tsx                 # Task-focused dashboard mode
├── hybrid-mode.tsx               # Combined dashboard and task mode
├── edit-client-dialog.tsx        # Edit client information dialog
├── feature-in-progress-dialog.tsx # Feature progress notification
├── pricing-plans.tsx             # Pricing plans component
├── saved-payment-methods.tsx     # Saved payment methods display
├── stripe-popup.tsx              # Enhanced Stripe payment popup
├── theme-toggle.tsx              # Dark/light theme toggle
├── upgrade-success-popup.tsx     # Upgrade success celebration
└── protected-route.tsx           # Route protection

lib/
├── auth-context.tsx       # Enhanced authentication context
├── supabase.ts           # Supabase client
├── stripe.ts             # Stripe integration utilities
├── subscription.ts       # Subscription management utilities
└── utils.ts              # Utility functions

scripts/
├── setup-stripe-products.js      # Stripe product setup
└── sync-missing-subscription.js  # Manual subscription sync utility
```

## Recent Updates

### v1.8.0 - Webhook Fix & Plan Display Resolution
- ✅ **Current Plan Display Fix**: Resolved incorrect "current plan" tag appearing on free plan
- ✅ **Stripe CLI Authentication**: Fixed Stripe CLI authentication and webhook forwarding
- ✅ **Real-time Webhook Processing**: Restored automatic subscription status updates from Stripe events
- ✅ **Database Synchronization**: Ensured proper sync between Stripe subscriptions and Supabase data
- ✅ **Development Workflow**: Streamlined local development setup with proper webhook testing

### v1.7.0 - Stripe Webhook Integration
- ✅ **Webhook Processing**: Complete Stripe webhook integration for subscription updates
- ✅ **Payment Flow**: End-to-end payment processing with Supabase data synchronization
- ✅ **CLI Setup**: Stripe CLI configuration for local development webhook testing
- ✅ **Environment Config**: Enhanced environment variable setup for webhook secrets
- ✅ **Real-time Updates**: Automatic subscription status updates after successful payments
- ✅ **Error Handling**: Comprehensive webhook error handling and logging

### v1.6.0 - Settings Optimization
- ✅ **Agency Settings**: Removed color customization options from agency information section
- ✅ **Phone Number Fix**: Fixed phone number display issue in agency settings
- ✅ **UI Simplification**: Streamlined settings interface for better user experience

### v1.5.0 - Dark Mode & Visual Enhancements
- ✅ **Dark Mode Support**: Complete dark mode implementation across all pages
- ✅ **Template Management**: Enhanced templates page with dark mode styling and skeleton loading
- ✅ **About Page Redesign**: Updated with professional Unsplash images and improved team section
- ✅ **Signup UX**: Added horizontal divider between Personal Info and Agency Info sections
- ✅ **Image Optimization**: Replaced placeholder images with high-quality professional photos
- ✅ **Consistent Theming**: Applied theme-aware colors and proper dark mode variants
- ✅ **Loading States**: Comprehensive skeleton UI for better user experience

### v1.4.0 - Privacy & User Experience Enhancements
- ✅ **User Privacy**: Implemented user-specific client filtering with `user_id` isolation
- ✅ **Database Security**: Updated RLS policies to ensure users only see their own clients
- ✅ **Real User Data**: Settings page now displays actual user information instead of demo data
- ✅ **Personalized Avatars**: User initials automatically generated from email for profile pictures
- ✅ **Enhanced Notifications**: Client-focused notification system with welcome messages
- ✅ **UI Improvements**: Larger notification bell and improved visual hierarchy
- ✅ **Data Migration**: Clean database migration to add user ownership to existing data

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
