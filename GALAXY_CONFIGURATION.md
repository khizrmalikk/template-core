# 🌌 Galaxy Configuration Guide

This template adapts its behavior based on the `type` field in `galaxy.config.ts`. Here's how to configure it for different use cases.

## 🎯 Core App Configuration

Use this configuration when building the main hub of your galaxy system:

```typescript
// src/config/galaxy.config.ts
export const galaxyConfig: GalaxyConfig = {
  id: 'my-galaxy-core',
  type: 'core',  // ← IMPORTANT: Set to 'core' for the main hub
  name: 'My Galaxy Dashboard',
  tagline: 'Central hub for all your tools',
  description: 'Manage and orchestrate all your features from one place',
  coreAppUrl: 'https://my-galaxy.com',
  primaryColor: '#3B82F6',
  
  // Features to promote in the sidebar
  promoteFeatures: ['feature-1', 'feature-2'],
  
  // All connected features in your galaxy
  related: [
    {
      id: 'feature-1',
      name: 'Feature One',
      url: 'https://feature-one.com',
      apiEndpoint: 'https://feature-one.com/api/process'
    },
    {
      id: 'feature-2',
      name: 'Feature Two',
      url: 'https://feature-two.com',
      apiEndpoint: 'https://feature-two.com/api/generate'
    }
  ]
};
```

### Core App Behavior:
- ✅ **Dashboard**: Shows grid of all galaxy features
- ✅ **Sidebar**: Lists and promotes selected features
- ✅ **API**: Can orchestrate calls to all feature APIs
- ✅ **Stats**: Shows galaxy-wide metrics
- ✅ **Navigation**: Features management, analytics, settings

## 🚀 Feature App Configuration

Use this configuration when building individual feature/planet apps:

```typescript
// src/config/galaxy.config.ts
export const galaxyConfig: GalaxyConfig = {
  id: 'my-feature',
  type: 'feature',  // ← IMPORTANT: Set to 'feature' for planet apps
  name: 'My Awesome Feature',
  tagline: 'Specialized tool for specific tasks',
  description: 'This feature does something amazing',
  
  // Link back to the core galaxy
  coreAppUrl: 'https://my-galaxy.com',
  promoteCore: true,  // Shows "Back to Galaxy" button
  
  // This feature's API endpoint
  apiEndpoint: 'https://my-feature.com/api/feature',
  
  primaryColor: '#10B981',  // Different color for each feature
  
  // Sibling features this can integrate with
  related: [
    {
      id: 'sibling-feature',
      name: 'Sibling Feature',
      url: 'https://sibling.com',
      apiEndpoint: 'https://sibling.com/api/process'
    }
  ]
};
```

### Feature App Behavior:
- ✅ **Dashboard**: Shows feature-specific UI and tools
- ✅ **Sidebar**: "Back to Galaxy" link + feature navigation
- ✅ **API**: Exposes own API, can call sibling features
- ✅ **Stats**: Shows feature-specific metrics
- ✅ **Navigation**: Feature settings, API docs

## 🔄 Switching Between Types

To convert an app from core to feature (or vice versa):

1. **Change the `type` field** in `galaxy.config.ts`
2. **Update the configuration** based on the examples above
3. **No code changes needed** - the app automatically adapts!

## 🎨 UI Adaptations

### Dashboard Changes

| Component | Core App | Feature App |
|-----------|----------|-------------|
| Hero Title | "Galaxy Dashboard" | "[Feature Name] Dashboard" |
| Feature Grid | ✅ Shows all features | ❌ Hidden |
| Back to Core | ❌ Not shown | ✅ Prominent button |
| Quick Actions | Add Feature, Analytics, Users | Create New, API Settings, Usage |
| Stats Cards | Connected Features, API Integrations | API Calls, Response Time, Success Rate |

### Sidebar Changes

| Section | Core App | Feature App |
|---------|----------|-------------|
| Badge | "Galaxy Core" | "Feature App" |
| Back Button | ❌ Not shown | ✅ "Back to Galaxy" |
| Navigation | Features, Analytics, Settings | Dashboard, Feature Settings, API Docs |
| Feature List | All galaxy features | Related/sibling features |
| API Status | ❌ Not shown | ✅ Shows API endpoint status |

## 🔌 API Integration Patterns

### Core App (Orchestrator)
```typescript
// Can orchestrate multiple features
const result = await orchestrateFeatures(
  ['feature-1', 'feature-2'],
  { data: 'payload' }
);
```

### Feature App (Service Provider)
```typescript
// Exposes API at /api/feature
// Can call sibling features
const result = await callSiblingFeature(
  'sibling-id',
  { data: 'payload' }
);
```

## 📝 Environment Variables

Both types use the same environment variables:

```bash
# Required for both
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Core apps might need
NEXT_PUBLIC_APP_NAME="Galaxy Dashboard"

# Feature apps might need
NEXT_PUBLIC_CORE_URL="https://galaxy.com"
FEATURE_API_KEY="your-api-key"
```

## 🚢 Deployment Tips

### Core App
- Deploy to main domain (e.g., `galaxy.com`)
- Ensure it can reach all feature APIs
- Set up monitoring for all features

### Feature Apps
- Deploy to subdomains or separate domains
- Each feature is independently scalable
- Can be deployed without touching core

## 🔧 Testing Your Configuration

1. **Check the dashboard** - Does it show the right content?
2. **Test the sidebar** - Are the navigation items correct?
3. **Try the API tester** - Can you call features/siblings?
4. **Verify branding** - Is the app name and color correct?

## 💡 Best Practices

1. **Keep configurations consistent** across your galaxy
2. **Use environment variables** for sensitive data
3. **Version your configurations** when making changes
4. **Test API endpoints** before adding to config
5. **Document each feature's purpose** in the description

---

Remember: One template, infinite possibilities! 🌟