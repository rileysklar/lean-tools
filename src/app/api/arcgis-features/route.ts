import { NextResponse } from 'next/server';
import { bcbhService } from '@/features/arc/services/arcgis-service';

export async function GET() {
  try {
    console.log('🗺️ API: Fetching ArcGIS features for map...');
    
    // Fetch features from layer 12 (BCBH Preliminary Segments)
    const features = await bcbhService.fetchFeatures(12, {
      maxRecordCount: 100, // Limit for performance
      outFields: 'OBJECTID,link_id,net_type,net_dir,SHAPE__Len',
      returnGeometry: true
    });

    // Convert to GeoJSON
    const geoJSON = bcbhService.convertToGeoJSON(features.features, features.geometryType, features.spatialReference);

    console.log('🗺️ API: Successfully converted features to GeoJSON:', {
      featureCount: geoJSON.features.length,
      geometryType: features.geometryType
    });

    return NextResponse.json({
      success: true,
      geoJSON,
      metadata: {
        source: 'ArcGIS FeatureServer',
        layerId: 12,
        layerName: 'BCBH Preliminary Segments',
        featureCount: geoJSON.features.length,
        geometryType: features.geometryType,
        spatialReference: features.spatialReference
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('🗺️ API: Error fetching ArcGIS features:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
