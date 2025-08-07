# 🌌 Template Core - Galaxy System Foundation

> A reusable Next.js SaaS template that serves as the **core** of your galaxy system - a network of interconnected micro-products that work together seamlessly.

## 🚀 Overview

Template Core is the foundation for building a "galaxy system" of interconnected micro-products:

- **Core App (Galaxy Center)**: The main application with primary features
- **Feature Apps (Planets)**: Standalone micro-products that integrate via API
- **Dynamic Promotion**: Automatically promote and link between features
- **Unified Dashboard**: Central hub for all user activity
- **Composable Architecture**: Each app can work independently or together

## 🎯 Philosophy

Instead of building monolithic applications, the galaxy system promotes:

1. **Modularity**: Each feature is a separate, deployable product
2. **Interconnectivity**: Features communicate via APIs
3. **Flexibility**: Launch features independently or as a suite
4. **Scalability**: Add new "planets" to your galaxy without touching the core
5. **Marketing Synergy**: Cross-promote features automatically

## 🏗️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS v3 with CSS Variables
- **UI Components**: ShadCN UI
- **Authentication**: Clerk
- **Analytics**: PostHog (optional)
- **Icons**: Lucide React
- **Theming**: Dynamic color system with ThemeProvider

## 📁 Project Structure

```
template-core/
├── src/
│   ├── app/
│   │   ├── dashboard/           # Protected dashboard routes
│   │   │   ├── layout.tsx       # Dashboard layout with sidebar
│   │   │   └── page.tsx         # Main dashboard view
│   │   └── layout.tsx           # Global layout with Clerk
│   ├── components/
│   │   ├── ui/                  # ShadCN UI components
│   │   ├── sidebar.tsx          # Navigation sidebar
│   │   └── theme-provider.tsx   # Dynamic theme system
│   ├── config/
│   │   └── galaxy.config.ts     # Core configuration file
│   ├── lib/
│   │   ├── fetchers.ts          # API helper functions
│   │   ├── galaxy-utils.ts      # Galaxy configuration utilities
│   │   └── utils.ts             # Utility functions
│   └── middleware.ts            # Clerk auth middleware
├── public/                      # Static assets
├── env.template                 # Environment variables template
├── COLOR_PALETTE_GUIDE.md       # Theme system documentation
├── package.json
├── tsconfig.json
└── README.md
```

## 📋 Requirements

- Node.js 18.18.0 or higher (v20+ recommended)
- npm or yarn package manager
- Git

## 🔧 Setup Instructions

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd template-core

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy the environment template
cp env.template .env.local

# Edit .env.local with your values
```

Required environment variables:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
- `CLERK_SECRET_KEY`: Your Clerk secret key

### 3. Configure Your Galaxy

Edit `src/config/galaxy.config.ts` to customize your app:

```typescript
export const galaxyConfig: GalaxyConfig = {
  id: 'your-app-id',
  type: 'core',
  name: 'Your App Name',
  tagline: 'Your compelling tagline',
  description: 'Detailed description',
  coreAppUrl: 'https://your-app.com',
  colorPalette: {
    primary: '#3B8247',      // Main brand color
    secondary: '#82673B',    // Supporting actions
    accent: '#F59E0B',       // Highlights and CTAs
    background: '#353f50',   // Page background
    foreground: '#fffdee',   // Text color
    muted: '#9CA3AF',        // Muted elements
    success: '#10B981',      // Success states
    warning: '#F59E0B',      // Warning states
    error: '#EF4444',        // Error states
  },
  promoteFeatures: ['feature-1', 'feature-2'],
  related: [
    {
      id: 'feature-1',
      name: 'Feature Name',
      url: 'https://feature.com',
      apiEndpoint: 'https://feature.com/api/endpoint'
    }
  ]
};
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app.

## 🌟 Key Features

### 🔐 Authentication
- Clerk integration out of the box
- Protected dashboard routes
- User management via `UserButton` component

### 🎨 Advanced Theme System
- Full color palette support with 9 customizable colors
- Dynamic CSS variable injection via ThemeProvider
- Automatic contrast calculation for text on colored backgrounds
- All colors loaded from `galaxy.config.ts`
- Consistent theming across the entire application
- Theme-aware UI components (buttons, cards, alerts)
- Easy to rebrand for different projects
- See `COLOR_PALETTE_GUIDE.md` for detailed documentation

### 🔗 Feature Integration
- Call external APIs using `callFeatureAPI()`
- Batch API calls with `batchCallFeatureAPIs()`
- Health checks for external services

### 📊 Dashboard
- Beautiful, modern UI with gradients
- Feature cards with quick actions
- Activity tracking placeholders
- Responsive design

### 🧭 Smart Navigation
- Sidebar with promoted features
- External links to planet apps
- Clean, organized navigation structure

## 🎨 Theme System

### How It Works

The template includes a powerful theme system that dynamically applies your brand colors throughout the application:

1. **Color Configuration**: Define your color palette in `galaxy.config.ts`
2. **ThemeProvider**: Automatically converts and applies colors as CSS variables
3. **Tailwind Integration**: Use theme colors with Tailwind classes like `bg-primary`, `text-secondary`
4. **Smart Contrast**: Automatically calculates readable text colors for backgrounds

### Using Theme Colors

