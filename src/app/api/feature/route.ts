import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { galaxyConfig } from '@/config/galaxy.config';
import { isFeature } from '@/lib/galaxy-utils';

/**
 * Example API endpoint for feature apps
 * This demonstrates how a feature app exposes its functionality
 */
export async function POST(request: NextRequest) {
  // Optional: Check authentication for protected APIs
  const { userId } = await auth();
  
  // Check if this is a feature app
  if (!isFeature()) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'This endpoint is only available for feature apps' 
      },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    
    // Example feature processing
    // Replace this with your actual feature logic
    const result = {
      featureId: galaxyConfig.id,
      featureName: galaxyConfig.name,
      processed: true,
      timestamp: new Date().toISOString(),
      input: body,
      output: {
        // Your feature's output here
        message: `Processed by ${galaxyConfig.name}`,
        data: {
          // Feature-specific data
        }
      },
      metadata: {
        userId: userId || 'anonymous',
        apiVersion: '1.0.0'
      }
    };

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Feature API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process request',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    feature: galaxyConfig.id,
    name: galaxyConfig.name,
    type: galaxyConfig.type,
    apiEndpoint: galaxyConfig.apiEndpoint,
    timestamp: new Date().toISOString()
  });
}