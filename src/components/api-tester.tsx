'use client';

import { useState } from 'react';
import { galaxyConfig } from '@/config/galaxy.config';
import { isCore, isFeature, getFeatureEndpoints } from '@/lib/galaxy-utils';
import { callGalaxyFeature, orchestrateFeatures, callSiblingFeature, checkGalaxyHealth } from '@/lib/fetchers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Play, Heart, Zap } from 'lucide-react';

/**
 * API Tester Component
 * Demonstrates how to use the API integration in both core and feature apps
 */
export function APITester() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [healthStatus, setHealthStatus] = useState<Record<string, boolean>>({});
  const availableAPIs = getFeatureEndpoints();

  // Test calling a single feature API (works for both core and feature)
  const testSingleAPI = async (featureId: string) => {
    setLoading(true);
    try {
      const result = await callGalaxyFeature(featureId, {
        test: true,
        message: `Hello from ${galaxyConfig.name}`,
        timestamp: new Date().toISOString()
      });
      setResults(result);
    } catch (error) {
      setResults({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Test orchestrating multiple features (core only)
  const testOrchestration = async () => {
    if (!isCore()) return;
    
    setLoading(true);
    try {
      const featureIds = availableAPIs.map(f => f.id);
      const result = await orchestrateFeatures(featureIds, {
        orchestrated: true,
        message: 'Orchestrated call from galaxy core',
        timestamp: new Date().toISOString()
      });
      setResults(result);
    } catch (error) {
      setResults({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Test calling a sibling feature (feature apps only)
  const testSiblingCall = async (siblingId: string) => {
    if (!isFeature()) return;
    
    setLoading(true);
    try {
      const result = await callSiblingFeature(siblingId, {
        fromSibling: true,
        message: `Sibling call from ${galaxyConfig.name}`,
        timestamp: new Date().toISOString()
      });
      setResults(result);
    } catch (error) {
      setResults({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Check health of all features
  const checkHealth = async () => {
    setLoading(true);
    try {
      const health = await checkGalaxyHealth();
      setHealthStatus(health);
      setResults({ 
        success: true, 
        data: health,
        message: 'Health check completed'
      });
    } catch (error) {
      setResults({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            API Integration Tester
          </CardTitle>
          <CardDescription>
            Test API connections between galaxy features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Health Check */}
          <div className="flex items-center gap-4">
            <Button 
              onClick={checkHealth} 
              disabled={loading}
              variant="outline"
              className="gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Heart className="h-4 w-4" />
              )}
              Check Galaxy Health
            </Button>
            {Object.keys(healthStatus).length > 0 && (
              <div className="flex gap-2">
                {Object.entries(healthStatus).map(([id, healthy]) => (
                  <div 
                    key={id}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      healthy 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {id}: {healthy ? '✓' : '✗'}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Core: Orchestration Test */}
          {isCore() && availableAPIs.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Core Orchestration</h4>
              <Button 
                onClick={testOrchestration}
                disabled={loading}
                className="gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                Orchestrate All Features
              </Button>
            </div>
          )}

          {/* Feature: Sibling Calls */}
          {isFeature() && availableAPIs.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Call Sibling Features</h4>
              <div className="flex flex-wrap gap-2">
                {availableAPIs.map((api) => (
                  <Button
                    key={api.id}
                    onClick={() => testSiblingCall(api.id)}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                  >
                    Call {api.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Both: Individual Feature Calls */}
          {availableAPIs.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Test Individual APIs</h4>
              <div className="flex flex-wrap gap-2">
                {availableAPIs.map((api) => (
                  <Button
                    key={api.id}
                    onClick={() => testSingleAPI(api.id)}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                  >
                    Test {api.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* No APIs Available */}
          {availableAPIs.length === 0 && (
            <Alert>
              <AlertDescription>
                No feature APIs configured. Add features with API endpoints to your galaxy config.
              </AlertDescription>
            </Alert>
          )}

          {/* Results Display */}
          {results && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">API Response:</h4>
              <pre className="text-xs overflow-auto max-h-60">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}