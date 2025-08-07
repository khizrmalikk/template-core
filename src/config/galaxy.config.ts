export type GalaxyType = 'core' | 'feature';

export interface RelatedFeature {
  id: string;
  name: string;
  url: string;
  apiEndpoint?: string; // Optional for core to call feature
}

export interface ColorPalette {
  primary: string;      // Main brand color - buttons, links, key actions
  secondary?: string;   // Supporting color - secondary buttons, badges
  accent?: string;      // Highlight color - notifications, alerts, emphasis
  background?: string;  // Main background color
  foreground?: string;  // Main text color
  muted?: string;       // Muted backgrounds and borders
  success?: string;     // Success states
  warning?: string;     // Warning states
  error?: string;       // Error states
}

export interface GalaxyConfig {
  id: string;                  // 'gyst', 'cv-gen', etc.
  type: GalaxyType;
  name: string;
  tagline: string;
  description?: string;
  coreAppUrl?: string;         // For features to link to core
  apiEndpoint?: string;        // For core to call (e.g. /api/generate)
  primaryColor?: string;        // Legacy - for backward compatibility
  colorPalette?: ColorPalette;  // New comprehensive color system
  promoteCore?: boolean;       // For features: always promote the core?
  promoteFeatures?: string[];  // Array of IDs to highlight
  related?: RelatedFeature[];  // Details for rendering links/CTAs
}

// Example configuration - customize this for your specific galaxy
export const galaxyConfig: GalaxyConfig = {
  id: 'galaxy-template',
  type: 'feature',
  name: 'Galaxy Template',
  tagline: 'One galaxy, one template',
  description: 'In a universe of templates, one galaxy is the best.',
  coreAppUrl: 'https://galaxy-template.com',
  
  // Color palette - customize these to match your brand
  colorPalette: {
    primary: '#d83f30',      // Teal - main brand color
    secondary: '#d9d4d0',    // Purple - supporting actions
    accent: '#F59E0B',       // Amber - highlights and CTAs
    background: '#353f50',   // White background
    foreground: '#fffdee',   // Dark gray text
    muted: '#9CA3AF',        // Gray for muted elements
    success: '#10B981',      // Green for success
    warning: '#F59E0B',      // Orange for warnings
    error: '#EF4444',        // Red for errors
  },
  
  promoteFeatures: ['cv-gen', 'cover-letter'],
  related: [
    {
      id: 'cv-gen',
      name: 'CV Generator',
      url: 'https://cvgen.ai',
      apiEndpoint: 'https://cvgen.ai/api/generate'
    },
    {
      id: 'cover-letter',
      name: 'Cover Letter AI',
      url: 'https://coverletter.app',
      apiEndpoint: 'https://coverletter.app/api/generate'
    }
  ]
};