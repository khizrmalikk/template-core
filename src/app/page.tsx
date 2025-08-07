import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { galaxyConfig } from '@/config/galaxy.config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Sparkles, Zap, Globe, Shield, Rocket, Star } from 'lucide-react';

export default async function HomePage() {
  const { userId } = await auth();
  
  // If user is already signed in, redirect to dashboard
  if (userId) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-sm fixed top-0 w-full z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">{galaxyConfig.name.split(' - ')[0]}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="h-4 w-4" />
            Welcome to the Galaxy System
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {galaxyConfig.name}
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
            {galaxyConfig.tagline}
          </p>
          
          {galaxyConfig.description && (
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {galaxyConfig.description}
            </p>
          )}
          
          <div className="flex gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="gap-2">
                Launch Your Galaxy <Rocket className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="gap-2">
                Explore Features <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Your Galaxy of Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful, interconnected tools that work seamlessly together or standalone
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Core Feature Card */}
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Galaxy Core</CardTitle>
                </div>
                <CardDescription>
                  The central hub that connects all your features together
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                    Unified dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                    Activity tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                    Feature integration
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Planet Feature Cards */}
            {galaxyConfig.related?.map((feature) => (
              <Card key={feature.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <Globe className="h-6 w-6 text-secondary" />
                    </div>
                    <CardTitle>{feature.name}</CardTitle>
                  </div>
                  <CardDescription>
                    Specialized tool in your galaxy ecosystem
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Works standalone or integrates with the core system
                    </p>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={feature.url} target="_blank" rel="noopener noreferrer">
                        Explore <ArrowRight className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-card">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Why Choose the Galaxy System?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A revolutionary approach to building and scaling SaaS applications
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="inline-flex p-3 bg-primary/10 rounded-full mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Modular Design</h3>
              <p className="text-muted-foreground">
                Each feature is independent, allowing for flexible deployment and scaling
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex p-3 bg-secondary/10 rounded-full mb-4">
                <Shield className="h-8 w-8 text-secondary" />
              </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Secure by Default</h3>
              <p className="text-muted-foreground">
                Built-in authentication and secure API communication between features
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex p-3 bg-accent/10 rounded-full mb-4">
                <Rocket className="h-8 w-8 text-accent" />
              </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Ready to Scale</h3>
              <p className="text-muted-foreground">
                Add new features to your galaxy without touching existing code
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-12 text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Build Your Galaxy?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join the future of modular SaaS development
            </p>
            <Link href="/sign-up">
              <Button size="lg" variant="secondary" className="gap-2">
                Get Started Free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2024 {galaxyConfig.name}. Built with the Galaxy System Architecture.</p>
        </div>
      </footer>
    </div>
  );
}