import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { galaxyConfig } from '@/config/galaxy.config';
import { getDashboardConfig, isCore, isFeature, getFeatureEndpoints, getBranding } from '@/lib/galaxy-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRight, Sparkles, Home, Zap, BarChart, Globe, Code, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { APITester } from '@/components/api-tester';

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/');
  }

  const dashboardConfig = getDashboardConfig();
  const branding = getBranding();
  const availableAPIs = getFeatureEndpoints();

  return (
    <div className="flex-1 space-y-8 p-8">
      {/* Hero Section with Primary Color Gradient */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary to-secondary p-8 text-primary-foreground">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-8 w-8" />
            <h1 className="text-4xl font-bold">{dashboardConfig.title}</h1>
          </div>
          <p className="text-xl opacity-90 mb-6">{dashboardConfig.subtitle}</p>
          {galaxyConfig.description && (
            <p className="text-lg opacity-80 max-w-2xl">{galaxyConfig.description}</p>
          )}
          
          {/* Feature App: Link back to core */}
          {dashboardConfig.showCorePromotion && galaxyConfig.coreAppUrl && (
            <div className="mt-6">
              <Button asChild variant="secondary" size="lg">
                <a href={galaxyConfig.coreAppUrl} className="inline-flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Back to Galaxy Dashboard
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          )}
        </div>
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Color Palette Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Colors</CardTitle>
          <CardDescription>
            Your custom color palette from galaxy config
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-medium">
                Primary
              </div>
              <p className="text-xs text-muted-foreground text-center">Main brand color</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-secondary flex items-center justify-center text-secondary-foreground font-medium">
                Secondary
              </div>
              <p className="text-xs text-muted-foreground text-center">Supporting actions</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-accent flex items-center justify-center text-accent-foreground font-medium">
                Accent
              </div>
              <p className="text-xs text-muted-foreground text-center">Highlights & CTAs</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-muted flex items-center justify-center text-muted-foreground font-medium">
                Muted
              </div>
              <p className="text-xs text-muted-foreground text-center">Backgrounds</p>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-3">
            <Button>Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link Button</Button>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            <Alert className="border-primary/20 bg-primary/5">
              <AlertDescription>
                This is a primary themed alert message
              </AlertDescription>
            </Alert>
            <Alert className="border-secondary/20 bg-secondary/5">
              <AlertDescription>
                This is a secondary themed alert
              </AlertDescription>
            </Alert>
            <Alert className="border-accent/20 bg-accent/5">
              <AlertDescription>
                This is an accent themed alert
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Core App: Features Grid */}
      {isCore() && dashboardConfig.showFeatureGrid && galaxyConfig.related && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Your Galaxy Features</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {galaxyConfig.related.map((feature) => (
              <Card key={feature.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {feature.name}
                    <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </CardTitle>
                  <CardDescription>
                    {feature.apiEndpoint ? 'API-enabled feature' : 'External feature'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <Button asChild className="flex-1">
                      <a href={feature.url} target="_blank" rel="noopener noreferrer">
                        Launch
                      </a>
                    </Button>
                    {feature.apiEndpoint && (
                      <Button variant="outline" className="flex-1">
                        Test API
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Feature App: Feature-specific UI */}
      {isFeature() && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Feature Tools</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-blue-600" />
                  API Endpoint
                </CardTitle>
                <CardDescription>
                  Your feature's API is ready to use
                </CardDescription>
              </CardHeader>
              <CardContent>
                {galaxyConfig.apiEndpoint ? (
                  <div className="space-y-2">
                    <code className="text-xs bg-gray-100 p-2 rounded block overflow-x-auto">
                      {galaxyConfig.apiEndpoint}
                    </code>
                    <Button variant="outline" size="sm" className="w-full">
                      View Documentation
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No API endpoint configured
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Show sibling features for feature apps */}
            {availableAPIs.map((api) => (
              <Card key={api.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-600" />
                    {api.name}
                  </CardTitle>
                  <CardDescription>
                    Integrate with sibling feature
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <a href={api.url} target="_blank" rel="noopener noreferrer">
                        Visit
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions - Different for Core vs Feature */}
      {dashboardConfig.showQuickActions && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {isCore() ? (
              <>
                <Button variant="outline" className="h-24 flex-col gap-2">
                  <span className="text-2xl">🚀</span>
                  <span>Add Feature</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2">
                  <span className="text-2xl">📊</span>
                  <span>View Analytics</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2">
                  <span className="text-2xl">👥</span>
                  <span>Manage Users</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2">
                  <span className="text-2xl">⚙️</span>
                  <span>Settings</span>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="h-24 flex-col gap-2">
                  <span className="text-2xl">📝</span>
                  <span>Create New</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2">
                  <span className="text-2xl">🔌</span>
                  <span>API Settings</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2">
                  <span className="text-2xl">📈</span>
                  <span>Usage Stats</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2">
                  <span className="text-2xl">💬</span>
                  <span>Support</span>
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Stats Section - Adapts based on type */}
      {dashboardConfig.showActivityStats && (
        <div className="grid gap-6 md:grid-cols-3">
          {isCore() ? (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Connected Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{galaxyConfig.related?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Features in your galaxy</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    API Integrations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {galaxyConfig.related?.filter(f => f.apiEndpoint).length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Active API connections</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Across all features</p>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    API Calls Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Requests processed</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Response Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0ms</div>
                  <p className="text-xs text-muted-foreground">Average latency</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Success Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">100%</div>
                  <p className="text-xs text-muted-foreground">API reliability</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}

      {/* API Testing Section */}
      <APITester />

      {/* Info Alert */}
      <Alert>
        <AlertDescription>
          {isCore() 
            ? "This is your galaxy's core dashboard. Add features and they'll appear here automatically."
            : `This is the ${galaxyConfig.name} feature dashboard. ${galaxyConfig.promoteCore ? 'Visit the main galaxy for more features.' : ''}`
          }
        </AlertDescription>
      </Alert>
    </div>
  );
}