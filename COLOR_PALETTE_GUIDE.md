# 🎨 Color Palette System Guide

## Overview

The Galaxy Template now supports a comprehensive color palette system that allows you to fully customize your application's theme. Instead of just a single primary color, you can now define a complete color scheme with up to 9 different color roles.

## Configuration

Edit your `src/config/galaxy.config.ts` file to customize your color palette:

```typescript
colorPalette: {
  primary: '#3B8287',      // Main brand color - buttons, links, key actions
  secondary: '#8B5CF6',    // Supporting color - secondary buttons, badges
  accent: '#F59E0B',       // Highlight color - notifications, alerts, CTAs
  background: '#FFFFFF',   // Main background color
  foreground: '#1F2937',   // Main text color
  muted: '#9CA3AF',        // Muted backgrounds and borders
  success: '#10B981',      // Success states
  warning: '#F59E0B',      // Warning states  
  error: '#EF4444',        // Error states
}
```

## Color Roles Explained

### Primary
- **Purpose**: Main brand color that represents your application
- **Usage**: Primary buttons, main navigation, key interactive elements
- **CSS Variable**: `--primary`, `--primary-foreground`
- **Classes**: `bg-primary`, `text-primary`, `border-primary`

### Secondary  
- **Purpose**: Supporting color for secondary actions
- **Usage**: Secondary buttons, alternative CTAs, complementary elements
- **CSS Variable**: `--secondary`, `--secondary-foreground`
- **Classes**: `bg-secondary`, `text-secondary`, `border-secondary`

### Accent
- **Purpose**: Eye-catching color for emphasis
- **Usage**: Badges, highlights, special promotions, tooltips
- **CSS Variable**: `--accent`, `--accent-foreground`
- **Classes**: `bg-accent`, `text-accent`, `border-accent`

### Background & Foreground
- **Purpose**: Base colors for content
- **Usage**: Page backgrounds and text
- **CSS Variables**: `--background`, `--foreground`
- **Classes**: `bg-background`, `text-foreground`

### Muted
- **Purpose**: Subdued elements
- **Usage**: Disabled states, borders, subtle backgrounds
- **CSS Variable**: `--muted`, `--muted-foreground`
- **Classes**: `bg-muted`, `text-muted-foreground`

### Status Colors (Success, Warning, Error)
- **Purpose**: Communicate system states
- **Usage**: Alert messages, form validation, status indicators
- **CSS Variable**: `--destructive` (for error)
- **Classes**: Available through Alert components

## Usage Examples

### Buttons
```tsx
<Button>Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="outline">Outline Style</Button>
<Button variant="ghost">Ghost Style</Button>
<Button variant="destructive">Danger Action</Button>
```

### Custom Components with Palette Colors
```tsx
// Using primary color with opacity
<div className="bg-primary/10 border-primary/20">
  Light primary background with border
</div>

// Gradient using palette colors
<div className="bg-gradient-to-r from-primary to-secondary">
  Gradient background
</div>

// Accent highlight
<span className="bg-accent/10 text-accent px-2 py-1 rounded">
  Special offer!
</span>
```

### Alerts with Theme Colors
```tsx
<Alert className="border-primary/20 bg-primary/5">
  <AlertDescription>Primary themed alert</AlertDescription>
</Alert>

<Alert className="border-accent/20 bg-accent/5">
  <AlertDescription>Accent themed alert</AlertDescription>
</Alert>
```

## Dynamic Color Application

The color palette is applied dynamically through the `ThemeProvider` component, which:
1. Reads your color palette from the galaxy config
2. Converts hex colors to OKLCH format for better color manipulation
3. Applies them as CSS custom properties
4. Automatically calculates foreground colors for contrast

## Best Practices

1. **Consistency**: Use the same color role for similar actions across your app
2. **Contrast**: Ensure sufficient contrast between background and foreground colors
3. **Hierarchy**: Use primary for main actions, secondary for supporting actions
4. **Accessibility**: Test your color choices for color-blind accessibility
5. **Brand Identity**: Choose colors that reflect your brand and create the right mood

## Fallback Support

The system maintains backward compatibility with the legacy `primaryColor` field. If you don't define a `colorPalette`, it will fall back to:
- Using `primaryColor` as the primary color
- Applying sensible defaults for other colors

## Testing Your Colors

Visit `/dashboard` after changing your colors to see:
- A visual preview of all your theme colors
- Examples of buttons using different variants
- Alert components with theme colors
- The hero section gradient using your primary and secondary colors

## Tips for Choosing Colors

1. **Primary**: Should be your main brand color
2. **Secondary**: Choose a complementary color that works well with primary
3. **Accent**: Pick something that stands out for special emphasis
4. **Muted**: Usually a gray that matches your design's tone
5. **Status colors**: Stick to conventional colors (green=success, yellow=warning, red=error)

## Examples of Good Color Palettes

### Professional Blue
```typescript
colorPalette: {
  primary: '#2563EB',     // Blue
  secondary: '#7C3AED',   // Purple
  accent: '#F59E0B',      // Amber
  // ... rest
}
```

### Modern Teal
```typescript
colorPalette: {
  primary: '#14B8A6',     // Teal
  secondary: '#8B5CF6',   // Purple  
  accent: '#F97316',      // Orange
  // ... rest
}
```

### Bold & Vibrant
```typescript
colorPalette: {
  primary: '#DC2626',     // Red
  secondary: '#2563EB',   // Blue
  accent: '#FBBF24',      // Yellow
  // ... rest
}
```

## Troubleshooting

If colors aren't updating:
1. Make sure you've saved your config file
2. Refresh the page (colors are applied on page load)
3. Check the browser console for any errors
4. Verify your hex color codes are valid (6 characters, with or without #)

## 📚 Related Documentation

- [Galaxy Architecture Guide](./GALAXY_ARCHITECTURE_GUIDE.md) - Comprehensive guide on building Core vs Feature apps
- [Galaxy Configuration Guide](./GALAXY_CONFIGURATION.md) - Detailed configuration options
- [README](./README.md) - Project overview and quick start

---

Now you have complete control over your application's color scheme! 🎨