```jsx
// In your components
<div className="bg-primary text-primary-foreground">
  Primary colored section with readable text
</div>

<button className="bg-accent hover:bg-accent/90">
  Accent button
</button>

<div className="bg-background text-foreground">
  Main content area
</div>
```

### Available Color Classes

- `primary` / `primary-foreground` - Main brand color
- `secondary` / `secondary-foreground` - Supporting elements
- `accent` / `accent-foreground` - CTAs and highlights
- `background` / `foreground` - Page and text colors
- `muted` / `muted-foreground` - Subtle elements
- `card` / `card-foreground` - Card backgrounds
- `destructive` / `destructive-foreground` - Error states

### Customizing Colors

Simply update the `colorPalette` in `galaxy.config.ts` and the entire app will reflect your new colors instantly:

```typescript
colorPalette: {
  primary: '#YourColor',     // Your main brand color
  secondary: '#YourColor',   // Supporting color
  accent: '#YourColor',      // Highlight color
  background: '#YourColor',  // Page background
  foreground: '#YourColor',  // Text color
  // ... more colors
}
```

## 🛠️ API Integration

### Calling Feature APIs

```typescript
import { callFeatureAPI, callGalaxyFeature } from '@/lib/fetchers';

// Direct API call
const result = await callFeatureAPI(
  'https://api.feature.com/endpoint',
  { data: 'payload' }
);

// Call via galaxy config
const result = await callGalaxyFeature('cv-gen', {
  jobTitle: 'Software Engineer',
  experience: '5 years'
});
```

### Batch Operations

```typescript
import { batchCallFeatureAPIs } from '@/lib/fetchers';

const results = await batchCallFeatureAPIs([
  {
    endpoint: 'https://api1.com/endpoint',
    payload: { data: 'payload1' }
  },
  {
    endpoint: 'https://api2.com/endpoint',
    payload: { data: 'payload2' }
  }
]);
```

## 🌌 Building Your Galaxy

### Creating a New Planet (Feature App)

1. Clone this template for your feature app
2. Update `galaxy.config.ts` with `type: 'feature'`
3. Add reference to the core app
4. Deploy independently
5. Add to core's `related` features

### Adding Features to Core

1. Edit `galaxy.config.ts`
2. Add to `related` array
3. Add to `promoteFeatures` if it should be highlighted
4. The UI will automatically update

## 📝 Configuration Types

```typescript
export interface GalaxyConfig {
  id: string;                  // Unique identifier
  type: GalaxyType;            // 'core' or 'feature'
  name: string;                // Display name
  tagline: string;             // Short description
  description?: string;        // Long description
  coreAppUrl?: string;         // Link to core app
  apiEndpoint?: string;        // API endpoint for this app
  primaryColor?: string;       // Legacy: single brand color
  colorPalette?: ColorPalette; // New: full theme colors
  promoteCore?: boolean;       // Should features promote core?
  promoteFeatures?: string[];  // Features to highlight
  related?: RelatedFeature[];  // Connected features
}

export interface ColorPalette {
  primary: string;             // Main brand color
  secondary: string;           // Supporting actions
  accent: string;              // Highlights and CTAs
  background: string;          // Page backgrounds
  foreground: string;          // Main text color
  muted: string;               // Muted text/elements
  success: string;             // Success states
  warning: string;             // Warning states
  error: string;               // Error states
}
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app is a standard Next.js application and can be deployed to:
- Netlify
- AWS Amplify
- Railway
- Self-hosted servers

## 🔄 Updates and Maintenance

### Adding New Components

```bash
# Add new ShadCN components
npx shadcn@latest add [component-name]
```

### Updating Dependencies

```bash
# Update all dependencies
npm update

# Update specific package
npm install package@latest
```

## 📝 Recent Updates

### v1.1.0 - Theme System Enhancement
- ✨ **New Color Palette System**: Replaced single `primaryColor` with full `colorPalette` supporting 9 customizable colors
- 🎨 **ThemeProvider Component**: Dynamic CSS variable injection for real-time theme updates
- 🔧 **Tailwind v3 Migration**: Migrated from Tailwind v4 alpha to stable v3 for better compatibility
- 📚 **Theme Documentation**: Added comprehensive COLOR_PALETTE_GUIDE.md
- 🎯 **Smart Contrast**: Automatic foreground color calculation for optimal readability
- 🚀 **Performance**: Optimized theme application with useEffect hooks

### v1.0.0 - Initial Release
- 🏗️ Next.js 15 with App Router
- 🔐 Clerk authentication integration
- 🌌 Galaxy system architecture
- 📊 Beautiful dashboard UI
- 🔗 Feature API integration system

## 🤝 Contributing

This is a template repository. Feel free to:
- Fork and customize for your needs
- Submit issues for bugs
- Suggest improvements
- Share your galaxy systems!

## 📄 License

MIT - Use this template for any project, commercial or personal.

## 🌟 Example Galaxy Systems

### Job Application Suite (GYST)
- **Core**: Application tracker and automation
- **Planets**: CV Generator, Cover Letter AI, Interview Prep

### Content Creation Suite
- **Core**: Content calendar and planning
- **Planets**: AI Writer, Image Generator, SEO Analyzer

### E-commerce Suite
- **Core**: Store management dashboard
- **Planets**: Inventory Manager, Email Marketing, Analytics

---

Built with ❤️ for the galaxy system architecture. Create your own universe of interconnected products!