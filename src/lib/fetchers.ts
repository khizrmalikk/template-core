/**
 * Enhanced utility functions for calling external feature APIs
 * Supports both core orchestration and feature-to-feature communication
 */

import { isCore, isFeature } from './galaxy-utils';

interface FeatureAPIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface FeatureAPIOptions {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  includeAuth?: boolean;
}

/**
 * Call an external feature API endpoint
 * @param endpoint - The full URL of the API endpoint
 * @param payload - The data to send in the request body
 * @param options - Additional options for the request
 * @returns The API response
 */
export async function callFeatureAPI<T = any>(
  endpoint: string,
  payload: any,
  options: FeatureAPIOptions = {}
): Promise<FeatureAPIResponse<T>> {
  const { 
    headers = {}, 
    timeout = 30000, 
    retries = 1,
    includeAuth = false
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  let lastError: Error | null = null;

  // Add caller identification
  const enhancedPayload = {
    ...payload,
    _metadata: {
      callerType: isCore() ? 'core' : 'feature',
      timestamp: new Date().toISOString()
    }
  };

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(enhancedPayload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error || `API request failed with status ${response.status}`,
          message: errorData.message
        };
      }

      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error) {
      lastError = error as Error;
      
      // If it's the last attempt, return the error
      if (attempt === retries - 1) {
        clearTimeout(timeoutId);
        
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            return {
              success: false,
              error: 'Request timeout',
              message: `The request took longer than ${timeout}ms`
            };
          }
          return {
            success: false,
            error: error.message,
            message: 'Failed to connect to feature API'
          };
        }
        
        return {
          success: false,
          error: 'Unknown error occurred',
          message: 'Please try again later'
        };
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  return {
    success: false,
    error: lastError?.message || 'Unknown error',
    message: 'All retry attempts failed'
  };
}

/**
 * Batch call multiple feature APIs
 * @param requests - Array of API requests to make
 * @returns Array of API responses
 */
export async function batchCallFeatureAPIs<T = any>(
  requests: Array<{
    endpoint: string;
    payload: any;
    options?: FeatureAPIOptions;
  }>
): Promise<FeatureAPIResponse<T>[]> {
  return Promise.all(
    requests.map(({ endpoint, payload, options }) =>
      callFeatureAPI<T>(endpoint, payload, options)
    )
  );
}

/**
 * Helper to call a specific feature from the galaxy config
 * @param featureId - The ID of the feature from galaxy config
 * @param payload - The data to send
 * @returns The API response
 */
export async function callGalaxyFeature<T = any>(
  featureId: string,
  payload: any
): Promise<FeatureAPIResponse<T>> {
  // Import dynamically to avoid circular dependencies
  const { galaxyConfig } = await import('@/config/galaxy.config');
  
  const feature = galaxyConfig.related?.find(f => f.id === featureId);
  
  if (!feature) {
    return {
      success: false,
      error: `Feature ${featureId} not found in galaxy config`,
      message: 'Please check your galaxy configuration'
    };
  }
  
  if (!feature.apiEndpoint) {
    return {
      success: false,
      error: `Feature ${featureId} does not have an API endpoint configured`,
      message: 'This feature may not support API calls'
    };
  }
  
  return callFeatureAPI<T>(feature.apiEndpoint, payload);
}

/**
 * Core-specific: Orchestrate multiple feature calls
 * Only available for core apps
 */
export async function orchestrateFeatures<T = any>(
  featureIds: string[],
  payload: any
): Promise<{
  success: boolean;
  results: Record<string, FeatureAPIResponse<T>>;
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}> {
  if (!isCore()) {
    throw new Error('Orchestration is only available for core apps');
  }

  const { galaxyConfig } = await import('@/config/galaxy.config');
  
  const results: Record<string, FeatureAPIResponse<T>> = {};
  const features = galaxyConfig.related?.filter(
    f => featureIds.includes(f.id) && f.apiEndpoint
  ) || [];

  // Call all features in parallel
  const responses = await Promise.all(
    features.map(async (feature) => {
      const response = await callFeatureAPI<T>(
        feature.apiEndpoint!,
        payload
      );
      return { id: feature.id, response };
    })
  );

  // Map responses to results object
  responses.forEach(({ id, response }) => {
    results[id] = response;
  });

  const successful = Object.values(results).filter(r => r.success).length;
  const failed = Object.values(results).filter(r => !r.success).length;

  return {
    success: successful > 0,
    results,
    summary: {
      total: features.length,
      successful,
      failed
    }
  };
}

/**
 * Feature-specific: Call sibling features
 * Only available for feature apps to call other features
 */
export async function callSiblingFeature<T = any>(
  siblingId: string,
  payload: any
): Promise<FeatureAPIResponse<T>> {
  if (!isFeature()) {
    return {
      success: false,
      error: 'Sibling calls are only available for feature apps',
      message: 'Core apps should use orchestrateFeatures instead'
    };
  }

  const { galaxyConfig } = await import('@/config/galaxy.config');
  
  // Feature apps can call siblings listed in their config
  const sibling = galaxyConfig.related?.find(f => f.id === siblingId);
  
  if (!sibling) {
    return {
      success: false,
      error: `Sibling feature ${siblingId} not found`,
      message: 'This feature is not configured as a sibling'
    };
  }

  if (!sibling.apiEndpoint) {
    return {
      success: false,
      error: `Sibling ${siblingId} does not have an API endpoint`,
      message: 'This sibling feature may not support API calls'
    };
  }

  // Add metadata about the calling feature
  const enhancedPayload = {
    ...payload,
    _caller: {
      id: galaxyConfig.id,
      name: galaxyConfig.name,
      type: 'sibling'
    }
  };

  return callFeatureAPI<T>(sibling.apiEndpoint, enhancedPayload);
}

/**
 * Health check for a feature API
 * @param endpoint - The API endpoint to check
 * @returns Whether the API is healthy
 */
export async function checkFeatureHealth(endpoint: string): Promise<boolean> {
  try {
    const healthEndpoint = endpoint.replace(/\/[^\/]*$/, '/health')
      .replace(/\/$/, '') + (endpoint.includes('/api/') ? '' : '/health');
    
    const response = await fetch(healthEndpoint, {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });
    
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Check health of all configured features
 * Useful for core apps to monitor their galaxy
 */
export async function checkGalaxyHealth(): Promise<Record<string, boolean>> {
  const { galaxyConfig } = await import('@/config/galaxy.config');
  
  if (!galaxyConfig.related) {
    return {};
  }

  const healthChecks = await Promise.all(
    galaxyConfig.related
      .filter(f => f.apiEndpoint)
      .map(async (feature) => ({
        id: feature.id,
        healthy: await checkFeatureHealth(feature.apiEndpoint!)
      }))
  );

  const healthStatus: Record<string, boolean> = {};
  healthChecks.forEach(({ id, healthy }) => {
    healthStatus[id] = healthy;
  });

  return healthStatus;
}