'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { galaxyConfig } from '@/config/galaxy.config';
import { getSidebarNavigation, isCore, isFeature, getPromotedLinks, getBranding } from '@/lib/galaxy-utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserButton } from '@clerk/nextjs';
import { 
  Home, 
  LayoutDashboard, 
  Settings, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Globe,
  Zap,
  Code,
  BarChart,
  ArrowLeft
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

// Icon mapping for dynamic icons
const IconMap = {
  LayoutDashboard,
  Home,
  Settings,
  Globe,
  Code,
  BarChart,
};

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const navItems = getSidebarNavigation();
  const promotedLinks = getPromotedLinks();
  const branding = getBranding();

  return (
    <div className={cn('flex h-full w-64 flex-col border-r bg-card/50', className)}>
      {/* Brand Header */}
      <div className="border-b p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            isCore() 
              ? "bg-gradient-to-br from-primary to-secondary"
              : "bg-gradient-to-br from-primary to-accent"
          )}>
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{branding.shortName}</h2>
            <p className="text-xs text-muted-foreground">
              {isCore() ? 'Galaxy Core' : 'Feature App'}
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-6">
          {/* Feature App: Back to Galaxy Core */}
          {isFeature() && galaxyConfig.promoteCore && galaxyConfig.coreAppUrl && (
            <div className="mb-4">
              <Button
                asChild
                variant="outline"
                className="w-full justify-start bg-primary/10 hover:bg-primary/20 border-primary/30"
              >
                <a 
                  href={galaxyConfig.coreAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Galaxy
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </a>
              </Button>
            </div>
          )}

          {/* Main Navigation */}
          <div>
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
              {isCore() ? 'Core Navigation' : 'Feature Navigation'}
            </h3>
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = IconMap[item.icon as keyof typeof IconMap] || LayoutDashboard;
                return (
                  <Button
                    key={item.href}
                    asChild
                    variant={pathname === item.href ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                  >
                    <Link href={item.href}>
                      <Icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Core App: Promoted Galaxy Features */}
          {isCore() && promotedLinks.length > 0 && (
            <div>
              <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
                Featured Planets
              </h3>
              <div className="space-y-1">
                {promotedLinks.map((feature) => (
                  <Button
                    key={feature.id}
                    asChild
                    variant="ghost"
                    className="w-full justify-between"
                  >
                    <a 
                      href={feature.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <div className="flex items-center">
                        <Zap className="mr-2 h-4 w-4 text-yellow-600" />
                        {feature.name}
                      </div>
                      <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Feature App: Sibling Features */}
          {isFeature() && galaxyConfig.related && galaxyConfig.related.length > 0 && (
            <div>
              <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
                Related Features
              </h3>
              <div className="space-y-1">
                {galaxyConfig.related.map((feature) => (
                  <Button
                    key={feature.id}
                    asChild
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between text-sm"
                  >
                    <a 
                      href={feature.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <div className="flex items-center">
                        <Globe className="mr-2 h-3 w-3" />
                        {feature.name}
                      </div>
                      <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Core App: All Connected Features */}
          {isCore() && galaxyConfig.related && galaxyConfig.related.length > 0 && (
            <div>
              <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
                All Features
              </h3>
              <div className="space-y-1">
                {galaxyConfig.related.map((feature) => {
                  const isPromoted = galaxyConfig.promoteFeatures?.includes(feature.id);
                  return (
                    <Button
                      key={feature.id}
                      asChild
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-between text-sm",
                        isPromoted && "font-medium"
                      )}
                    >
                      <a 
                        href={feature.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group"
                      >
                        <div className="flex items-center">
                          <Globe className={cn(
                            "mr-2 h-3 w-3",
                            isPromoted && "text-primary"
                          )} />
                          {feature.name}
                          {feature.apiEndpoint && (
                            <Code className="ml-1 h-3 w-3 text-accent" />
                          )}
                        </div>
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* API Status for Feature Apps */}
          {isFeature() && galaxyConfig.apiEndpoint && (
            <div>
              <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
                API Status
              </h3>
              <div className="px-3 py-2 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-green-700">API Active</span>
                </div>
                <p className="text-xs text-green-600 mt-1 truncate">
                  {galaxyConfig.apiEndpoint}
                </p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* User Section */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
          <div className="flex-1">
            <p className="text-sm font-medium">Account</p>
            <p className="text-xs text-muted-foreground">
              {isCore() ? 'Galaxy Admin' : 'Feature User'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}