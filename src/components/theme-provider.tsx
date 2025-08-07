'use client';

import { useEffect } from 'react';
import { getBranding } from '@/lib/galaxy-utils';

// Convert hex to RGB
function hexToRGB(hex: string) {
  // Remove the hash if present
  hex = hex.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return { r, g, b };
}

// Check if a color is light or dark based on luminance
function isLightColor(hex: string): boolean {
  const { r, g, b } = hexToRGB(hex);
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

// Convert hex to HSL for better color manipulation
function hexToHSL(hex: string) {
  const { r, g, b } = hexToRGB(hex);
  
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0, s = 0, l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case rNorm: h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6; break;
      case gNorm: h = ((bNorm - rNorm) / d + 2) / 6; break;
      case bNorm: h = ((rNorm - gNorm) / d + 4) / 6; break;
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const branding = getBranding();
    const palette = branding.colorPalette;
    
    if (palette) {
      const root = document.documentElement;
      
      // Apply colors as CSS custom properties
      // We'll use both the hex values directly and HSL for manipulation
      
      // Primary color
      if (palette.primary) {
        const primaryHSL = hexToHSL(palette.primary);
        const { r, g, b } = hexToRGB(palette.primary);
        
        // Apply as RGB for exact color matching
        root.style.setProperty('--primary', `${r} ${g} ${b}`);
        root.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
        root.style.setProperty('--primary-hex', palette.primary);
        
        // For hover states (slightly darker)
        const hoverL = Math.max(0, primaryHSL.l - 10);
        root.style.setProperty('--primary-hover', `hsl(${primaryHSL.h}, ${primaryHSL.s}%, ${hoverL}%)`);
        
        // Set foreground based on primary lightness
        const primaryForeground = isLightColor(palette.primary) ? '30 30 30' : '250 250 250';
        root.style.setProperty('--primary-foreground', primaryForeground);
        
        // Ring color
        root.style.setProperty('--ring', `${r} ${g} ${b}`);
      }
      
      // Secondary color
      if (palette.secondary) {
        const { r, g, b } = hexToRGB(palette.secondary);
        root.style.setProperty('--secondary', `${r} ${g} ${b}`);
        root.style.setProperty('--secondary-rgb', `${r}, ${g}, ${b}`);
        root.style.setProperty('--secondary-hex', palette.secondary);
        
        const secondaryForeground = isLightColor(palette.secondary) ? '30 30 30' : '250 250 250';
        root.style.setProperty('--secondary-foreground', secondaryForeground);
      }
      
      // Accent color
      if (palette.accent) {
        const { r, g, b } = hexToRGB(palette.accent);
        root.style.setProperty('--accent', `${r} ${g} ${b}`);
        root.style.setProperty('--accent-rgb', `${r}, ${g}, ${b}`);
        root.style.setProperty('--accent-hex', palette.accent);
        
        const accentForeground = isLightColor(palette.accent) ? '30 30 30' : '250 250 250';
        root.style.setProperty('--accent-foreground', accentForeground);
      }
      
      // Background color
      if (palette.background) {
        const { r, g, b } = hexToRGB(palette.background);
        root.style.setProperty('--background', `${r} ${g} ${b}`);
        root.style.setProperty('--background-rgb', `${r}, ${g}, ${b}`);
        root.style.setProperty('--background-hex', palette.background);
        
        // Also set card and popover to match background
        root.style.setProperty('--card', `${r} ${g} ${b}`);
        root.style.setProperty('--popover', `${r} ${g} ${b}`);
      }
      
      // Foreground (text) color
      if (palette.foreground) {
        const { r, g, b } = hexToRGB(palette.foreground);
        root.style.setProperty('--foreground', `${r} ${g} ${b}`);
        root.style.setProperty('--foreground-rgb', `${r}, ${g}, ${b}`);
        root.style.setProperty('--foreground-hex', palette.foreground);
        
        // Also set card and popover foreground to match
        root.style.setProperty('--card-foreground', `${r} ${g} ${b}`);
        root.style.setProperty('--popover-foreground', `${r} ${g} ${b}`);
      }
      
      // Muted color
      if (palette.muted) {
        const { r, g, b } = hexToRGB(palette.muted);
        const mutedHSL = hexToHSL(palette.muted);
        
        root.style.setProperty('--muted', `${r} ${g} ${b}`);
        root.style.setProperty('--muted-rgb', `${r}, ${g}, ${b}`);
        root.style.setProperty('--muted-hex', palette.muted);
        
        // Muted foreground (darker version of muted)
        const mutedFgL = Math.max(0, mutedHSL.l - 30);
        root.style.setProperty('--muted-foreground', `hsl(${mutedHSL.h}, ${mutedHSL.s}%, ${mutedFgL}%)`);
        
        // Border and input (lighter version of muted)
        const borderL = Math.min(100, mutedHSL.l + 10);
        root.style.setProperty('--border', `hsl(${mutedHSL.h}, ${mutedHSL.s / 2}%, ${borderL}%)`);
        root.style.setProperty('--input', `hsl(${mutedHSL.h}, ${mutedHSL.s / 2}%, ${borderL}%)`);
      }
      
      // Error/Destructive color
      if (palette.error) {
        const { r, g, b } = hexToRGB(palette.error);
        root.style.setProperty('--destructive', `${r} ${g} ${b}`);
        root.style.setProperty('--destructive-rgb', `${r}, ${g}, ${b}`);
        root.style.setProperty('--destructive-hex', palette.error);
        root.style.setProperty('--destructive-foreground', '250 250 250');
      }
      
      // Success color (for future use)
      if (palette.success) {
        const { r, g, b } = hexToRGB(palette.success);
        root.style.setProperty('--success', `${r} ${g} ${b}`);
        root.style.setProperty('--success-rgb', `${r}, ${g}, ${b}`);
        root.style.setProperty('--success-hex', palette.success);
      }
      
      // Warning color (for future use)
      if (palette.warning) {
        const { r, g, b } = hexToRGB(palette.warning);
        root.style.setProperty('--warning', `${r} ${g} ${b}`);
        root.style.setProperty('--warning-rgb', `${r}, ${g}, ${b}`);
        root.style.setProperty('--warning-hex', palette.warning);
      }
      
      // Chart colors based on palette
      if (palette.primary && palette.secondary && palette.accent) {
        const primaryRGB = hexToRGB(palette.primary);
        const secondaryRGB = hexToRGB(palette.secondary);
        const accentRGB = hexToRGB(palette.accent);
        
        root.style.setProperty('--chart-1', `${primaryRGB.r} ${primaryRGB.g} ${primaryRGB.b}`);
        root.style.setProperty('--chart-2', `${secondaryRGB.r} ${secondaryRGB.g} ${secondaryRGB.b}`);
        root.style.setProperty('--chart-3', `${accentRGB.r} ${accentRGB.g} ${accentRGB.b}`);
        
        if (palette.success) {
          const successRGB = hexToRGB(palette.success);
          root.style.setProperty('--chart-4', `${successRGB.r} ${successRGB.g} ${successRGB.b}`);
        }
        
        if (palette.warning) {
          const warningRGB = hexToRGB(palette.warning);
          root.style.setProperty('--chart-5', `${warningRGB.r} ${warningRGB.g} ${warningRGB.b}`);
        }
      }
      
      // Add a class to indicate custom theme is loaded
      root.classList.add('custom-theme-loaded');
    }
  }, []);
  
  return <>{children}</>;
}