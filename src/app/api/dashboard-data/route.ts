import { NextResponse } from 'next/server';
import { bcbhService } from '@/features/arc';

export async function GET() {
  try {
    console.log('🗺️ API: Fetching dashboard data...');
    
    // Fetch layer info and features
    const [layerInfo, features] = await Promise.all([
      bcbhService.getLayerInfo(12),
      bcbhService.fetchFeatures(12, { 
        maxRecordCount: 100, 
        outFields: 'OBJECTID,link_id,net_type,net_dir,SHAPE__Len' 
      })
    ]);

    // Process the data
    const geometryTypes: Record<string, number> = {};
    features.features.forEach((feature: any) => {
      const type = feature.attributes.net_type || 'Unknown';
      geometryTypes[type] = (geometryTypes[type] || 0) + 1;
    });

    const dashboardData = {
      totalFeatures: features.features.length,
      geometryTypes,
      layerInfo,
      sampleFeatures: features.features.slice(0, 5),
      lastUpdated: new Date().toISOString(),
      serviceStatus: 'success'
    };

    console.log('🗺️ API: Successfully fetched dashboard data:', {
      featureCount: dashboardData.totalFeatures,
      networkTypes: Object.keys(dashboardData.geometryTypes).length
    });

    return NextResponse.json({ 
      success: true, 
      data: dashboardData 
    });
  } catch (error) {
    console.error('🗺️ API: Error fetching dashboard data:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
