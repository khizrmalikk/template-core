/**
 * Utility functions for galaxy system behavior based on app type
 */

import { galaxyConfig } from '@/config/galaxy.config';

/**
 * Check if this is a core galaxy app
 */
export const isCore = () => galaxyConfig.type === 'core';

/**
 * Check if this is a feature/planet app
 */
export const isFeature = () => galaxyConfig.type === 'feature';

/**
 * Get the features to promote in navigation
 * - Core apps: promote selected features
 * - Feature apps: promote core + sibling features
 */
export const getPromotedLinks = () => {
  if (isCore()) {
    // Core promotes its selected features
    return galaxyConfig.related?.filter(
      f => galaxyConfig.promoteFeatures?.includes(f.id)
    ) || [];
  } else {
    // Features promote core first, then other features
    const links = [];
    
    // Add core link if configured
    if (galaxyConfig.promoteCore && galaxyConfig.coreAppUrl) {
      links.push({
        id: 'galaxy-core',
        name: 'Galaxy Dashboard',
        url: galaxyConfig.coreAppUrl,
        isCore: true
      });
    }
    
    // Add sibling features
    if (galaxyConfig.related) {
      links.push(...galaxyConfig.related.map(f => ({ ...f, isCore: false })));
    }
    
    return links;
  }
};

/**
 * Get the dashboard content configuration based on app type
 */
export const getDashboardConfig = () => {
  if (isCore()) {
    return {
      title: 'Galaxy Dashboard',
      subtitle: 'Manage all your features from one place',
      showFeatureGrid: true,
      showActivityStats: true,
      showQuickActions: true,
      showCorePromotion: false
    };
  } else {
    return {
      title: `${galaxyConfig.name} Dashboard`,
      subtitle: galaxyConfig.tagline,
      showFeatureGrid: false, // Feature apps don't show grid
      showActivityStats: true,
      showQuickActions: true,
      showCorePromotion: galaxyConfig.promoteCore // Show link back to core
    };
  }
};

/**
 * Get sidebar navigation items based on app type
 */
export const getSidebarNavigation = () => {
  const baseNav = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: 'LayoutDashboard',
    },
  ];

  if (isFeature()) {
    // Feature apps have feature-specific navigation
    baseNav.push(
      {
        title: 'Feature Settings',
        href: '/dashboard/settings',
        icon: 'Settings',
      },
      {
        title: 'API Docs',
        href: '/dashboard/api',
        icon: 'Code',
      }
    );
  } else {
    // Core apps have management navigation
    baseNav.push(
      {
        title: 'Features',
        href: '/dashboard/features',
        icon: 'Globe',
      },
      {
        title: 'Analytics',
        href: '/dashboard/analytics',
        icon: 'BarChart',
      },
      {
        title: 'Settings',
        href: '/dashboard/settings',
        icon: 'Settings',
      }
    );
  }

  return baseNav;
};

/**
 * Get API configuration for the current app
 */
export const getAPIConfig = () => {
  return {
    hasAPI: !!galaxyConfig.apiEndpoint,
    endpoint: galaxyConfig.apiEndpoint,
    isCore: isCore(),
    canCallFeatures: isCore() && galaxyConfig.related?.some(f => f.apiEndpoint)
  };
};

/**
 * Get branding configuration
 */
export const getBranding = () => {
  // Use color palette if available, fall back to legacy primaryColor
  const colorPalette = galaxyConfig.colorPalette || {
    primary: galaxyConfig.primaryColor || '#3B82F6',
    secondary: '#6B7280',
    accent: '#F59E0B',
    background: '#FFFFFF',
    foreground: '#1F2937',
    muted: '#9CA3AF',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  };
  
  return {
    name: galaxyConfig.name,
    shortName: galaxyConfig.name.split(' - ')[0] || galaxyConfig.name.split(' ')[0],
    tagline: galaxyConfig.tagline,
    description: galaxyConfig.description,
    primaryColor: galaxyConfig.primaryColor || '#3B82F6', // Legacy support
    colorPalette,
    type: galaxyConfig.type,
    // Feature apps might have different branding needs
    showGalaxyBadge: isFeature() && galaxyConfig.promoteCore
  };
};

/**
 * Get feature-specific API endpoints
 */
export const getFeatureEndpoints = () => {
  if (isCore()) {
    // Core can call all feature APIs
    return galaxyConfig.related?.filter(f => f.apiEndpoint) || [];
  } else {
    // Features can call sibling features
    return galaxyConfig.related?.filter(f => f.apiEndpoint && f.id !== galaxyConfig.id) || [];
  }
};