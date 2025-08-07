import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { galaxyConfig } from '@/config/galaxy.config';
import { isCore } from '@/lib/galaxy-utils';
import { callFeatureAPI, batchCallFeatureAPIs } from '@/lib/fetchers';

/**
 * Core orchestration API endpoint
 * This demonstrates how the core app can coordinate multiple feature APIs
 */
export async function POST(request: NextRequest) {
  // Check authentication
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    );
  }

  // Check if this is a core app
  if (!isCore()) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'This endpoint is only available for core apps' 
      },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { features, payload } = body;

    // Validate requested features
    if (!features || !Array.isArray(features)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Please provide features array with feature IDs to call' 
        },
        { status: 400 }
      );
    }

    // Find the requested features in our config
    const availableFeatures = galaxyConfig.related?.filter(
      f => f.apiEndpoint && features.includes(f.id)
    ) || [];

    if (availableFeatures.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No valid features with API endpoints found' 
        },
        { status: 400 }
      );
    }

    // Call all requested feature APIs in parallel
    const apiCalls = availableFeatures.map(feature => ({
      endpoint: feature.apiEndpoint!,
      payload: {
        ...payload,
        calledFrom: 'galaxy-core',
        coreId: galaxyConfig.id,
        userId
      }
    }));

    const results = await batchCallFeatureAPIs(apiCalls);

    // Combine results
    const response = {
      success: true,
      orchestrationId: `orch_${Date.now()}`,
      timestamp: new Date().toISOString(),
      calledFeatures: availableFeatures.map((feature, index) => ({
        featureId: feature.id,
        featureName: feature.name,
        endpoint: feature.apiEndpoint,
        success: results[index].success,
        data: results[index].data,
        error: results[index].error
      })),
      summary: {
        total: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Orchestration error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to orchestrate feature calls',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to list available features with APIs
 */
export async function GET() {
  if (!isCore()) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'This endpoint is only available for core apps' 
      },
      { status: 400 }
    );
  }

  const availableFeatures = galaxyConfig.related?.filter(f => f.apiEndpoint) || [];

  return NextResponse.json({
    success: true,
    coreId: galaxyConfig.id,
    coreName: galaxyConfig.name,
    availableFeatures: availableFeatures.map(f => ({
      id: f.id,
      name: f.name,
      url: f.url,
      apiEndpoint: f.apiEndpoint,
      canOrchestrate: true
    })),
    totalFeatures: galaxyConfig.related?.length || 0,
    apiEnabledFeatures: availableFeatures.length
  });
}